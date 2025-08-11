import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { AdminUser, loginAdminSchema, insertAdminUserSchema, passwordResetSchema, passwordResetConfirmSchema } from "@shared/schema";
import { randomUUID } from "crypto";

declare global {
  namespace Express {
    interface User extends AdminUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAdminAuth(app: Express) {
  // Setup session middleware for admin authentication
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport serialization for admin users
  passport.serializeUser((user: AdminUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const adminUser = await storage.getAdminUser(id);
      done(null, adminUser || false);
    } catch (error) {
      done(error);
    }
  });

  // Admin authentication strategy
  passport.use('admin-local', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const adminUser = await storage.getAdminUserByEmail(email);
        if (!adminUser || !adminUser.isActive) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        const isValid = await comparePasswords(password, adminUser.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Update last login
        await storage.updateAdminLastLogin(adminUser.id);
        
        return done(null, adminUser);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Admin routes
  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate('admin-local', (err: any, user: AdminUser | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || 'Authentication failed' });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          role: user.role 
        });
      });
    })(req, res, next);
  });

  app.post("/api/admin/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/admin/me", requireAdminAuth, (req, res) => {
    const user = req.user!;
    res.json({ 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      role: user.role 
    });
  });

  // Create admin user (only for initial setup)
  app.post("/api/admin/create", async (req, res, next) => {
    try {
      const validation = insertAdminUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const { email, password, firstName, lastName, role } = validation.data;
      
      // Check if admin user already exists
      const existingUser = await storage.getAdminUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Admin user already exists' });
      }

      const hashedPassword = await hashPassword(password);
      const adminUser = await storage.createAdminUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });

      res.status(201).json({
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
      });
    } catch (error) {
      next(error);
    }
  });

  // Password reset request
  app.post("/api/admin/password-reset", async (req, res, next) => {
    try {
      const validation = passwordResetSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const { email } = validation.data;
      const adminUser = await storage.getAdminUserByEmail(email);
      
      if (!adminUser) {
        // Don't reveal if email exists or not
        return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
      }

      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      await storage.createPasswordResetToken(email, token, expiresAt);
      
      // TODO: Send email with reset link
      // For now, just return success (in production, send actual email)
      console.log(`Password reset token for ${email}: ${token}`);
      
      res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
      next(error);
    }
  });

  // Password reset confirmation
  app.post("/api/admin/password-reset/confirm", async (req, res, next) => {
    try {
      const validation = passwordResetConfirmSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const { token, password } = validation.data;
      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const adminUser = await storage.getAdminUserByEmail(resetToken.email);
      if (!adminUser) {
        return res.status(400).json({ error: 'Admin user not found' });
      }

      const hashedPassword = await hashPassword(password);
      await storage.updateAdminUser(adminUser.id, { password: hashedPassword });
      await storage.markPasswordResetTokenUsed(token);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  });

  // Change password (for logged-in users)
  app.post("/api/admin/change-password", requireAdminAuth, async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      const adminUser = req.user;
      if (!adminUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const isValidPassword = await comparePasswords(currentPassword, adminUser.password);
      
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateAdminUser(adminUser.id, { password: hashedPassword });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  });

  // Update profile
  app.put("/api/admin/profile", requireAdminAuth, async (req, res, next) => {
    try {
      const { firstName, lastName, email } = req.body;
      
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
      }

      const adminUser = req.user;
      if (!adminUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if email is already taken by another user
      if (email !== adminUser.email) {
        const existingUser = await storage.getAdminUserByEmail(email);
        if (existingUser && existingUser.id !== adminUser.id) {
          return res.status(400).json({ error: 'Email is already taken' });
        }
      }

      const updatedUser = await storage.updateAdminUser(adminUser.id, {
        firstName,
        lastName,
        email,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      });
    } catch (error) {
      next(error);
    }
  });
}

// Middleware to require admin authentication
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Middleware to require specific admin role
export function requireAdminRole(roles: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Admin role has access to everything
    if (userRole === 'admin' || allowedRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  };
}
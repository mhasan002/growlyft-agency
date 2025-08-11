import { 
  type User, type InsertUser, type ContactSubmission, type InsertContact, 
  type DiscoveryCallSubmission, type InsertDiscoveryCall, type TalkGrowthSubmission, type InsertTalkGrowth,
  type AdminUser, type InsertAdminUser, type FormConfig, type InsertFormConfig,
  type BlogPost, type InsertBlogPost, type PasswordResetToken,
  users, contactSubmissions, discoveryCallSubmissions, talkGrowthSubmissions,
  adminUsers, formConfigs, blogPosts, passwordResetTokens
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Regular users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact submissions
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  createDiscoveryCallSubmission(discoveryCall: InsertDiscoveryCall): Promise<DiscoveryCallSubmission>;
  createTalkGrowthSubmission(talkGrowth: InsertTalkGrowth): Promise<TalkGrowthSubmission>;
  
  // Admin users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  updateAdminLastLogin(id: string): Promise<void>;
  
  // Form configurations
  getAllFormConfigs(): Promise<FormConfig[]>;
  getFormConfig(id: string): Promise<FormConfig | undefined>;
  getFormConfigByName(formName: string): Promise<FormConfig | undefined>;
  createFormConfig(formConfig: InsertFormConfig): Promise<FormConfig>;
  updateFormConfig(id: string, updates: Partial<InsertFormConfig>): Promise<FormConfig | undefined>;
  deleteFormConfig(id: string): Promise<boolean>;
  
  // Blog posts
  getAllBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // Password reset tokens
  createPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private discoveryCallSubmissions: Map<string, DiscoveryCallSubmission>;
  private talkGrowthSubmissions: Map<string, TalkGrowthSubmission>;
  private adminUsers: Map<string, AdminUser>;
  private formConfigs: Map<string, FormConfig>;
  private blogPosts: Map<string, BlogPost>;
  private passwordResetTokens: Map<string, PasswordResetToken>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.discoveryCallSubmissions = new Map();
    this.talkGrowthSubmissions = new Map();
    this.adminUsers = new Map();
    this.formConfigs = new Map();
    this.blogPosts = new Map();
    this.passwordResetTokens = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const id = randomUUID();
    const contactSubmission: ContactSubmission = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async createDiscoveryCallSubmission(insertDiscoveryCall: InsertDiscoveryCall): Promise<DiscoveryCallSubmission> {
    const id = randomUUID();
    const discoveryCallSubmission: DiscoveryCallSubmission = {
      ...insertDiscoveryCall,
      id,
      createdAt: new Date(),
    };
    this.discoveryCallSubmissions.set(id, discoveryCallSubmission);
    return discoveryCallSubmission;
  }

  async createTalkGrowthSubmission(insertTalkGrowth: InsertTalkGrowth): Promise<TalkGrowthSubmission> {
    const id = randomUUID();
    const talkGrowthSubmission: TalkGrowthSubmission = {
      ...insertTalkGrowth,
      id,
      createdAt: new Date(),
    };
    this.talkGrowthSubmissions.set(id, talkGrowthSubmission);
    return talkGrowthSubmission;
  }

  // Admin user methods for MemStorage
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(user => user.email === email);
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const adminUser: AdminUser = {
      ...insertAdminUser,
      id,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async updateAdminUser(id: string, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const existing = this.adminUsers.get(id);
    if (!existing) return undefined;
    
    const updated: AdminUser = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, updated);
    return updated;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    const existing = this.adminUsers.get(id);
    if (existing) {
      this.adminUsers.set(id, { ...existing, lastLoginAt: new Date() });
    }
  }

  // Form config methods for MemStorage
  async getAllFormConfigs(): Promise<FormConfig[]> {
    return Array.from(this.formConfigs.values()).sort((a, b) => 
      a.location.localeCompare(b.location) || a.displayName.localeCompare(b.displayName)
    );
  }

  async getFormConfig(id: string): Promise<FormConfig | undefined> {
    return this.formConfigs.get(id);
  }

  async getFormConfigByName(formName: string): Promise<FormConfig | undefined> {
    return Array.from(this.formConfigs.values()).find(config => config.formName === formName);
  }

  async createFormConfig(insertFormConfig: InsertFormConfig): Promise<FormConfig> {
    const id = randomUUID();
    const formConfig: FormConfig = {
      ...insertFormConfig,
      id,
      buttonName: insertFormConfig.buttonName || null,
      googleSheetUrl: insertFormConfig.googleSheetUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.formConfigs.set(id, formConfig);
    return formConfig;
  }

  async updateFormConfig(id: string, updates: Partial<InsertFormConfig>): Promise<FormConfig | undefined> {
    const existing = this.formConfigs.get(id);
    if (!existing) return undefined;
    
    const updated: FormConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.formConfigs.set(id, updated);
    return updated;
  }

  async deleteFormConfig(id: string): Promise<boolean> {
    return this.formConfigs.delete(id);
  }

  // Blog post methods for MemStorage
  async getAllBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    if (publishedOnly) {
      posts = posts.filter(post => post.isPublished);
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      featuredImage: insertBlogPost.featuredImage || null,
      readTime: insertBlogPost.readTime || "5 min read",
      publishedAt: insertBlogPost.isPublished ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated: BlogPost = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
      publishedAt: updates.isPublished ? new Date() : existing.publishedAt,
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Password reset token methods for MemStorage
  async createPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const id = randomUUID();
    const passwordResetToken: PasswordResetToken = {
      id,
      email,
      token,
      expiresAt,
      usedAt: null,
      createdAt: new Date(),
    };
    this.passwordResetTokens.set(token, passwordResetToken);
    return passwordResetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    const existing = this.passwordResetTokens.get(token);
    if (existing) {
      this.passwordResetTokens.set(token, { ...existing, usedAt: new Date() });
    }
  }
}

// Database storage implementation using Drizzle and Supabase
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    try {
      const result = await db.insert(contactSubmissions).values(insertContact).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating contact submission:", error);
      throw error;
    }
  }

  async createDiscoveryCallSubmission(insertDiscoveryCall: InsertDiscoveryCall): Promise<DiscoveryCallSubmission> {
    try {
      const result = await db.insert(discoveryCallSubmissions).values(insertDiscoveryCall).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating discovery call submission:", error);
      throw error;
    }
  }

  async createTalkGrowthSubmission(insertTalkGrowth: InsertTalkGrowth): Promise<TalkGrowthSubmission> {
    try {
      const result = await db.insert(talkGrowthSubmissions).values(insertTalkGrowth).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating talk growth submission:", error);
      throw error;
    }
  }

  // Admin user methods
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    try {
      const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting admin user:", error);
      return undefined;
    }
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    try {
      const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting admin user by email:", error);
      return undefined;
    }
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    try {
      const result = await db.insert(adminUsers).values(insertAdminUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  }

  async updateAdminUser(id: string, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    try {
      const result = await db.update(adminUsers)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(adminUsers.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating admin user:", error);
      return undefined;
    }
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    try {
      await db.update(adminUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(adminUsers.id, id));
    } catch (error) {
      console.error("Error updating admin last login:", error);
    }
  }

  // Form config methods
  async getAllFormConfigs(): Promise<FormConfig[]> {
    try {
      return await db.select().from(formConfigs).orderBy(formConfigs.location, formConfigs.displayName);
    } catch (error) {
      console.error("Error getting form configs:", error);
      return [];
    }
  }

  async getFormConfig(id: string): Promise<FormConfig | undefined> {
    try {
      const result = await db.select().from(formConfigs).where(eq(formConfigs.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting form config:", error);
      return undefined;
    }
  }

  async getFormConfigByName(formName: string): Promise<FormConfig | undefined> {
    try {
      const result = await db.select().from(formConfigs).where(eq(formConfigs.formName, formName)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting form config by name:", error);
      return undefined;
    }
  }

  async createFormConfig(insertFormConfig: InsertFormConfig): Promise<FormConfig> {
    try {
      const result = await db.insert(formConfigs).values(insertFormConfig).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating form config:", error);
      throw error;
    }
  }

  async updateFormConfig(id: string, updates: Partial<InsertFormConfig>): Promise<FormConfig | undefined> {
    try {
      const result = await db.update(formConfigs)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(formConfigs.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating form config:", error);
      return undefined;
    }
  }

  async deleteFormConfig(id: string): Promise<boolean> {
    try {
      const result = await db.delete(formConfigs).where(eq(formConfigs.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting form config:", error);
      return false;
    }
  }

  // Blog post methods
  async getAllBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    try {
      let result;
      if (publishedOnly) {
        result = await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
      } else {
        result = await db.select().from(blogPosts);
      }
      return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error getting blog posts:", error);
      return [];
    }
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting blog post:", error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting blog post by slug:", error);
      return undefined;
    }
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    try {
      const blogPostData = {
        ...insertBlogPost,
        publishedAt: insertBlogPost.isPublished ? new Date() : null,
      };
      const result = await db.insert(blogPosts).values(blogPostData).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
        publishedAt: updates.isPublished ? new Date() : undefined,
      };
      const result = await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating blog post:", error);
      return undefined;
    }
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }

  // Password reset token methods
  async createPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    try {
      const result = await db.insert(passwordResetTokens).values({
        email,
        token,
        expiresAt,
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating password reset token:", error);
      throw error;
    }
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    try {
      const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting password reset token:", error);
      return undefined;
    }
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    try {
      await db.update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.token, token));
    } catch (error) {
      console.error("Error marking password reset token as used:", error);
    }
  }
}

// Use DATABASE_URL environment variable to determine storage type
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

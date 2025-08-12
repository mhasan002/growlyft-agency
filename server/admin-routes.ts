import type { Express } from "express";
import { storage } from "./storage";
import { requireAdminAuth, requireAdminRole } from "./admin-auth";
import { z } from "zod";
import { 
  insertFormConfigSchema, 
  insertBlogPostSchema,
  updateAdminUserSchema,
  FormConfig,
  BlogPost 
} from "@shared/schema";

export function registerAdminRoutes(app: Express) {
  // Admin Users Routes - only admins can access these
  app.get("/api/admin/users", requireAdminAuth, requireAdminRole(['admin']), async (req, res, next) => {
    try {
      const users = await storage.getAllAdminUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/users/:id", requireAdminAuth, requireAdminRole(['admin']), async (req, res, next) => {
    try {
      const validation = updateAdminUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      // Remove empty password field to avoid updating it
      if (validation.data.password === "") {
        delete validation.data.password;
      }

      const user = await storage.updateAdminUser(req.params.id, validation.data);
      if (!user) {
        return res.status(404).json({ error: 'Admin user not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/users/:id", requireAdminAuth, requireAdminRole(['admin']), async (req, res, next) => {
    try {
      const success = await storage.deleteAdminUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Admin user not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Form Configuration Routes
  app.get("/api/admin/forms", requireAdminAuth, requireAdminRole(['admin', 'form_manager']), async (req, res, next) => {
    try {
      const forms = await storage.getAllFormConfigs();
      res.json(forms);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/forms/:id", requireAdminAuth, requireAdminRole(['admin', 'form_manager']), async (req, res, next) => {
    try {
      const form = await storage.getFormConfig(req.params.id);
      if (!form) {
        return res.status(404).json({ error: 'Form configuration not found' });
      }
      res.json(form);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/forms", requireAdminAuth, requireAdminRole(['admin', 'form_manager']), async (req, res, next) => {
    try {
      const validation = insertFormConfigSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const form = await storage.createFormConfig(validation.data);
      res.status(201).json(form);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/forms/:id", requireAdminAuth, requireAdminRole(['admin', 'form_manager']), async (req, res, next) => {
    try {
      const validation = insertFormConfigSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const form = await storage.updateFormConfig(req.params.id, validation.data as any);
      if (!form) {
        return res.status(404).json({ error: 'Form configuration not found' });
      }
      res.json(form);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/forms/:id", requireAdminAuth, requireAdminRole(['admin', 'form_manager']), async (req, res, next) => {
    try {
      const success = await storage.deleteFormConfig(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Form configuration not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Blog Post Routes
  app.get("/api/admin/posts", requireAdminAuth, requireAdminRole(['admin', 'editor']), async (req, res, next) => {
    try {
      const posts = await storage.getAllBlogPosts(false); // Get all posts, including unpublished
      res.json(posts);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/posts/:id", requireAdminAuth, requireAdminRole(['admin', 'editor']), async (req, res, next) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/posts", requireAdminAuth, requireAdminRole(['admin', 'editor']), async (req, res, next) => {
    try {
      const validation = insertBlogPostSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      // Check if slug already exists
      const existingPost = await storage.getBlogPostBySlug(validation.data.slug);
      if (existingPost) {
        return res.status(400).json({ error: 'A post with this slug already exists' });
      }

      const post = await storage.createBlogPost(validation.data);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/posts/:id", requireAdminAuth, requireAdminRole(['admin', 'editor']), async (req, res, next) => {
    try {
      const validation = insertBlogPostSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      // If updating slug, check if it already exists (and it's not the current post)
      if (validation.data.slug) {
        const existingPost = await storage.getBlogPostBySlug(validation.data.slug);
        if (existingPost && existingPost.id !== req.params.id) {
          return res.status(400).json({ error: 'A post with this slug already exists' });
        }
      }

      const post = await storage.updateBlogPost(req.params.id, validation.data);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/posts/:id", requireAdminAuth, requireAdminRole(['admin', 'editor']), async (req, res, next) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Public blog routes (for frontend)
  app.get("/api/blog/posts", async (req, res, next) => {
    try {
      const posts = await storage.getAllBlogPosts(true); // Only published posts
      res.json(posts);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res, next) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  });

  // Form submissions analytics (for admin dashboard)
  app.get("/api/admin/analytics/submissions", requireAdminAuth, async (req, res, next) => {
    try {
      const analytics = await storage.getSubmissionAnalytics();
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });
}
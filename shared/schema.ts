import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("editor"), // admin, editor, form_manager
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Form configurations
export const formConfigs = pgTable("form_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  formName: text("form_name").notNull().unique(), // lets_talk, discovery_call, etc.
  displayName: text("display_name").notNull(),
  buttonName: text("button_name"), // "Let's Work Together", "Get Discovery Call", etc.
  location: text("location").notNull(), // "Home Page", "Services Page", etc.
  recipientEmails: json("recipient_emails").$type<string[]>().notNull().default([]),
  googleSheetUrl: text("google_sheet_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  readTime: text("read_time").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const discoveryCallSubmissions = pgTable("discovery_call_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  businessName: text("business_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  monthlyBudget: text("monthly_budget").notNull(),
  mainGoal: text("main_goal").notNull(),
  readyToInvest: text("ready_to_invest").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const talkGrowthSubmissions = pgTable("talk_growth_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  businessName: text("business_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  monthlyBudget: text("monthly_budget").notNull(),
  servicesInterested: text("services_interested").array().notNull(),
  marketingChallenge: text("marketing_challenge").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").optional().or(z.literal("")),
  businessName: z.string().min(2, "Business name must be at least 2 characters").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  phoneNumber: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
  budget: z.enum(["under_1000", "1000_3000", "3000_5000", "5000_10000", "10000_plus"], {
    required_error: "Please select your budget range",
  }),
});

export const insertDiscoveryCallSchema = createInsertSchema(discoveryCallSubmissions).pick({
  fullName: true,
  businessName: true,
  websiteUrl: true,
  email: true,
  phoneNumber: true,
  monthlyBudget: true,
  mainGoal: true,
  readyToInvest: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  websiteUrl: z.string().min(3, "Please enter your website or social media profile"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  monthlyBudget: z.enum(["under_300", "300_500", "500_1000", "1000_3000", "3000_10000", "10000_plus"], {
    required_error: "Please select your monthly marketing budget",
  }),
  mainGoal: z.string().min(10, "Please describe your main goal (at least 10 characters)"),
  readyToInvest: z.enum(["yes", "not_sure", "no"], {
    required_error: "Please select if you're ready to invest in marketing",
  }),
});

export const insertTalkGrowthSchema = createInsertSchema(talkGrowthSubmissions).pick({
  fullName: true,
  businessName: true,
  websiteUrl: true,
  email: true,
  phoneNumber: true,
  monthlyBudget: true,
  servicesInterested: true,
  marketingChallenge: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  websiteUrl: z.string().min(3, "Please enter your website or social media profile"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  monthlyBudget: z.enum(["under_300", "500_1000", "1000_3000", "3000_5000", "5000_10000", "10000_plus"], {
    required_error: "Please select your minimum monthly budget",
  }),
  servicesInterested: z.array(z.string()).min(1, "Please select at least one service"),
  marketingChallenge: z.string().min(10, "Please describe your biggest challenge (at least 10 characters)"),
});

// Admin schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "editor", "form_manager"], {
    required_error: "Please select a role",
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

export const updateAdminUserSchema = createInsertSchema(adminUsers).pick({
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
}).extend({
  email: z.string().email("Please enter a valid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.enum(["admin", "editor", "form_manager"], {
    required_error: "Please select a role",
  }).optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
});

export const loginAdminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertFormConfigSchema = createInsertSchema(formConfigs).pick({
  formName: true,
  displayName: true,
  buttonName: true,
  location: true,
  recipientEmails: true,
  googleSheetUrl: true,
  isActive: true,
}).extend({
  formName: z.string().min(1, "Form name is required"),
  displayName: z.string().min(1, "Display name is required"),
  buttonName: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  recipientEmails: z.array(z.string().email()).min(1, "At least one recipient email is required"),
  googleSheetUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  isActive: z.boolean().default(true),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  author: true,
  category: true,
  tags: true,
  readTime: true,
  isPublished: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featuredImage: z.string().optional().or(z.literal("")),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  readTime: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertDiscoveryCall = z.infer<typeof insertDiscoveryCallSchema>;
export type DiscoveryCallSubmission = typeof discoveryCallSubmissions.$inferSelect;
export type InsertTalkGrowth = z.infer<typeof insertTalkGrowthSchema>;
export type TalkGrowthSubmission = typeof talkGrowthSubmissions.$inferSelect;

// Admin types
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type UpdateAdminUser = z.infer<typeof updateAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type LoginAdmin = z.infer<typeof loginAdminSchema>;
export type InsertFormConfig = z.infer<typeof insertFormConfigSchema>;
export type FormConfig = typeof formConfigs.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

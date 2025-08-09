import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  message: z.string().min(10, "Message must be at least 10 characters"),
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
  websiteUrl: z.string().url("Please enter a valid website or social media URL"),
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
  websiteUrl: z.string().url("Please enter a valid website or social media URL"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  monthlyBudget: z.enum(["under_300", "500_1000", "1000_3000", "3000_5000", "5000_10000", "10000_plus"], {
    required_error: "Please select your minimum monthly budget",
  }),
  servicesInterested: z.array(z.string()).min(1, "Please select at least one service"),
  marketingChallenge: z.string().min(10, "Please describe your biggest challenge (at least 10 characters)"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertDiscoveryCall = z.infer<typeof insertDiscoveryCallSchema>;
export type DiscoveryCallSubmission = typeof discoveryCallSubmissions.$inferSelect;
export type InsertTalkGrowth = z.infer<typeof insertTalkGrowthSchema>;
export type TalkGrowthSubmission = typeof talkGrowthSubmissions.$inferSelect;

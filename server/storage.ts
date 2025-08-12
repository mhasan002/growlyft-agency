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
  getAllAdminUsers(): Promise<AdminUser[]>;
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, updates: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  updateAdminLastLogin(id: string): Promise<void>;
  deleteAdminUser(id: string): Promise<boolean>;
  
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
  
  // Analytics
  getSubmissionAnalytics(): Promise<{
    totalSubmissions: number;
    recentSubmissions: any[];
    submissionsByForm: Record<string, number>;
  }>;
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
    
    // Initialize with sample blog posts
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample blog posts
    const samplePosts = [
      {
        title: "10 Social Media Strategies That Actually Drive Sales",
        slug: "10-social-media-strategies-drive-sales",
        excerpt: "Discover proven social media strategies that convert followers into paying customers. Learn how to create content that sells without being pushy.",
        content: `# 10 Social Media Strategies That Actually Drive Sales

Social media marketing isn't just about likes and followers—it's about driving real business results. Here are 10 proven strategies that will help you turn your social media presence into a sales machine.

## 1. Create Value-First Content

The key to social media success is providing value before asking for anything in return. Share tips, insights, and solutions that your audience actually needs.

## 2. Use Social Proof

Customer testimonials, reviews, and user-generated content build trust and credibility with potential customers.

## 3. Implement Strategic CTAs

Every post should have a purpose. Whether it's directing traffic to your website or encouraging engagement, make your call-to-action clear and compelling.

## 4. Leverage Stories and Reels

These formats get higher engagement rates and are perfect for behind-the-scenes content that builds authentic connections.

## 5. Engage Authentically

Respond to comments, join conversations, and show the human side of your brand. Authentic engagement builds relationships that convert.

Ready to transform your social media strategy? Let's talk about how we can help you achieve these results.`,
        featuredImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
        author: "Sarah Johnson",
        category: "Social Media Strategy",
        readTime: "8 min read",
        isPublished: true,
        publishedAt: new Date("2025-01-10"),
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-10")
      },
      {
        title: "The Ultimate Guide to Instagram Marketing in 2025",
        slug: "ultimate-guide-instagram-marketing-2025",
        excerpt: "Master Instagram marketing with our comprehensive guide. Learn the latest features, algorithm updates, and proven tactics for growth.",
        content: `# The Ultimate Guide to Instagram Marketing in 2025

Instagram continues to be one of the most powerful platforms for business growth. With over 2 billion active users, it's where your customers are spending their time.

## Understanding the 2025 Algorithm

Instagram's algorithm has evolved significantly. Here's what you need to know:

- **Engagement timing matters more than ever**
- **Reels continue to dominate reach**
- **Story engagement impacts feed visibility**
- **Authentic interactions are prioritized**

## Content Pillars for Success

### 1. Educational Content
Share industry insights, tips, and how-to content that provides genuine value.

### 2. Behind-the-Scenes
Show your team, process, and company culture to build authentic connections.

### 3. User-Generated Content
Encourage customers to share their experiences with your brand.

### 4. Trending Content
Participate in relevant trends and use trending audio to boost reach.

## Advanced Strategies

### Instagram Shopping
Set up Instagram Shopping to make it easy for followers to purchase directly from your posts.

### Influencer Partnerships
Collaborate with micro-influencers in your niche for authentic endorsements.

### Instagram Analytics
Use data to understand what content performs best and optimize your strategy.

Ready to dominate Instagram? We can help you create a winning strategy.`,
        featuredImage: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=400&fit=crop",
        author: "Mike Chen",
        category: "Instagram Marketing",
        readTime: "12 min read",
        isPublished: true,
        publishedAt: new Date("2025-01-08"),
        createdAt: new Date("2025-01-08"),
        updatedAt: new Date("2025-01-08")
      },
      {
        title: "Content Marketing Trends You Can't Ignore",
        slug: "content-marketing-trends-2025",
        excerpt: "Stay ahead of the competition with these emerging content marketing trends. From AI-powered content to interactive experiences.",
        content: `# Content Marketing Trends You Can't Ignore in 2025

The content marketing landscape is constantly evolving. Here are the trends that will define success in 2025.

## 1. AI-Powered Personalization

AI is revolutionizing how we create and deliver content. Personalized content experiences are becoming the norm.

## 2. Interactive Content

Polls, quizzes, and interactive videos are driving higher engagement rates than traditional content.

## 3. Short-Form Video Dominance

TikTok-style short videos are now essential across all platforms, not just TikTok.

## 4. Voice Search Optimization

With the rise of voice assistants, optimizing content for voice search is crucial.

## 5. Sustainability Messaging

Consumers care about environmental impact. Authentic sustainability messaging resonates strongly.

## Implementation Strategies

### Start Small
Pick one or two trends that align with your brand and audience.

### Test and Measure
Use analytics to understand what resonates with your specific audience.

### Stay Authentic
Don't jump on trends just because they're popular. Ensure they fit your brand voice.

Want to implement these trends effectively? Let's create a strategy that works for your brand.`,
        featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        author: "Emily Rodriguez",
        category: "Content Marketing",
        readTime: "6 min read",
        isPublished: true,
        publishedAt: new Date("2025-01-05"),
        createdAt: new Date("2025-01-05"),
        updatedAt: new Date("2025-01-05")
      },
      {
        title: "Facebook Ads vs Google Ads: Which is Right for You?",
        slug: "facebook-ads-vs-google-ads-comparison",
        excerpt: "Compare Facebook Ads and Google Ads to determine the best platform for your business goals, budget, and target audience.",
        content: `# Facebook Ads vs Google Ads: Which is Right for You?

Choosing between Facebook Ads and Google Ads can make or break your digital marketing success. Here's how to decide.

## Understanding the Difference

### Google Ads
- **Intent-based**: Users are actively searching
- **Higher conversion rates**
- **Better for immediate needs**
- **Keyword-focused targeting**

### Facebook Ads
- **Interest-based**: Users discover while browsing
- **Better for brand awareness**
- **Visual content performs well**
- **Detailed demographic targeting**

## When to Use Google Ads

Choose Google Ads when:
- You have high-intent keywords
- You want immediate results
- You're in a competitive search market
- You have local services

## When to Use Facebook Ads

Choose Facebook Ads when:
- You want to build brand awareness
- You have visual products
- You're targeting specific demographics
- You want to retarget website visitors

## Budget Considerations

### Google Ads Costs
- Generally higher cost per click
- Costs vary by industry and competition
- Can provide quick ROI with right keywords

### Facebook Ads Costs
- Lower cost per click typically
- Great for testing audiences
- Better for sustained brand building

## The Best Approach

Most successful businesses use both platforms strategically:
- Use Google Ads for high-intent searches
- Use Facebook Ads for awareness and retargeting
- Coordinate messaging across platforms

Need help choosing the right platform mix? We can analyze your business and create a winning strategy.`,
        featuredImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop",
        author: "David Park",
        category: "Paid Advertising",
        readTime: "10 min read",
        isPublished: true,
        publishedAt: new Date("2025-01-03"),
        createdAt: new Date("2025-01-03"),
        updatedAt: new Date("2025-01-03")
      },
      {
        title: "Building a Personal Brand on LinkedIn",
        slug: "building-personal-brand-linkedin",
        excerpt: "Learn how to build a powerful personal brand on LinkedIn that attracts opportunities and grows your professional network.",
        content: `# Building a Personal Brand on LinkedIn

Your personal brand on LinkedIn can open doors to new opportunities, partnerships, and career growth. Here's how to build it right.

## Why Personal Branding Matters

In today's digital world, your personal brand is your professional reputation. LinkedIn is where professionals go to:
- Find business partners
- Hire talent
- Discover thought leaders
- Build professional networks

## Step 1: Optimize Your Profile

### Professional Headshot
Invest in a quality photo that reflects your industry and personality.

### Compelling Headline
Go beyond your job title. Describe the value you provide.

### Rich Summary
Tell your professional story and highlight your unique value proposition.

## Step 2: Content Strategy

### Share Industry Insights
Position yourself as a thought leader by sharing valuable insights.

### Tell Your Story
Share professional experiences, challenges, and lessons learned.

### Engage Meaningfully
Comment thoughtfully on others' posts to build relationships.

## Step 3: Network Strategically

### Connect with Purpose
Send personalized connection requests with clear reasons.

### Join Industry Groups
Participate in discussions relevant to your field.

### Share Others' Content
Support your network by sharing and commenting on their content.

## Measuring Success

Track these metrics:
- Profile views
- Post engagement
- New connections
- Opportunities generated

## Advanced Strategies

### LinkedIn Articles
Write long-form content to showcase expertise.

### LinkedIn Live
Host live sessions to engage directly with your audience.

### LinkedIn Newsletter
Build a following with regular, valuable content.

Ready to build a powerful LinkedIn presence? We can help you create a strategy that gets results.`,
        featuredImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
        author: "Jessica Wong",
        category: "LinkedIn Marketing",
        readTime: "9 min read",
        isPublished: true,
        publishedAt: new Date("2025-01-01"),
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01")
      }
    ];

    // Add sample posts to storage
    samplePosts.forEach((postData, index) => {
      const id = `blog-${index + 1}`;
      const blogPost: BlogPost = {
        id,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        featuredImage: postData.featuredImage,
        author: postData.author,
        category: postData.category,
        tags: [],
        readTime: postData.readTime,
        isPublished: postData.isPublished,
        publishedAt: postData.publishedAt,
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
      };
      this.blogPosts.set(id, blogPost);
    });
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
      message: insertContact.message || "",
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
  async getAllAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values()).sort((a, b) => 
      a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
    );
  }

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

  async deleteAdminUser(id: string): Promise<boolean> {
    return this.adminUsers.delete(id);
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

  async getSubmissionAnalytics(): Promise<{
    totalSubmissions: number;
    recentSubmissions: any[];
    submissionsByForm: Record<string, number>;
  }> {
    // Calculate total submissions across all types
    const totalSubmissions = 
      this.contactSubmissions.size + 
      this.discoveryCallSubmissions.size + 
      this.talkGrowthSubmissions.size;

    // Get recent submissions (last 10)
    const allSubmissions = [
      ...Array.from(this.contactSubmissions.values()).map(s => ({ ...s, type: 'Contact Form', date: s.createdAt })),
      ...Array.from(this.discoveryCallSubmissions.values()).map(s => ({ ...s, type: 'Discovery Call', date: s.createdAt })),
      ...Array.from(this.talkGrowthSubmissions.values()).map(s => ({ ...s, type: 'Talk Growth', date: s.createdAt }))
    ];

    const recentSubmissions = allSubmissions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    const submissionsByForm = {
      'Contact Forms': this.contactSubmissions.size,
      'Discovery Calls': this.discoveryCallSubmissions.size,
      'Talk Growth Requests': this.talkGrowthSubmissions.size
    };

    return {
      totalSubmissions,
      recentSubmissions,
      submissionsByForm
    };
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
  async getAllAdminUsers(): Promise<AdminUser[]> {
    try {
      return await db.select().from(adminUsers).orderBy(adminUsers.firstName, adminUsers.lastName);
    } catch (error) {
      console.error("Error getting all admin users:", error);
      return [];
    }
  }

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

  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      const result = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting admin user:", error);
      return false;
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
      return result.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
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
        readTime: insertBlogPost.readTime || "",
        featuredImage: insertBlogPost.featuredImage || "",
      };
      const result = await db.insert(blogPosts).values([blogPostData]).returning();
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

  async getSubmissionAnalytics(): Promise<{
    totalSubmissions: number;
    recentSubmissions: any[];
    submissionsByForm: Record<string, number>;
  }> {
    try {
      // Get counts for all submission types
      const contactCount = await db.select().from(contactSubmissions);
      const discoveryCount = await db.select().from(discoveryCallSubmissions);
      const talkGrowthCount = await db.select().from(talkGrowthSubmissions);
      
      const totalSubmissions = contactCount.length + discoveryCount.length + talkGrowthCount.length;
      
      // Get recent submissions (last 10)
      const recentSubmissions = [
        ...contactCount.map((s: any) => ({ ...s, type: 'Contact Form', date: s.createdAt })),
        ...discoveryCount.map((s: any) => ({ ...s, type: 'Discovery Call', date: s.createdAt })),
        ...talkGrowthCount.map((s: any) => ({ ...s, type: 'Talk Growth', date: s.createdAt }))
      ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

      const submissionsByForm = {
        'Contact Forms': contactCount.length,
        'Discovery Calls': discoveryCount.length,
        'Talk Growth Requests': talkGrowthCount.length
      };

      return {
        totalSubmissions,
        recentSubmissions,
        submissionsByForm
      };
    } catch (error) {
      console.error("Error getting submission analytics:", error);
      return {
        totalSubmissions: 0,
        recentSubmissions: [],
        submissionsByForm: {}
      };
    }
  }
}

// Use database storage if db is available, otherwise use memory storage
export const storage: IStorage = (() => {
  const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (databaseUrl && db) {
    console.log("Using database storage");
    return new DatabaseStorage();
  } else {
    console.log("Using in-memory storage");
    return new MemStorage();
  }
})();

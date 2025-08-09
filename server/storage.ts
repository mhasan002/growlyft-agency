import { type User, type InsertUser, type ContactSubmission, type InsertContact, type DiscoveryCallSubmission, type InsertDiscoveryCall, type TalkGrowthSubmission, type InsertTalkGrowth } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  createDiscoveryCallSubmission(discoveryCall: InsertDiscoveryCall): Promise<DiscoveryCallSubmission>;
  createTalkGrowthSubmission(talkGrowth: InsertTalkGrowth): Promise<TalkGrowthSubmission>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private discoveryCallSubmissions: Map<string, DiscoveryCallSubmission>;
  private talkGrowthSubmissions: Map<string, TalkGrowthSubmission>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.discoveryCallSubmissions = new Map();
    this.talkGrowthSubmissions = new Map();
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
}

export const storage = new MemStorage();

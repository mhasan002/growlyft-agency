import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertDiscoveryCallSchema, insertTalkGrowthSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contactSubmission = await storage.createContactSubmission(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your message! We'll get back to you soon.",
        id: contactSubmission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form. Please try again." 
        });
      }
    }
  });

  // Discovery call form submission endpoint
  app.post("/api/discovery-calls", async (req, res) => {
    try {
      const validatedData = insertDiscoveryCallSchema.parse(req.body);
      const discoveryCallSubmission = await storage.createDiscoveryCallSubmission(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your discovery call request! We'll contact you within 24 hours.",
        id: discoveryCallSubmission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Discovery call form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit discovery call request. Please try again." 
        });
      }
    }
  });

  // Talk growth form submission endpoint
  app.post("/api/talk-growth", async (req, res) => {
    try {
      const validatedData = insertTalkGrowthSchema.parse(req.body);
      const talkGrowthSubmission = await storage.createTalkGrowthSubmission(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your growth consultation request! Please check your email for the meeting link.",
        id: talkGrowthSubmission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Talk growth form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit growth consultation request. Please try again." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

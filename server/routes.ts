import type { Express } from "express";
import { createServer, type Server } from "http";
import sgMail from '@sendgrid/mail';
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { insertContactSchema, insertDiscoveryCallSchema, insertTalkGrowthSchema } from "@shared/schema";
import { z } from "zod";
import { setupAdminAuth } from "./admin-auth";
import { registerAdminRoutes } from "./admin-routes";

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure Nodemailer (simple SMTP alternative to SendGrid)
let transporter: nodemailer.Transporter | null = null;

if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  console.log('Nodemailer configured with SMTP settings');
}

// Helper function to send notification emails
async function sendFormNotification(formType: string, formData: any, recipientEmails: string[]) {
  const subject = `New ${formType} submission - Growlyft`;
  const text = `New form submission received:

Form Type: ${formType}
${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Submitted at: ${new Date().toLocaleString()}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #52C251;">New ${formType} Submission</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${Object.entries(formData).map(([key, value]) => 
          `<p><strong>${key}:</strong> ${value}</p>`
        ).join('')}
      </div>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
    </div>
  `;

  // Try SMTP first (Nodemailer), then fallback to SendGrid
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: recipientEmails,
        subject,
        text,
        html,
      });
      console.log(`Email notification sent via SMTP to ${recipientEmails.join(', ')}`);
      return;
    } catch (error) {
      console.error('Failed to send email via SMTP:', error);
      console.log('Trying SendGrid as fallback...');
    }
  }

  // Fallback to SendGrid if SMTP fails or is not configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.sendMultiple({
        to: recipientEmails,
        from: 'hasanmehedimdh@gmail.com', // Using verified sender email
        subject,
        text,
        html,
      });
      console.log(`Email notification sent via SendGrid to ${recipientEmails.join(', ')}`);
    } catch (error) {
      console.error('Failed to send email via SendGrid:', error);
    }
  } else {
    console.warn('No email service configured (SMTP or SendGrid), skipping email notification');
  }
}

// Helper function to get recipient emails for a form
async function getFormRecipients(formName: string): Promise<string[]> {
  try {
    const formConfig = await storage.getFormConfigByName(formName);
    if (formConfig && formConfig.recipientEmails && Array.isArray(formConfig.recipientEmails)) {
      return formConfig.recipientEmails;
    }
    return ['admin@growlyft.com']; // Fallback email
  } catch (error) {
    console.error(`Failed to get recipients for form ${formName}:`, error);
    return ['admin@growlyft.com']; // Fallback email
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup admin authentication
  setupAdminAuth(app);
  
  // Register admin routes
  registerAdminRoutes(app);
  // Contact form submission endpoint (handles all contact-type submissions)
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contactSubmission = await storage.createContactSubmission(validatedData);
      
      // Determine which form config to use based on the type field
      let formConfigName = 'contact_send_message'; // default
      const submissionType = (req.body as any).type; // Get type from request body directly
      if (submissionType) {
        switch (submissionType) {
          case 'lets_talk':
            formConfigName = 'about_lets_talk';
            break;
          case 'custom_plan':
            formConfigName = 'services_custom_plan';
            break;
          case 'package_get_started':
            formConfigName = 'services_get_started';
            break;
          case 'contact':
          default:
            formConfigName = 'contact_send_message';
            break;
        }
      }
      
      // Send email notification
      const recipientEmails = await getFormRecipients(formConfigName);
      await sendFormNotification('Contact Form', validatedData, recipientEmails);
      
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
      
      // Send email notification
      const recipientEmails = await getFormRecipients('discovery_call');
      await sendFormNotification('Discovery Call Request', validatedData, recipientEmails);
      
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
      
      // Send email notification
      const recipientEmails = await getFormRecipients('home_work_with_us');
      await sendFormNotification('Talk Growth Request', validatedData, recipientEmails);
      
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

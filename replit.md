# Growlyft - Social Media Agency Website

## Overview

This is a modern, responsive website for Growlyft, a social media agency. The application is built as a full-stack solution featuring a React frontend with shadcn/ui components and an Express.js backend. The website showcases the agency's services with a clean, futuristic design using Tailwind CSS, includes animated sections, and provides a contact form for lead generation. The architecture follows a monorepo structure with shared schema validation between frontend and backend.

## Recent Changes

**August 11, 2025**: Successfully migrated project from Replit Agent to Replit environment
- ✓ Set up PostgreSQL database with all required tables
- ✓ Configured database migrations using Drizzle ORM
- ✓ Resolved tsx dependency and environment configuration
- ✓ Application now running properly on port 5000 with full functionality

**August 11, 2025 - Evening**: Fixed admin dashboard and form management issues
- ✓ Resolved React hooks rendering errors by restructuring authentication flow
- ✓ Fixed routing mismatch between login redirect and dashboard URL
- ✓ Updated form configurations to match actual website buttons (13 forms total)
- ✓ Increased Express payload limit to 10MB to fix blog creation errors
- ✓ Forms now correctly reflect website structure: Homepage, About, Services, Why Us, Contact pages

**August 12, 2025**: Enhanced blog functionality and completed migration
- ✓ Added image upload option for blog cover photos alongside URL input
- ✓ Fixed form validation errors for excerpt and readTime fields
- ✓ Enhanced share buttons visibility with clear branded styling
- ✓ Added automatic image sizing for blog content (responsive, no cropping)
- ✓ Completed Supabase database connection and migration
- ✓ Project fully operational in Replit environment

**August 12, 2025 - Evening**: Blog layout and video embedding improvements
- ✓ Fixed duplicate cover photo issue by removing redundant image display
- ✓ Repositioned cover photo to appear before title as requested
- ✓ Reduced cover photo height to 300px for better proportions
- ✓ Added video embedding support for YouTube, Facebook, Instagram, TikTok
- ✓ Implemented "More from category" and "Top trending" sections in blog posts
- ✓ Enhanced video auto-sizing with responsive containers

**August 12, 2025 - Migration Completion**: Admin dashboard improvements and Supabase connection
- ✓ Connected project to user's Supabase database successfully
- ✓ Fixed team section to show real admin users instead of mock data
- ✓ Added direct links to each form location for easy identification
- ✓ Implemented getAllAdminUsers API endpoint for proper team member display
- ✓ Enhanced forms management with clickable page location links
- ✓ Completed full migration from Replit Agent to Replit environment

**August 12, 2025 - Admin Dashboard Fixes**: Fixed critical admin dashboard issues
- ✓ Fixed React Hooks rendering error in AdminAnalytics component
- ✓ Resolved team member password update issue (empty passwords now work properly)
- ✓ Fixed form configuration validation error for recipient emails and Google Sheets URL
- ✓ Added proper TypeScript types and validation schemas for admin updates
- ✓ Enhanced error handling in admin routes with proper Zod validation
- ✓ Successfully migrated project to Replit environment with Supabase database integration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom brand colors (primary green #52C251, accent black #000000)
- **State Management**: TanStack Query for server state management and form handling with React Hook Form
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Component-based architecture with reusable UI components following the "new-york" shadcn style

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with JSON communication
- **Data Validation**: Zod schemas shared between frontend and backend for type safety
- **Storage**: In-memory storage implementation with interface for easy database migration
- **Development**: Hot module replacement with Vite integration for seamless development experience

### Database Design
- **Database**: Connected to user's Supabase PostgreSQL database with secure connection
- **ORM**: Drizzle ORM configured for PostgreSQL via postgres-js
- **Schema**: Comprehensive schema including users, admin users, contact submissions, discovery calls, blog posts, form configurations, and password reset tokens
- **Migrations**: Automated migration system with drizzle-kit using `npm run db:push`
- **Type Safety**: Generated TypeScript types from database schema

### Authentication & Security
- **Validation**: Server-side input validation using Zod schemas
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **CORS**: Configured for cross-origin requests during development

### Development Workflow
- **Monorepo Structure**: Client, server, and shared code in separate directories
- **TypeScript**: Strict type checking across the entire codebase
- **Path Aliases**: Simplified imports using @ prefixes for better developer experience
- **Asset Management**: Static assets served from attached_assets directory

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connector optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for React

### UI & Styling
- **@radix-ui/***: Complete set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library

### Form & Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Resolver for Zod schema validation
- **zod**: TypeScript-first schema validation library

### Development Tools
- **vite**: Fast build tool and development server
- **esbuild**: JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for development
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Additional Utilities
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **embla-carousel-react**: Carousel component for interactive content
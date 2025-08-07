# Growlyft - Social Media Agency Website

## Overview

This is a modern, responsive website for Growlyft, a social media agency. The application is built as a full-stack solution featuring a React frontend with shadcn/ui components and an Express.js backend. The website showcases the agency's services with a clean, futuristic design using Tailwind CSS, includes animated sections, and provides a contact form for lead generation. The architecture follows a monorepo structure with shared schema validation between frontend and backend.

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
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Two main entities - users (id, username, password) and contact submissions (id, name, email, message, timestamp)
- **Migrations**: Automated migration system with drizzle-kit
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
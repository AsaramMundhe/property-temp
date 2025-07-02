# PropertyHub - Real Estate Platform

## Overview

PropertyHub is a full-stack real estate listing platform built with modern web technologies. The application follows a clean architecture pattern with a React frontend, Express backend, and PostgreSQL database. It provides a comprehensive property search and listing experience similar to platforms like Housing.com or MagicBricks.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand for authentication state, TanStack Query for server state
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication for admin users
- **Security**: Helmet for security headers, CORS, rate limiting
- **API Design**: RESTful API with consistent error handling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Frontend Components
- **Layout Components**: Header, Footer, SearchBar
- **Property Components**: PropertyCard, PropertyFilters, PropertyDetail
- **Form Components**: ContactForm with React Hook Form validation
- **UI Components**: Comprehensive component library using Radix UI primitives

### Backend Components
- **Route Handlers**: Organized API routes for properties, leads, and admin operations
- **Storage Layer**: Abstracted storage interface for database operations
- **Authentication Middleware**: JWT validation for protected routes
- **Rate Limiting**: Request throttling for security

### Database Schema
- **Properties Table**: Comprehensive property data including location, pricing, amenities
- **Leads Table**: Customer inquiries and contact information
- **Admins Table**: Administrative user accounts with role-based access

## Data Flow

1. **Property Search**: Users search/filter properties → API queries database → Results displayed with pagination
2. **Property Details**: Individual property pages with image galleries, virtual tours, and contact forms
3. **Lead Generation**: Contact forms capture user interest → Stored in database → Available in admin panel
4. **Admin Management**: Authenticated admins can manage properties and view leads

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation with Zod schemas
- **react-helmet**: SEO meta tag management
- **wouter**: Lightweight routing solution
- **lucide-react**: Icon library

### Backend Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon
- **drizzle-orm**: Type-safe ORM and query builder
- **bcrypt**: Password hashing for admin authentication
- **jsonwebtoken**: JWT token generation and validation
- **express-rate-limit**: API rate limiting
- **helmet**: Security middleware

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` - Runs the Express server with Vite integration
- **Build**: `npm run build` - Creates optimized production bundles
- **Production**: `npm start` - Serves the built application
- **Database**: Neon PostgreSQL with environment-based connection string

The architecture supports easy migration to other platforms with minimal configuration changes. The build process creates separate bundles for client and server code, optimizing for performance and deployment flexibility.

## Admin Panel Access

The admin panel can be accessed in two ways:
1. Click the "Admin Panel" button in the header navigation
2. Navigate directly to `/admin/login`

**Admin Credentials:**
- Username: `admin`
- Password: `password`

The admin dashboard includes:
- Property management (create, edit, delete properties)
- Lead management (view and update customer inquiries)
- Dashboard statistics (total properties, leads, views)

## Changelog

```
Changelog:
- July 02, 2025. Initial setup and basic project structure
- July 02, 2025. Completed full-stack real estate platform with:
  * PostgreSQL database with properties, leads, and admin tables
  * Complete REST API with authentication and rate limiting
  * React frontend with property listings, search, and filtering
  * Property detail pages with image galleries and contact forms
  * Admin dashboard for property and lead management
  * Mobile-responsive design with Tailwind CSS
  * SEO optimization with meta tags and structured URLs
  * Sample data with properties from Mumbai, Bangalore, and Gurgaon
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
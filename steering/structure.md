# Project Structure & Organization

## Repository Layout

```
personal-dev-showcase/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── layout/      # Layout components (Header, Footer, etc.)
│   │   │   ├── project/     # Project-related components
│   │   │   ├── user/        # User profile components
│   │   │   └── common/      # Shared/common components
│   │   ├── pages/           # Page components for routing
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand state management
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Global styles and Tailwind config
│   ├── public/              # Static assets
│   └── tests/               # Frontend test files
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models and validation
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/              # Database schema and migrations
│   │   ├── schema.prisma    # Prisma schema definition
│   │   └── migrations/      # Database migration files
│   └── tests/               # Backend test files
└── docs/                    # Project documentation
```

## Component Organization

### Frontend Components

**Layout Components** (`src/components/layout/`)
- `Layout.tsx` - Main application layout wrapper
- `Header.tsx` - Navigation header with user menu
- `Footer.tsx` - Application footer
- `Sidebar.tsx` - Admin sidebar navigation

**Authentication Components** (`src/components/auth/`)
- `LoginForm.tsx` - User login form
- `RegisterForm.tsx` - User registration form
- `ProtectedRoute.tsx` - Route protection wrapper

**Project Components** (`src/components/project/`)
- `ProjectCard.tsx` - Project display card for listings
- `ProjectDetail.tsx` - Detailed project view
- `ProjectForm.tsx` - Project creation/editing form
- `ProjectList.tsx` - Project listing container
- `ProjectSearch.tsx` - Search and filter controls

**Common Components** (`src/components/common/`)
- `Button.tsx` - Reusable button component
- `Input.tsx` - Form input component
- `Modal.tsx` - Modal dialog component
- `LoadingSpinner.tsx` - Loading indicator
- `ImageUpload.tsx` - Image upload functionality

## API Structure

### Backend Routes (`src/routes/`)

```
/api/auth/*          # Authentication endpoints
/api/users/*         # User management endpoints
/api/projects/*      # Project CRUD endpoints
/api/search/*        # Search functionality
/api/upload/*        # File upload endpoints
```

### Controller Organization (`src/controllers/`)
- `authController.ts` - Authentication logic
- `userController.ts` - User management
- `projectController.ts` - Project operations
- `searchController.ts` - Search functionality
- `uploadController.ts` - File upload handling

## Database Schema

### Core Models (Prisma)
- **User** - User accounts and profiles
- **Project** - Project information and metadata
- **TechStack** - Technology categories and tags

### Key Relationships
- User → Projects (one-to-many)
- Project → TechStack (many-to-many)

## File Naming Conventions

- **Components**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Services**: camelCase (`apiService.ts`)
- **Types**: PascalCase (`UserTypes.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Pages**: PascalCase (`ProjectsPage.tsx`)

## Import Organization

```typescript
// External libraries
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// Internal components
import { Button } from '@/components/common'
import { ProjectCard } from '@/components/project'

// Services and utilities
import { projectService } from '@/services'
import { formatDate } from '@/utils'

// Types
import type { Project } from '@/types'
```

## Environment Configuration

- **Development**: `.env.local` for frontend, `.env` for backend
- **Production**: Environment variables set in deployment platforms
- **Database**: Separate databases for development, testing, and production
- **API Keys**: Cloudinary, JWT secrets stored securely
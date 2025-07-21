# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Personal Developer Showcase Platform** - a full-stack web application that enables individual developers to showcase their projects and connect with other developers. The platform allows detailed project management with public/private visibility controls and advanced search capabilities.

## Development Commands

### Frontend (React + TypeScript + Vite)
```bash
cd personal-dev-showcase/frontend
npm install          # Install dependencies
npm run dev          # Start dev server (typically http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
npm test            # Run tests with Jest
npm run test:watch  # Run tests in watch mode
```

### Backend (Node.js + Express + TypeScript)
```bash
cd personal-dev-showcase/backend
npm install                    # Install dependencies
npm run dev                    # Start dev server (typically http://localhost:3000)
npm run build                  # Build TypeScript to JavaScript
npm run lint                   # Run ESLint
npm run typecheck              # Run TypeScript compiler check
npm test                       # Run tests
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Create/apply database migrations
npx prisma migrate reset      # Reset database (development only)
npx prisma studio             # Open Prisma Studio GUI
npm run seed                  # Seed database with sample data
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Router, TanStack Query, Zustand
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Authentication**: JWT with bcrypt
- **File Storage**: Cloudinary for images
- **Deployment**: Netlify (frontend), Railway (backend)

### Project Structure
```
personal-dev-showcase/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (PascalCase)
│   │   ├── pages/         # Route page components
│   │   ├── hooks/         # Custom hooks (use* prefix)
│   │   ├── store/         # Zustand state management
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── migrations/    # Database migrations
└── docs/                  # Project documentation
```

### API Endpoints Pattern
- `/api/auth/*` - Authentication (login, register, refresh)
- `/api/users/*` - User management
- `/api/projects/*` - Project CRUD operations
- `/api/search/*` - Search functionality
- `/api/upload/*` - File uploads

### Database Schema Key Models
- **User**: Authentication and profile information
- **Project**: Developer projects with visibility controls
- **Technology**: Technology tags for projects
- **ProjectLike**: User interactions with projects

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Component files: `ComponentName.tsx`
- Hook files: `useHookName.ts`
- Service files: `serviceName.ts`
- Test files: `*.test.ts` or `*.test.tsx`

### Testing Approach
- Unit tests: Jest + React Testing Library
- API tests: Supertest
- Mock external services with MSW
- Target 80%+ code coverage

### Key Implementation Notes
1. Always implement responsive design (mobile-first)
2. Use environment variables for all configuration
3. Implement comprehensive error handling
4. Add loading states for all async operations
5. Validate all user inputs on both frontend and backend
6. Use Prisma transactions for multi-table operations
7. Implement rate limiting on all API endpoints

### Security Checklist
- JWT tokens in httpOnly cookies
- bcrypt for password hashing (10+ salt rounds)
- Input sanitization on all endpoints
- CORS configuration for production
- Rate limiting with express-rate-limit
- SQL injection protection via Prisma

### Common Development Tasks
```bash
# Add new database model
1. Edit prisma/schema.prisma
2. Run: npx prisma migrate dev --name describe_change
3. Run: npx prisma generate

# Add new API endpoint
1. Create controller in backend/src/controllers/
2. Add route in backend/src/routes/
3. Add service logic in backend/src/services/
4. Add types in backend/src/types/
5. Test with Thunder Client or Postman

# Add new frontend feature
1. Create component in frontend/src/components/
2. Add page in frontend/src/pages/ if needed
3. Update routing in App.tsx
4. Add API service in frontend/src/services/
5. Add types in frontend/src/types/
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/devshowcase
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

## Important: Project Status
This project is now set up with the basic infrastructure. The next steps are:
1. Set up Prisma schema and database models
2. Implement authentication flow
3. Build core features incrementally following the specs in `/specs/requirements.md`
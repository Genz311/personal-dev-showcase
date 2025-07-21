# Technology Stack & Development Guidelines

## Architecture

**Full-stack TypeScript application** with separate frontend and backend deployments:

```
Frontend (React/Vite) → Backend (Node.js/Express) → Database (PostgreSQL)
     ↓                        ↓
   Netlify                 Railway
```

## Frontend Stack

- **React 18** with **TypeScript** - Component-based UI development
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first styling framework
- **React Router v6** - Client-side routing
- **React Hook Form** - Form management and validation
- **TanStack Query** - Server state management and caching
- **Zustand** - Lightweight client state management
- **React Hot Toast** - Notification system

## Backend Stack

- **Node.js** with **Express.js** - Server runtime and web framework
- **TypeScript** - Type-safe server development
- **Prisma** - Type-safe ORM and database toolkit
- **JWT** - Authentication token management
- **bcrypt** - Password hashing
- **multer** - File upload handling
- **express-rate-limit** - API rate limiting

## Database & Storage

- **PostgreSQL** - Primary database
- **Cloudinary** - Image storage and optimization

## Development Tools

- **ESLint** + **Prettier** - Code linting and formatting
- **Jest** + **React Testing Library** - Unit testing
- **Playwright** - End-to-end testing
- **MSW (Mock Service Worker)** - API mocking for tests

## Common Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Backend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database
npm run seed

# Run tests
npm test
```

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Code Quality Standards

- **TypeScript strict mode** enabled
- **80%+ test coverage** target
- **Component-driven development** with reusable UI components
- **API-first design** with comprehensive endpoint testing
- **Responsive design** mandatory for all UI components
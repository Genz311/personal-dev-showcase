# Database Setup and Usage

## Overview

This project uses PostgreSQL as the primary database with Prisma as the ORM. The database schema includes models for users, projects, technologies, and their relationships.

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Start the database:**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations:**
   ```bash
   cd backend
   npm run db:migrate
   ```

3. **Seed the database:**
   ```bash
   npm run db:seed
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL:**
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. **Create database:**
   ```bash
   createdb devshowcase
   ```

3. **Update environment variables:**
   ```bash
   # In backend/.env
   DATABASE_URL=postgresql://localhost:5432/devshowcase
   ```

4. **Run migrations and seed:**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

## Database Schema

### Core Models

#### User
- **id**: Unique identifier (cuid)
- **email**: Unique email address
- **username**: Unique username
- **password**: Hashed password
- **displayName**: Public display name
- **bio**: Optional biography
- **avatarUrl**: Optional profile image URL
- **githubUrl**: Optional GitHub profile URL
- **twitterUrl**: Optional Twitter profile URL
- **websiteUrl**: Optional personal website URL
- **isPublic**: Privacy setting (default: true)
- **createdAt/updatedAt**: Timestamps

#### Project
- **id**: Unique identifier (cuid)
- **title**: Project title
- **description**: Short description
- **longDescription**: Optional detailed description
- **imageUrl**: Optional project image URL
- **githubUrl**: Optional GitHub repository URL
- **liveUrl**: Optional live demo URL
- **isPublic**: Privacy setting (default: true)
- **featured**: Featured project flag (default: false)
- **userId**: Foreign key to User
- **createdAt/updatedAt**: Timestamps

#### Technology
- **id**: Unique identifier (cuid)
- **name**: Technology name (unique)
- **category**: Category (frontend/backend/database/tool/other)
- **color**: Optional hex color for UI

#### ProjectTechnology (Junction Table)
- **id**: Unique identifier (cuid)
- **projectId**: Foreign key to Project
- **technologyId**: Foreign key to Technology
- **Unique constraint**: (projectId, technologyId)

### Relationships

- **User → Projects**: One-to-Many (cascade delete)
- **Project ↔ Technologies**: Many-to-Many via ProjectTechnology
- **Technology ↔ Projects**: Many-to-Many via ProjectTechnology

## Available Commands

```bash
# Database operations
npm run db:migrate        # Run database migrations
npm run db:generate       # Generate Prisma client
npm run db:studio         # Open Prisma Studio (GUI)
npm run db:reset          # Reset database (dev only)
npm run db:seed           # Seed database with sample data

# Testing and development
npm run db:test-connection  # Test database connection
npm test                    # Run all tests (requires DB)
```

## Sample Data

The seed script creates:
- **38 technologies** across 5 categories
- **1 demo user** (`demo@example.com` / `password123`)
- **2 sample projects** with technology associations

### Demo User Login
- **Email**: demo@example.com
- **Password**: password123

## Development Workflow

1. **Schema changes:**
   ```bash
   # Edit prisma/schema.prisma
   npm run db:migrate
   npm run db:generate
   ```

2. **Testing:**
   ```bash
   # Ensure database is running
   npm run db:test-connection
   
   # Run specific model tests
   npm test -- user.test.ts
   npm test -- project.test.ts
   npm test -- technology.test.ts
   ```

3. **Data exploration:**
   ```bash
   npm run db:studio
   # Opens http://localhost:5555
   ```

## Production Considerations

### Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Migrations
```bash
# Production deployment
npx prisma migrate deploy
```

### Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Connection Issues
```bash
# Test connection
npm run db:test-connection

# Check Docker container
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Migration Issues
```bash
# Reset and re-migrate (dev only)
npm run db:reset

# Check migration status
npx prisma migrate status
```

### Common Errors

1. **"Can't reach database server"**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env

2. **"Table doesn't exist"**
   - Run migrations: `npm run db:migrate`

3. **"Unique constraint violation"**
   - Check for duplicate data in seed script
   - Clear database: `npm run db:reset`

## Best Practices

1. **Always use transactions for multi-table operations**
2. **Use Prisma's type-safe queries**
3. **Include proper error handling**
4. **Test database operations thoroughly**
5. **Use migrations for schema changes**
6. **Backup production data regularly**
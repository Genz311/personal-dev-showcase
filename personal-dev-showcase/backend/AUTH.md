# Authentication API Documentation

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user authentication. It includes user registration, login, token refresh, and logout functionality.

## Authentication Flow

1. **Registration/Login**: User provides credentials and receives access and refresh tokens
2. **API Requests**: Include access token in Authorization header
3. **Token Refresh**: Use refresh token to get new access token when expired
4. **Logout**: Clear tokens client-side (optional server-side tracking)

## API Endpoints

### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "displayName": "Display Name" // optional
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name",
    "isPublic": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt.access.token",
  "refreshToken": "jwt.refresh.token"
}
```

**Error Responses:**
- `400` - Validation errors
- `409` - Email or username already exists

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name",
    "bio": "User bio",
    "avatarUrl": "https://...",
    "githubUrl": "https://github.com/username",
    "twitterUrl": "https://twitter.com/username",
    "websiteUrl": "https://example.com",
    "isPublic": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt.access.token",
  "refreshToken": "jwt.refresh.token"
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Invalid credentials

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt.refresh.token"
}
```

**Success Response (200):**
```json
{
  "accessToken": "new.jwt.access.token",
  "refreshToken": "new.jwt.refresh.token"
}
```

**Error Responses:**
- `400` - Missing refresh token
- `401` - Invalid or expired refresh token

### Logout

```http
POST /api/auth/logout
Authorization: Bearer jwt.access.token
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `401` - Missing access token
- `403` - Invalid or expired token

## Using Authentication in API Requests

Include the access token in the Authorization header:

```http
GET /api/protected-endpoint
Authorization: Bearer jwt.access.token
```

## Token Details

### Access Token
- **Expiration**: 15 minutes
- **Usage**: API authentication
- **Storage**: Memory or secure storage (not localStorage)

### Refresh Token
- **Expiration**: 7 days
- **Usage**: Get new access token
- **Storage**: httpOnly cookie or secure storage

## Security Best Practices

1. **Password Requirements**:
   - Minimum 6 characters
   - Hashed with bcrypt (10 salt rounds)

2. **Username Requirements**:
   - 3-30 characters
   - Alphanumeric and underscores only
   - Case-insensitive

3. **Email Requirements**:
   - Valid email format
   - Case-insensitive

4. **Token Storage**:
   - Never store tokens in localStorage
   - Use httpOnly cookies or secure memory storage
   - Clear tokens on logout

5. **HTTPS Only**:
   - Always use HTTPS in production
   - Set secure cookie flags

## Testing Authentication

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"testuser","password":"password123"}'

# Use protected endpoint
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Running Tests

```bash
# Run all auth tests
npm test -- auth

# Run specific test files
npm test -- jwt.test.ts
npm test -- password.test.ts
npm test -- validation.test.ts
npm test -- authController.test.ts
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "General error message"
}
```

Or for validation errors:

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```
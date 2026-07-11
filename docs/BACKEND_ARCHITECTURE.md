# Opinio Backend - Architecture Documentation

## Overview

Opinio Backend is a RESTful API built with NestJS framework, using PostgreSQL for data persistence and Redis for caching/session management. The architecture follows Domain-Driven Design (DDD) principles with a modular structure.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS | Node.js framework |
| TypeScript | Type-safe JavaScript |
| Prisma | ORM for database access |
| PostgreSQL | Primary database |
| Redis | Caching & OTP storage |
| JWT | Authentication tokens |
| Docker | Containerization |

## Project Structure

```
apps/backend/
├── prisma/
│   └── schema.prisma        # Database schema
│
├── src/
│   ├── infrastructure/      # Cross-cutting concerns
│   │   ├── database/
│   │   │   └── prisma/      # Prisma service & module
│   │   └── redis/           # Redis service & module
│   │
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   │
│   │   ├── users/           # User management
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── repositories/
│   │   │
│   │   ├── posts/           # Posts & Polls
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── dto/
│   │   │
│   │   ├── comments/        # Comments
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── dto/
│   │   │
│   │   ├── likes/           # Likes system
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── repositories/
│   │   │
│   │   └── votes/           # Poll voting
│   │       ├── controllers/
│   │       ├── services/
│   │       └── repositories/
│   │
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry
│
├── docker/
│   └── Dockerfile.dev
│
└── docker-compose.yml
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Post     │       │    Poll     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │◀──┐   │ id          │◀──────│ postId      │
│ phone       │   │   │ type        │       │ totalVotes  │
│ name        │   │   │ content     │       │ endsAt      │
│ avatarUrl   │   └───│ authorId    │       └──────┬──────┘
│ bio         │       │ likeCount   │              │
│ createdAt   │       │ commentCount│              │
└──────┬──────┘       └──────┬──────┘              │
       │                     │                     │
       │              ┌──────┴──────┐              │
       │              │             │              │
       ▼              ▼             ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Comment   │ │    Like     │ │ PollOption  │ │    Vote     │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ id          │ │ id          │ │ id          │ │ id          │
│ content     │ │ userId      │ │ pollId      │ │ userId      │
│ postId      │ │ postId      │ │ text        │ │ pollOptionId│
│ authorId    │ │ commentId   │ │ voteCount   │ │ createdAt   │
│ parentId    │ │ createdAt   │ │ order       │ └─────────────┘
│ likeCount   │ └─────────────┘ └─────────────┘
└─────────────┘
```

### Models

#### User
- Primary entity for authenticated users
- Phone-based authentication
- Relations: posts, comments, likes, votes

#### Post
- Two types: QUESTION and POLL
- Denormalized counts for performance
- Optional Poll relation

#### Poll
- One-to-one with Post
- Contains multiple PollOptions
- Optional end date

#### PollOption
- Belongs to Poll
- Tracks vote count
- Ordered display

#### Vote
- Links User to PollOption
- Unique constraint per user per poll

#### Comment
- Belongs to Post and User
- Self-referential for replies (parentId)
- Like count tracking

#### Like
- Polymorphic: can like Post or Comment
- Unique constraints prevent duplicates

## Module Architecture

### Module Structure Pattern

```
module/
├── module.module.ts         # NestJS module definition
├── controllers/
│   └── module.controller.ts # HTTP endpoints
├── services/
│   └── module.service.ts    # Business logic
├── repositories/
│   └── module.repository.ts # Data access
└── dto/
    ├── create-module.dto.ts # Input validation
    └── update-module.dto.ts
```

### Dependency Flow

```
┌────────────────┐
│   Controller   │  ← HTTP Request
├────────────────┤
│    Service     │  ← Business Logic
├────────────────┤
│   Repository   │  ← Data Access
├────────────────┤
│     Prisma     │  ← ORM
├────────────────┤
│   PostgreSQL   │  ← Database
└────────────────┘
```

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/send-otp` | Send OTP to phone |
| POST | `/auth/verify-otp` | Verify OTP & get token |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate token |

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| PATCH | `/users/me` | Update profile |

### Posts (`/posts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get feed (paginated) |
| GET | `/posts/:id` | Get single post |
| GET | `/posts/user/:userId` | Get user's posts |
| POST | `/posts` | Create post |
| PATCH | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

### Comments (`/comments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments/post/:postId` | Get post comments |
| POST | `/comments` | Create comment |
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |

### Likes (`/likes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/likes/post/:postId` | Like a post |
| DELETE | `/likes/post/:postId` | Unlike a post |
| GET | `/likes/post/:postId/check` | Check if liked |

### Votes (`/votes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/votes` | Vote on poll option |
| PUT | `/votes` | Change vote |
| GET | `/votes/poll/:pollId/check` | Check user's vote |

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ Send OTP │────▶│  Redis   │
│          │     │ Endpoint │     │ (Store)  │
└──────────┘     └──────────┘     └──────────┘
                       │
                       ▼
                 ┌──────────┐
                 │   SMS    │
                 │ Service  │
                 └──────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│Verify OTP│────▶│  Redis   │
│ (+ OTP)  │     │ Endpoint │     │ (Check)  │
└──────────┘     └──────────┘     └──────────┘
                       │
                       ▼
                 ┌──────────┐
                 │   JWT    │
                 │  Token   │
                 └──────────┘
```

### JWT Strategy

- Access Token: Short-lived (15 min)
- Refresh Token: Long-lived (7 days)
- Stored in Redis for invalidation

## Guards & Middleware

### JwtAuthGuard
- Validates JWT token
- Extracts user from token
- Attaches user to request

```typescript
@UseGuards(JwtAuthGuard)
@Get('me')
getProfile(@Request() req) {
  return req.user;
}
```

## Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### HTTP Exceptions

| Code | Exception | Use Case |
|------|-----------|----------|
| 400 | BadRequestException | Invalid input |
| 401 | UnauthorizedException | Auth required |
| 403 | ForbiddenException | Access denied |
| 404 | NotFoundException | Resource not found |
| 409 | ConflictException | Duplicate entry |

## Caching Strategy

### Redis Usage

1. **OTP Storage**: 5-minute TTL
2. **Session Management**: Token blacklist
3. **Rate Limiting**: Request counts

```typescript
// OTP Storage
await redis.set(`otp:${phone}`, otp, 'EX', 300);

// Token Blacklist
await redis.set(`blacklist:${token}`, '1', 'EX', tokenTTL);
```

## Performance Optimizations

### Database

1. **Indexes**: On foreign keys and frequently queried fields
2. **Denormalization**: Like/comment counts on posts
3. **Pagination**: Cursor-based for large datasets

### Application

1. **Connection Pooling**: Prisma connection pool
2. **Lazy Loading**: Load relations only when needed
3. **Caching**: Redis for frequently accessed data

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/opinio

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
```

## Docker Setup

### Development

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: opinio
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./apps/backend
      dockerfile: docker/Dockerfile.dev
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
```

## Security Measures

1. **Input Validation**: DTOs with class-validator
2. **Rate Limiting**: Redis-based throttling
3. **CORS**: Configured for mobile app
4. **Helmet**: Security headers
5. **SQL Injection**: Prisma parameterized queries

## Future Improvements

- [ ] GraphQL API option
- [ ] WebSocket for real-time updates
- [ ] File upload service (S3)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics & metrics
- [ ] API versioning

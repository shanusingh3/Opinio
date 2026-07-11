# Opinio - Project Context

## Project Overview

**Opinio** is a consumer social platform where users can ask questions, create polls, vote, comment, and interact with a community.

The objective is **not just to build an MVP**, but to build a production-quality codebase that demonstrates strong software architecture, scalability, and engineering practices suitable for a Senior/Staff/Founding Engineer role.

The project is developed as a monorepo containing both the backend and the React Native mobile application.

---

# Tech Stack

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* Redis
* JWT Authentication
* Docker
* TypeScript

## Mobile

* React Native CLI
* TypeScript
* Redux Toolkit
* React Navigation
* Axios
* React Hook Form
* MMKV Storage

---

# Repository Structure

```
opinio/

apps/
    backend/
    mobile/

docker/
docs/

docker-compose.yml
README.md
```

---

# Engineering Principles

The project prioritizes:

* Clean Architecture
* Separation of Concerns
* SOLID Principles where appropriate
* Feature-based organization
* Maintainability
* Scalability
* Testability
* Production-ready coding patterns

Every architectural decision should be explainable during a senior engineering interview.

Avoid unnecessary abstractions, but avoid writing quick prototype code.

---

# Backend Architecture

```
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
PrismaService
      │
      ▼
PostgreSQL
```

## Responsibilities

### Controllers

* Handle HTTP requests
* Validate DTOs
* Call services
* Never contain business logic

### Services

* Own business logic
* Coordinate repositories
* Never access Prisma directly

### Repositories

* Database access only
* No business logic
* Wrap Prisma operations

---

# Infrastructure

Infrastructure services live under:

```
src/infrastructure/
```

Current infrastructure:

* Prisma
* Redis

Infrastructure services own their lifecycle using:

* OnModuleInit
* OnModuleDestroy

---

# Authentication Flow

```
Send OTP

↓

Generate OTP

↓

Redis

↓

Verify OTP

↓

Validate OTP

↓

UsersService.findOrCreate()

↓

Generate JWT

↓

Return Access Token
```

JWT Payload

```
{
    sub,
    phone
}
```

Protected endpoints use:

* JwtStrategy
* JwtAuthGuard

---

# Current Backend Status

Completed

* Docker
* PostgreSQL
* Redis
* Prisma
* Users Module
* Authentication
* OTP Login
* JWT Authentication
* JwtStrategy
* JwtAuthGuard
* Protected Routes

---

# Development Workflow

Every feature should be built vertically.

```
Feature

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

API Testing

↓

React Native Integration

↓

UI
```

Avoid building large amounts of backend before integrating with the frontend.

---

# Mobile Architecture

Feature-first structure:

```
src/

features/
    auth/
    posts/
    polls/

navigation/

components/

services/
    api/
    storage/

store/

hooks/

theme/

utils/

types/
```

Business logic belongs inside features.

Reusable UI belongs in components.

---

# Upcoming Features

Authentication

* Complete

Core Product

* Posts
* Questions
* Polls
* Poll Options
* Voting
* Likes
* Comments
* Feed

Future

* Notifications
* Search
* Trending
* User Profiles
* Push Notifications
* Analytics
* Admin Dashboard

---

# Database Design Philosophy

Use a root **Post** entity.

Everything else extends or relates to Post.

```
Post

├── Question
├── Poll
│     └── PollOption
│            └── Vote
├── Comment
└── Like
```

Store denormalized counters:

* likeCount
* commentCount
* voteCount

Do not perform COUNT() queries for every feed request.

---

# API Principles

* REST-first
* Versioned APIs (`/api/v1`)
* DTO validation
* Consistent response structure
* JWT-protected endpoints where required

---

# Coding Standards

* No business logic inside controllers.
* No Prisma access outside repositories.
* Keep services focused on business rules.
* Use dependency injection everywhere.
* Prefer composition over inheritance.
* Keep functions small and readable.
* Use meaningful names.
* Avoid premature optimization.
* Avoid over-engineering.

---

# Goal

Build a production-quality consumer social application that demonstrates:

* Strong backend architecture
* Clean React Native architecture
* Scalable project organization
* Good engineering practices
* Senior/Founding Engineer level decision making

The emphasis is on code quality, maintainability, and explaining architectural trade-offs—not simply making the application work.

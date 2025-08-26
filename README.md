# API Courses Node.js

A robust REST API for course management with user authentication and role-based authorization, built with modern Node.js technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Flow](#api-flow)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Database Operations](#database-operations)
- [Docker Support](#docker-support)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 Overview

This API provides a comprehensive solution for managing courses and users with the following features:

- **User Authentication**: Secure JWT-based authentication with Argon2 password hashing
- **Role-based Authorization**: Support for `student` and `manager` roles with different permissions
- **Course Management**: CRUD operations for courses with search and pagination
- **User Enrollment**: Track user enrollments in courses
- **API Documentation**: Auto-generated OpenAPI documentation with Scalar UI
- **Comprehensive Testing**: Full test coverage with Vitest
- **Type Safety**: Full TypeScript support with Zod validation

## 🛠 Technology Stack

### Core Technologies
- **Runtime**: Node.js 22
- **Framework**: Fastify (high-performance web framework)
- **Language**: TypeScript
- **Database**: PostgreSQL 17
- **ORM**: Drizzle ORM (type-safe database toolkit)

### Authentication & Security
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Argon2 (secure password hashing)
- **Validation**: Zod (TypeScript-first schema validation)

### Development & Testing
- **Testing Framework**: Vitest
- **Test Coverage**: @vitest/coverage-v8
- **HTTP Testing**: Supertest
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

### API Documentation
- **OpenAPI**: @fastify/swagger
- **Documentation UI**: Scalar API Reference
- **Type Provider**: fastify-type-provider-zod

### Development Tools
- **Logging**: Pino with pino-pretty
- **Database Migrations**: Drizzle Kit
- **Test Data**: Faker.js (Brazilian locale)
- **Environment Variables**: dotenv-cli

## 🗄 Database Schema

The application uses a PostgreSQL database with the following schema:

### Tables

#### Users
- `id` (UUID, Primary Key) - Auto-generated user identifier
- `email` (TEXT, Unique) - User email address
- `name` (TEXT) - User full name
- `password` (TEXT) - Argon2 hashed password
- `role` (ENUM) - User role: 'student' or 'manager'

#### Courses
- `id` (UUID, Primary Key) - Auto-generated course identifier
- `title` (TEXT, Unique) - Course title
- `description` (TEXT, Optional) - Course description

#### Enrollments
- `id` (UUID, Primary Key) - Auto-generated enrollment identifier
- `userId` (UUID, Foreign Key) - Reference to users.id (CASCADE DELETE)
- `courseId` (UUID, Foreign Key) - Reference to courses.id (CASCADE DELETE)
- `createdAt` (TIMESTAMP) - Enrollment creation time

### User Roles
- **student**: Can view courses they have access to
- **manager**: Can create courses and view all courses with enrollment statistics

## 🔄 API Flow

The API implements a comprehensive authentication and authorization flow:

1. **Authentication**: JWT token verification for protected routes
2. **Authorization**: Role-based access control for specific operations
3. **Data Processing**: Type-safe database operations with Drizzle ORM
4. **Response**: Standardized JSON responses with proper HTTP status codes

## ✅ Prerequisites

Before running this application, ensure you have:

- **Node.js** 22 or higher
- **pnpm** package manager
- **Docker** and **Docker Compose** (for database)
- **PostgreSQL** 17 (if not using Docker)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/guycanella/api-courses-nodejs.git
   cd api-courses-nodejs
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## ⚙️ Environment Setup

Create the necessary environment files:

1. **Development Environment** (`.env`)
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

2. **Test Environment** (`.env.test`)
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/api_courses_test
   JWT_SECRET=test-jwt-secret-key
   NODE_ENV=test
   ```

> **Note**: Replace `your-super-secret-jwt-key-here` with a secure random string for production use.

## 🏃‍♂️ Running the Application

### 1. Start the Database

Using Docker (recommended):
```bash
docker-compose up -d
```

### 2. Setup Database

Generate and run migrations:
```bash
# Generate migration files
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Seed the database with sample data (optional)
pnpm run db:seed
```

### 3. Start the Server

For development with auto-reload:
```bash
pnpm run dev
```

The server will start on `http://localhost:3333`

### 4. Access API Documentation

When running in development mode, access the interactive API documentation at:
- **Scalar UI**: `http://localhost:3333/docs`

## 🧪 Testing

The project includes comprehensive tests with coverage reporting.

### Run Tests
```bash
# Run all tests with coverage
pnpm run test

# Run tests in watch mode (for development)
pnpm run test --watch
```

### Test Structure
- **Unit Tests**: Individual route testing
- **Integration Tests**: End-to-end API testing
- **Factory Functions**: Test data generation with Faker.js
- **Coverage Reports**: HTML, JSON, and text formats

### Test Environment
Tests automatically:
- Set up a clean test database
- Run migrations before tests
- Use factory functions for test data
- Clean up after test execution

## 📚 API Documentation

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: your-jwt-token-here
```

### Response Format

All API responses follow a consistent JSON format:

**Success Response:**
```json
{
  "data": "response data here",
  "status": "success"
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "status": "error"
}
```

## 🛣 API Endpoints

### Authentication

#### POST `/sessions`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string"
}
```

**Errors:**
- `400` - Invalid credentials
- `500` - Internal server error

---

### Courses

#### GET `/courses`
Get all courses with enrollment statistics (Manager only).

**Authentication:** Required (Manager role)

**Query Parameters:**
- `search` (optional) - Search courses by title (minimum 2 characters)
- `orderBy` (optional) - Order by field (default: "title")
- `page` (optional) - Page number for pagination (default: 1)

**Response (200):**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Course Title",
      "enrollments": 5
    }
  ],
  "total": 10
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not a manager)

---

#### GET `/courses/:id`
Get course details by ID.

**Authentication:** Required

**Path Parameters:**
- `id` (UUID) - Course identifier

**Response (200):**
```json
{
  "course": {
    "id": "uuid",
    "title": "Course Title",
    "description": "Course description"
  }
}
```

**Errors:**
- `401` - Unauthorized
- `404` - Course not found
- `500` - Internal server error

---

#### POST `/courses`
Create a new course (Manager only).

**Authentication:** Required (Manager role)

**Request Body:**
```json
{
  "title": "New Course Title",
  "description": "Optional description"
}
```

**Response (201):**
```json
{
  "courseId": "uuid"
}
```

**Errors:**
- `400` - Invalid request parameters
- `401` - Unauthorized
- `403` - Forbidden (not a manager)
- `500` - Internal server error

## 🗃 Database Operations

### Available Scripts

```bash
# Generate migration files from schema changes
pnpm run db:generate

# Apply pending migrations
pnpm run db:migrate

# Seed database with sample data
pnpm run db:seed

# Open Drizzle Studio (database GUI)
pnpm run db:studio
```

### Migration Workflow

1. Modify the schema in `src/database/schema.ts`
2. Generate migrations: `pnpm run db:generate`
3. Review generated SQL in `drizzle/` directory
4. Apply migrations: `pnpm run db:migrate`

## 🐳 Docker Support

### Development with Docker

The project includes Docker configuration for easy development setup:

**docker-compose.yml** provides:
- PostgreSQL 17 database
- Persistent data volume
- Port mapping (5432:5432)
- Default credentials (postgres/postgres)

### Production Docker Build

Build the application image:
```bash
docker build -t api-courses-nodejs .
```

The Dockerfile:
- Uses Node.js 22 Alpine image
- Installs pnpm
- Optimized for production
- Exposes port 3333

## 📁 Project Structure

```
api-courses-nodejs/
├── src/
│   ├── @types/           # TypeScript type definitions
│   │   └── fastify.d.ts  # Fastify module augmentation
│   ├── database/         # Database configuration and schema
│   │   ├── client.ts     # Drizzle database client
│   │   ├── schema.ts     # Database schema definitions
│   │   └── seed.ts       # Database seeding script
│   ├── routes/           # API route handlers
│   │   ├── hooks/        # Authentication and authorization hooks
│   │   │   ├── check-request-jwt.ts
│   │   │   └── check-user-role.ts
│   │   ├── create-course.ts
│   │   ├── get-course-by-id.ts
│   │   ├── get-courses.ts
│   │   └── login.ts
│   ├── tests/            # Test utilities and factories
│   │   └── factories/    # Test data factories
│   │       ├── make-course.ts
│   │       └── make-user.ts
│   ├── utils/            # Utility functions
│   │   └── get-authenticated-user-from-request.ts
│   ├── app.ts            # Fastify application setup
│   └── server.ts         # Server entry point
├── drizzle/              # Database migrations (generated)
├── coverage/             # Test coverage reports (generated)
├── docker-compose.yml    # Docker services configuration
├── Dockerfile            # Application container image
├── drizzle.config.ts     # Drizzle ORM configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Test configuration
└── README.md             # Project documentation
```

### Key Files Explained

- **`src/app.ts`**: Main Fastify application setup with middleware, validation, and route registration
- **`src/server.ts`**: Server entry point that starts the HTTP server
- **`src/database/schema.ts`**: Database schema definitions using Drizzle ORM
- **`src/routes/`**: API endpoint implementations with authentication and validation
- **`src/routes/hooks/`**: Reusable authentication and authorization middleware
- **`drizzle.config.ts`**: Configuration for database migrations and Drizzle Kit

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pnpm run test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add appropriate tests for new features
- Update documentation for API changes
- Ensure type safety with TypeScript
- Use Zod schemas for validation
- Follow RESTful API principles

---

## 📄 License

This project is licensed under the ISC License.

## 🙋‍♂️ Support

For questions or support, please open an issue on the GitHub repository.

---

**Built with ❤️ using modern Node.js technologies**
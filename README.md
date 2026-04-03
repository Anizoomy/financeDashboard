# Finance Dashboard API

A RESTful backend for a rolebased finance dashboard system built with Node.js, Express, TypeScript, Prisma and SQLite.


## Tech Stack

- Runtime: Node.js + TypeScript
- Framework: Express
- ORM: Prisma
- Database: SQLite
- Auth: JWT + bcrypt
- Docs: Swagger UI


## Project Structure

src/
  routes/ Route definitions with Swagger comments
  controllers/ Request and response handling
  services/ Business logic and database queries
  middleware/ JWT authentication and role authorization
  utils/ Prisma client and seed script
  config/ Swagger configuration
prisma/
  schema.prisma Database schema



## Setup and Installation

### 1. Clone the repository
git clone <your-repo-url>
cd finance-backend

### 2. Install dependencies

npm install

### 3. Configure environment
Create a .env file in the root folder:

DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3300


### 4. Set up the database

npx prisma migrate dev


### 5. Seed the database

npm run seed


### 6. Start the server

npm run dev


Server runs at http://localhost:3300

Swagger docs at http://localhost:3300/api-docs


## Test Users

The seed script creates one admin user:

- Email: admin@example.com
- Password: Admin@123
- Role: ADMIN

Additional users can be created via POST /api/auth/register


## Role Model

There are three roles in the system:

VIEWER can only view financial records

ANALYST can view financial records and access all dashboard analytics

ADMIN has full access including creating, updating and deleting records, managing users and accessing all dashboard endpoints


## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current logged in user

### Admin
- POST /api/admin/login - Admin login
- GET /api/admin/stats - Get overall system statistics
- GET /api/admin/users/roles - Get user count broken down by role

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PATCH /api/users/:id - Update a user
- DELETE /api/users/:id - Delete a user

### Records
- GET /api/records - Get all records with optional filters
- GET /api/records/:id - Get a single record by ID
- POST /api/records - Create a new record
- PATCH /api/records/:id - Update a record
- DELETE /api/records/:id - Soft delete a record

### Dashboard
- GET /api/dashboard/summary - Total income, expenses and net balance
- GET /api/dashboard/categories - Totals grouped by category
- GET /api/dashboard/trends/monthly - Monthly income and expense trends
- GET /api/dashboard/trends/weekly - This week vs last week comparison
- GET /api/dashboard/recent - Most recent transactions


## Design Decisions

### Soft Deletes
Financial records are never permanently deleted. A deletedAt timestamp is set instead. This preserves data integrity and audit history

### Role Based Access Control
Roles are enforced at the route level using middleware. Each route explicitly defines which roles can access it, making permissions easy to trace and modify

### Separation of Concerns
The codebase follows a routes, controllers and services pattern. Routes handle HTTP definitions, controllers handle request and response, and services contain all business logic and database queries

### SQLite
SQLite was chosen for zero-configuration local development. Switching to PostgreSQL only requires changing the provider in schema.prisma and updating DATABASE_URL

### Validation
Input validation is handled at the service level. Invalid or missing fields return descriptive error messages with appropriate HTTP status codes
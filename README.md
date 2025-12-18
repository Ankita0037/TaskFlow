# 📋 Task Manager Application

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4+-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack collaborative Task Management application built with React, Express.js, MongoDB, and real-time collaboration features using Socket.io.

## 🌐 Live Demo

- **Frontend**: [https://task-manager-frontend.vercel.app](https://task-manager-frontend.vercel.app)
- **Backend API**: [https://task-manager-api.onrender.com](https://task-manager-api.onrender.com)

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [API Contract Documentation](#-api-contract-documentation)
- [Real-Time Socket.io Integration](#-real-time-socketio-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Docker Support](#-docker-support)
- [Database Schema](#-database-schema)
- [Trade-offs & Assumptions](#-trade-offs--assumptions)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with secure password hashing (bcrypt)
- **Task Management**: Full CRUD operations for tasks with priority levels and status tracking
- **Real-time Collaboration**: Live updates using Socket.io when tasks are created, updated, or deleted
- **Task Assignment**: Assign tasks to team members and track ownership
- **Filtering & Sorting**: Advanced filtering by status, priority, assignee, and date ranges
- **Dashboard**: Overview of task statistics and quick access to assigned/created tasks
- **Notifications**: Real-time notifications for task assignments and updates

### Bonus Features
- **Audit Logging**: Track all changes made to tasks with user attribution
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Form Validation**: Client and server-side validation using Zod schemas
- **Optimistic Updates**: Smooth UX with SWR's optimistic update patterns

## 🏗️ Architecture & Design Decisions

### Why MongoDB?
We chose **MongoDB** over PostgreSQL for this project because:
1. **Flexible Schema**: Tasks can have varying additional metadata without schema migrations
2. **Document Model**: Natural fit for task objects with nested data (audit logs, notifications)
3. **Scalability**: Horizontal scaling for real-time collaborative applications
4. **MongoDB Atlas**: Easy cloud deployment with built-in monitoring and backups

### Backend Architecture (Service/Repository Pattern)
```
backend/
├── prisma/
│   └── schema.prisma      # MongoDB schema definitions with Prisma ORM
├── src/
│   ├── config/            # Configuration & database connection
│   ├── controllers/       # HTTP request handlers (thin layer)
│   ├── dtos/              # Data Transfer Objects with Zod validation
│   ├── middleware/        # Auth, validation, error handling middleware
│   ├── repositories/      # Database access layer (data persistence)
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer (core application logic)
│   ├── socket/            # Socket.io event handlers & real-time logic
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Application entry point
└── __tests__/             # Unit tests (Jest)
```

**Key Design Principles:**
- **Controllers**: Handle HTTP requests/responses, delegate to services
- **Services**: Contain business logic, orchestrate repositories
- **Repositories**: Abstract database operations, single responsibility
- **DTOs**: Validate and transform input data using Zod schemas

### Frontend Architecture (Feature-Based)
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Header, Layout, navigation
│   │   ├── tasks/         # Task-specific components (TaskCard, TaskForm, TaskFilters)
│   │   └── ui/            # Generic UI primitives (Button, Input, Modal, Skeleton)
│   ├── contexts/          # React contexts (AuthContext, SocketContext)
│   ├── hooks/             # Custom SWR hooks (useTasks, useNotifications)
│   ├── lib/               # API client, utilities
│   ├── pages/             # Page components (Dashboard, Tasks, Profile)
│   └── types/             # TypeScript interfaces
└── index.html
```

### JWT Authentication Implementation
- **Token Storage**: JWT stored in HttpOnly cookies (prevents XSS attacks)
- **Token Expiry**: Configurable via `JWT_EXPIRES_IN` (default: 7 days)
- **Password Hashing**: bcrypt with 12 salt rounds
- **Authorization**: Middleware validates token on protected routes

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Real-time**: Socket.io
- **Validation**: Zod
- **Testing**: Jest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io-client
- **Routing**: React Router v6
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB database (local or Atlas)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TaskManager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## ⚙️ Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="mongodb://localhost:27017/taskmanager"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## 📚 API Contract Documentation

### Base URL
- **Local**: `http://localhost:5000/api/v1`
- **Production**: `https://your-backend.onrender.com/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login user | No |
| `POST` | `/auth/logout` | Logout user | Yes |
| `GET` | `/auth/me` | Get current user profile | Yes |
| `PUT` | `/auth/me` | Update user profile | Yes |
| `PUT` | `/auth/password` | Change password | Yes |
| `GET` | `/auth/users` | Get all users (for assignment) | Yes |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tasks` | Get all tasks (with filters) | Yes |
| `GET` | `/tasks/:id` | Get single task | Yes |
| `POST` | `/tasks` | Create new task | Yes |
| `PUT` | `/tasks/:id` | Update task | Yes |
| `DELETE` | `/tasks/:id` | Delete task | Yes |
| `GET` | `/tasks/dashboard` | Get dashboard statistics | Yes |

### Task Query Parameters
```
?status=TODO|IN_PROGRESS|REVIEW|COMPLETED
&priority=LOW|MEDIUM|HIGH|URGENT
&assigneeId=<user-id>
&creatorId=<user-id>
&dueDateFrom=2024-01-01
&dueDateTo=2024-12-31
&page=1
&limit=10
&sortBy=createdAt|dueDate|priority|status
&sortOrder=asc|desc
```

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/notifications` | Get user notifications | Yes |
| `GET` | `/notifications/count` | Get unread count | Yes |
| `PATCH` | `/notifications/:id/read` | Mark as read | Yes |
| `PATCH` | `/notifications/read-all` | Mark all as read | Yes |

### Request/Response Examples

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "assignedToId": "<user-id>"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "priority": "HIGH",
    "status": "TODO",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "creatorId": "...",
    "assignedToId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

### HTTP Status Codes
| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (invalid/missing token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Internal Server Error |

## 🔌 Real-Time Socket.io Integration

### How Socket.io Was Implemented

The real-time functionality is built using Socket.io with the following architecture:

#### Server-Side (Backend)
```typescript
// socket/index.ts
- Authenticates socket connections using JWT tokens
- Maintains user-to-socket mapping for targeted notifications
- Broadcasts task events to all connected clients
- Sends personal notifications to specific users
```

#### Client-Side (Frontend)
```typescript
// contexts/SocketContext.tsx
- Establishes authenticated WebSocket connection
- Listens for real-time events (task:created, task:updated, task:deleted)
- Dispatches custom DOM events to trigger SWR revalidation
- Shows toast notifications for new notifications
```

### Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Client → Server | Initial connection with JWT auth |
| `task:created` | Server → All Clients | Broadcast when new task is created |
| `task:updated` | Server → All Clients | Broadcast when task is updated |
| `task:deleted` | Server → All Clients | Broadcast when task is deleted |
| `notification:new` | Server → Specific User | Personal notification (e.g., task assignment) |
| `join:task:{id}` | Client → Server | Subscribe to specific task updates |
| `leave:task:{id}` | Client → Server | Unsubscribe from task updates |

### Real-Time Flow Example
1. User A updates a task's status
2. Backend saves to database
3. Backend emits `task:updated` via Socket.io
4. All connected clients receive the event
5. Frontend triggers SWR revalidation
6. UI updates instantly without page refresh

## 🧪 Testing

### Backend Tests
The project includes comprehensive unit tests for critical business logic:

```bash
cd backend
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

**Test Files:**
- `src/__tests__/services/task.service.test.ts` - Task service business logic (9 tests)
- `src/__tests__/dtos/validation.test.ts` - DTO validation tests

**Test Coverage Areas:**
- Task creation validation
- Task update validation  
- Priority/Status enum validation
- Date validation
- User authorization logic

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" and import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api/v1
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy" and wait for the build to complete

### Backend Deployment (Render)

1. **Connect Repository**
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `task-manager-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=mongodb+srv://...
   JWT_SECRET=your-production-secret
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"

### Post-Deployment Checklist
- [ ] Verify API health: `GET /api/v1/health`
- [ ] Test user registration/login
- [ ] Verify real-time updates work
- [ ] Check CORS configuration
- [ ] Test on mobile devices

## 🐳 Docker Support

### Quick Start with Docker Compose
```bash
# Build and run entire stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services Included
- **MongoDB**: Database with replica set (required for Prisma)
- **Backend**: Express.js API server
- **Frontend**: Nginx serving React build

## ⚖️ Trade-offs & Assumptions

### Trade-offs Made

1. **MongoDB over PostgreSQL**
   - **Pro**: Flexible schema, easier cloud deployment, natural document model
   - **Con**: No native transactions (mitigated by Prisma's transaction API)

2. **SWR over React Query**
   - **Pro**: Simpler API, smaller bundle size, stale-while-revalidate pattern
   - **Con**: Less feature-rich than React Query

3. **JWT in HttpOnly Cookies**
   - **Pro**: Prevents XSS attacks, automatic inclusion in requests
   - **Con**: Requires CORS configuration, can't access token in JS (by design)

4. **Prisma over Mongoose**
   - **Pro**: Type-safe queries, auto-generated client, familiar SQL-like syntax
   - **Con**: Less flexible for complex MongoDB aggregations

### Assumptions Made

1. **Single Team/Workspace**: All users can see and be assigned any task
2. **No File Attachments**: Tasks contain text-only content
3. **English Only**: No internationalization implemented
4. **No Task Comments**: Communication happens outside the app
5. **No Recurring Tasks**: Each task is a one-time item
6. **Browser Support**: Modern browsers only (ES2020+)

## 📁 Database Schema

### User
| Field       | Type     | Description                |
|-------------|----------|----------------------------|
| id          | String   | Unique identifier (ObjectId) |
| email       | String   | User email (unique)        |
| name        | String   | Display name               |
| password    | String   | Hashed password            |
| createdAt   | DateTime | Creation timestamp         |
| updatedAt   | DateTime | Last update timestamp      |

### Task
| Field       | Type     | Description                |
|-------------|----------|----------------------------|
| id          | String   | Unique identifier (ObjectId) |
| title       | String   | Task title                 |
| description | String?  | Optional description       |
| status      | Enum     | TODO, IN_PROGRESS, DONE    |
| priority    | Enum     | LOW, MEDIUM, HIGH          |
| dueDate     | DateTime?| Optional due date          |
| creatorId   | String   | Creator user ID            |
| assigneeId  | String?  | Optional assignee user ID  |
| createdAt   | DateTime | Creation timestamp         |
| updatedAt   | DateTime | Last update timestamp      |

### Notification
| Field       | Type     | Description                |
|-------------|----------|----------------------------|
| id          | String   | Unique identifier (ObjectId) |
| userId      | String   | Recipient user ID          |
| message     | String   | Notification message       |
| type        | String   | Notification type          |
| taskId      | String?  | Related task ID            |
| read        | Boolean  | Read status                |
| createdAt   | DateTime | Creation timestamp         |

### AuditLog
| Field       | Type     | Description                |
|-------------|----------|----------------------------|
| id          | String   | Unique identifier (ObjectId) |
| userId      | String   | User who made the change   |
| action      | String   | Action type (CREATE, UPDATE, DELETE) |
| entityType  | String   | Entity type (TASK)         |
| entityId    | String   | Entity ID                  |
| changes     | Json     | Change details             |
| createdAt   | DateTime | Timestamp                  |

## 🔒 Security Features

- JWT tokens with configurable expiration
- Password hashing with bcrypt (10 rounds)
- CORS configuration for frontend domain
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- XSS protection through React's DOM escaping

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [Socket.io](https://socket.io/) - Bidirectional and low-latency communication
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

---

<p align="center">Made with ❤️ by Ankita Prajapati</p>

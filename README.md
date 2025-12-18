# 📋 Task Manager Application

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack collaborative Task Management application built with React, Express.js, MongoDB, and real-time collaboration features using Socket.io.

![Task Manager Screenshot](https://via.placeholder.com/800x400?text=Task+Manager+Dashboard)

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [API Documentation](#-api-documentation)
- [Socket.io Events](#-socketio-events)
- [Testing](#-testing)
- [Docker Support](#-docker-support)
- [Database Schema](#-database-schema)
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

## 🏗️ Architecture

### Backend (Express.js + TypeScript)
```
backend/
├── prisma/
│   └── schema.prisma      # MongoDB schema definitions
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # HTTP request handlers
│   ├── dtos/              # Data Transfer Objects with Zod validation
│   ├── middleware/        # Auth, validation, error handling
│   ├── repositories/      # Database access layer
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer
│   ├── socket/            # Socket.io event handlers
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Application entry point
└── __tests__/             # Unit tests
```

### Frontend (React + TypeScript)
```
frontend/
├── public/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Header, Layout components
│   │   ├── tasks/         # Task-specific components
│   │   └── ui/            # Generic UI components
│   ├── contexts/          # React contexts (Auth, Socket)
│   ├── hooks/             # Custom React hooks (SWR-based)
│   ├── lib/               # API clients, utilities
│   ├── pages/             # Page components
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Main app with routing
│   └── main.tsx           # Entry point
└── index.html
```

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

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Tasks

#### Get All Tasks
```http
GET /api/v1/tasks
Authorization: Bearer <token>

# Query Parameters
?status=IN_PROGRESS
&priority=HIGH
&assigneeId=<user-id>
&creatorId=<user-id>
&dueDateFrom=2024-01-01
&dueDateTo=2024-12-31
&page=1
&limit=10
&sortBy=createdAt
&sortOrder=desc
```

#### Get Task by ID
```http
GET /api/v1/tasks/:id
Authorization: Bearer <token>
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
  "assigneeId": "<user-id>"
}
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <token>
```

### Notifications

#### Get All Notifications
```http
GET /api/v1/notifications
Authorization: Bearer <token>
```

#### Mark as Read
```http
PATCH /api/v1/notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All as Read
```http
PATCH /api/v1/notifications/read-all
Authorization: Bearer <token>
```

## 🔌 Socket.io Events

### Client Events (emit)
- `join-user-room`: Join personal notification room
- `join-task-room`: Join a specific task's room
- `leave-task-room`: Leave a task's room

### Server Events (listen)
- `task-created`: New task created
- `task-updated`: Task updated
- `task-deleted`: Task deleted
- `notification`: New notification received

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ folder
```

## 🐳 Docker Support (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

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

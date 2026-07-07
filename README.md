# ComX

ComX is a full-stack collaboration platform for teams and communities. It combines authentication, community management, project tracking, task workflows, real-time chat, shared calendars, video calls, and public user profiles in one codebase.

This repository contains:

- `comX-frontend`: React + Vite client
- `comX-backend`: Express + Prisma API and Socket.IO server

## Screenshots

### Landing Page
![Landing Page](./screenshots/landing_page.png)

### Signup Page
![signup Page](./screenshots/signup.png)


### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Project Overview
![Project General](./screenshots/project_general.png)

### Tasks Management
![Tasks](./screenshots/tasks.png)

### Project Chat (Real-time)
![Project Chat](./screenshots/project_chat.png)

### Calendar
![Calendar](./screenshots/calendar.png)

### Community Calls
![Calls](./screenshots/call.png)

### Member Management
![Member Management](./screenshots/member_management.png)

### User Profile
![Profile](./screenshots/profile.png)

## Features

- Email/password authentication
- Community creation and join-code based onboarding
- Role-based member management (`OWNER`, `ADMIN`, `MEMBER`, `QUEUE`, `BANNED`)
- Project creation with milestones and team assignment
- Task creation, completion, review, and tracking
- Real-time project chat with Socket.IO
- Community calendar events
- LiveKit-based community calls
- User profiles, skills, and follow/unfollow support

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Redux Toolkit
- TanStack React Query
- Axios
- Tailwind CSS
- Radix UI
- Framer Motion
- Socket.IO Client
- LiveKit Components

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT via cookies
- bcryptjs
- Multer
- Cloudinary
- LiveKit Server SDK

## Repository Structure

```text
.
|-- comX-backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middlewares/
|       |-- routes/
|       |-- schemas/
|       |-- types/
|       |-- utils/
|       `-- server.ts
`-- comX-frontend/
    `-- src/
        |-- api/
        |-- components/
        |-- hooks/
        |-- lib/
        |-- pages/
        |-- state/
        |-- types/
        |-- App.tsx
        `-- main.tsx
```

## Architecture

ComX is a modular monolith:

- the frontend is a single-page React application
- the backend is a single Express service
- PostgreSQL stores relational data
- Socket.IO handles project chat
- LiveKit powers video calls
- Prisma manages schema and data access

HTTP APIs are exposed under:

- `/auth`
- `/community`
- `/member`
- `/calendar`
- `/project`
- `/task`
- `/user`

## Environment Variables

### Backend (`comX-backend/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/comx
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
```

### Frontend (`comX-frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_PUBLIC_LIVEKIT_URL=your_livekit_ws_url
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Install dependencies

```bash
cd comX-backend
npm install

cd ../comX-frontend
npm install
```

### Run database migrations

```bash
cd comX-backend
npx prisma migrate deploy
```

### Start the backend

```bash
cd comX-backend
npm run build
npm start
```

### Start the frontend

```bash
cd comX-frontend
npm run dev
```

Frontend default URL:

- `http://localhost:5173`



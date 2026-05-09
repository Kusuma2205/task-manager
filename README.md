# TaskFlow - Full Stack Task Manager

A full-stack project management application with role-based access control built with React, Node.js, and PostgreSQL.

## Live Demo
- Frontend: https://zealous-luck-production.up.railway.app
- Backend: https://task-manager-production-7ecb.up.railway.app

## Test Accounts
- Admin: kusuma@testl.com / Kusuma@22
- Member: member@test.com / 123456

## Features
- JWT Authentication (Register/Login/Logout)
- Role Based Access Control (Admin/Member)
- Admin can create projects, assign tasks, add members
- Member can only view and update assigned tasks
- Kanban board (Todo / In Progress / Done)
- Dashboard with real-time stats (Total, Completed, In Progress, Overdue)
- Responsive design works on mobile and desktop

## Tech Stack
Frontend: React + Vite + Tailwind CSS + React Router
Backend: Node.js + Express.js
Database: PostgreSQL (Railway)
Authentication: JWT + bcryptjs

## Project Structure
task-manager/
├── backend/          Node.js + Express API
│   ├── server.js
│   └── src/
│       ├── routes/   auth, projects, tasks, users
│       ├── middleware/ JWT authentication
│       └── db/       PostgreSQL connection
└── frontend/         React + Vite
└── src/
├── pages/    Login, Register, Dashboard, Projects, Tasks
├── components/ Navbar, PrivateRoute
└── context/  Auth state management
## Setup Instructions

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET/POST /api/projects
- GET/POST/PUT/DELETE /api/tasks
- GET /api/users

## Database Schema
- users (id, name, email, password, role, created_at)
- projects (id, name, description, owner_id, created_at)
- project_members (id, project_id, user_id, role)
- tasks (id, title, description, status, priority, due_date, project_id, assigned_to, created_by)
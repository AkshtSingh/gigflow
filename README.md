# Smart Leads Dashboard

Full-stack lead management dashboard built with React, TypeScript, TailwindCSS, Node.js, Express.js, MongoDB, and Mongoose.

## Features

- JWT authentication with registration and login
- Protected routes and owner-scoped lead access
- Lead CRUD with filters, search, sorting, and pagination
- Responsive analytics-style dashboard UI
- Centralized validation and error handling

## Setup

1. Install dependencies: `npm install`
2. Create environment files from the examples in `server/.env.example` and `client/.env.example`
3. Start MongoDB locally or provide a MongoDB Atlas connection string
4. Run the app: `npm run dev`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/leads`
- `POST /api/leads`
- `GET /api/leads/:id`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id`
- `GET /api/leads/summary`

# Smart Leads Dashboard

Smart Leads Dashboard is a full-stack lead management app built with React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, and Mongoose. It includes JWT authentication, role-based access control, CRUD lead management, debounced search, CSV export, pagination, Docker support, and a dark mode UI.

## What It Does

- Register and log in with JWT authentication
- Support `admin` and `sales` roles
- Let sales users manage only their own leads
- Let admins view all leads and export all records
- Search, filter, sort, and paginate leads
- Create, edit, view, and delete leads
- Export filtered leads to CSV
- Switch between light and dark mode
- Run locally or with Docker

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express 5, TypeScript
- Database: MongoDB, Mongoose
- Auth: JWT, bcryptjs
- Tooling: Docker, Docker Compose, concurrent workspace scripts

## Project Structure

- `client/` - React UI
- `server/` - Express API
- `docker-compose.yml` - Local multi-container setup
- `tsconfig.base.json` - Shared TypeScript config

## Requirements

- Node.js 18 or newer
- npm 10 or newer
- MongoDB locally, MongoDB Atlas, or Docker Desktop
- Docker Desktop if you want to run the app with containers

## Environment Variables

### Server

Create `server/.env` from `server/.env.example`.

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-leads
MONGODB_FALLBACK_URI=
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

### Client

The client defaults to `http://localhost:4000` automatically.
If you want to override it, set:

```env
VITE_API_URL=http://localhost:4000
```

## Getting Started Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the server environment

Create `server/.env` and set values for `MONGODB_URI` and `JWT_SECRET`.

### 3. Start MongoDB

Use either:

- A local MongoDB instance on port `27017`
- A MongoDB Atlas connection string
- Docker, if you prefer containerized MongoDB

### 4. Start the app in development mode

```bash
npm run dev
```

This starts:

- Server on `http://localhost:4000`
- Client on `http://localhost:5173`

## Available Scripts

### Root

```bash
npm run dev
npm run build
npm run start
```

- `npm run dev` - starts server and client together
- `npm run build` - builds server first, then client
- `npm run start` - starts the compiled server

### Server

```bash
npm run dev --workspace server
npm run build --workspace server
npm run start --workspace server
```

- `dev` - hot-reload API server
- `build` - compile TypeScript to `dist/`
- `start` - run the compiled server

### Client

```bash
npm run dev --workspace client
npm run build --workspace client
npm run preview --workspace client
```

- `dev` - start Vite locally
- `build` - type-check and bundle the UI
- `preview` - preview the production build

## Docker

The repository includes a full Docker setup for MongoDB, the API server, and the client.

### Start Everything

```bash
docker compose up --build -d
```

### Check Status

```bash
docker compose ps
```

### View Logs

```bash
docker compose logs -f
```

### Stop Services

```bash
docker compose down
```

### Remove Data Volume Too

```bash
docker compose down -v
```

### Docker Ports

- MongoDB: `27017`
- API server: `4000`
- Client: `5173`

### Docker Notes

- The server container uses the local MongoDB service from Compose.
- The client container serves the built app through Nginx.
- You must have Docker Desktop running before using `docker compose`.

## API Endpoints

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Leads

- `GET /api/leads`
- `GET /api/leads/summary`
- `GET /api/leads/export`
- `POST /api/leads`
- `GET /api/leads/:leadId`
- `PATCH /api/leads/:leadId`
- `DELETE /api/leads/:leadId`

## Feature Notes

### Authentication

- JWT tokens are issued on login and registration.
- User sessions are stored in local storage on the client.
- The server attaches the user ID and role from the JWT payload.

### Role-Based Access Control

- `admin` users can see all leads.
- `sales` users can see and manage only their own leads.

### Lead Management

- Lead records include name, email, status, source, owner, and timestamps.
- Lists are paginated and filtered on the server.
- Search input is debounced to reduce unnecessary API calls.

### CSV Export

- Export is available from the dashboard.
- Admins can export all accessible leads.
- Sales users export only their own leads.

### Dark Mode

- Dark mode is class-based and persists in local storage.
- The UI switches between light and dark themes without reloading.

## Troubleshooting

### `MongooseServerSelectionError`

If the server cannot connect to MongoDB Atlas:

- Verify the Atlas IP allowlist
- Confirm the username and password in `MONGODB_URI`
- Try a local MongoDB instance instead
- Set `MONGODB_FALLBACK_URI=mongodb://127.0.0.1:27017/smart-leads`

### Docker Build Issues

If `docker compose` fails:

- Make sure Docker Desktop is running
- Rebuild from the project root
- Check that you are using the root `docker-compose.yml`

### Login Issues

If you cannot log in:

- Confirm the server is running
- Verify the MongoDB connection in `server/.env`
- Make sure the frontend is pointing at the correct API URL



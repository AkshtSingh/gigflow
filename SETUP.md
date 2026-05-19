# Setup Instructions

Local development

1. Install dependencies

```bash
npm install
```

2. Create server environment

- Copy `server/.env.example` to `server/.env` and set values (MongoDB connection string, `JWT_SECRET`, etc.)

3. Start MongoDB (local or Atlas)

4. Run in development (root workspace)

```bash
npm run dev
```

This starts the server (`http://localhost:4000`) and client (`http://localhost:5173`).

Docker (recommended for production-like runs)

- Start all services with Docker Compose:

```bash
docker compose up --build -d
```

- To run on a host with a reverse proxy (single public URL), use the host compose file:

```bash
docker compose -f docker-compose.host.yml up --build -d
```

Useful commands

```bash
docker compose ps
docker compose logs -f
docker compose down
docker compose down -v
```

Notes

- Keep secrets out of version control. Do not commit `server/.env` with real credentials.
- The client reads `VITE_API_URL` if you need to override the API base URL; otherwise it uses relative `/api` requests when proxied.

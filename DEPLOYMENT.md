Deployment Guide — Smart Leads Dashboard

Overview
- This repository is a monorepo with `server/` (Express + TypeScript) and `client/` (Vite + React).
- The repo is configured to deploy both frontend and backend to Vercel (monorepo) and uses MongoDB Atlas for the database.

Required environment variables (Vercel Project: `Environment Variables`)
- For the server project (set in Vercel for the monorepo project):
  - `MONGODB_URI` — MongoDB connection string (example: `mongodb+srv://user:PASS@cluster0.mongodb.net/dbname`)
  - `JWT_SECRET` — strong secret for JWT signing
  - `CLIENT_ORIGIN` — URL of the deployed client (e.g. `https://your-client.vercel.app`) — used for CORS
  - (optional) `MONGODB_FALLBACK_URI` — fallback connection string
  - (optional) `NODE_ENV=production`
- For the client (set in Vercel project environment variables):
  - `VITE_API_URL` — the server base URL, e.g. `https://your-server.vercel.app`

Local development
- Run both projects concurrently from the repo root (requires Node.js and npm):

```bash
cd "e:/gigflow-smart leads dashboard"
npm install
npm run dev
```

- Build locally

```bash
# build server
cd server
npm install
npm run vercel-build

# build client
cd ../client
npm install
npm run build
```

- Run built server locally

```bash
cd server
# set env (copy .env.example to .env and fill values)
node dist/index.js
# server will start on port 4000 by default
```

Deploy to Vercel (recommended: use Vercel web UI or CLI)
- Using Vercel web UI
  1. Create a new Vercel project and import this Git repository.
  2. Vercel will detect the monorepo. Set the Root to the repository root.
  3. In Project Settings → General → Framework Preset choose "Other" or let Vercel auto-detect.
  4. In Build & Output Settings set the Build Command to `npm run vercel-build` and the Output Directory to leave empty (the `vercel.json` routes static files appropriately).
  5. Add the environment variables listed above.
  6. Deploy.

- Using Vercel CLI

```bash
npm i -g vercel
# run from repo root
vercel --prod --confirm
```

Notes & troubleshooting
- The server enforces `MONGODB_URI` and `JWT_SECRET` at startup. Ensure those are set in Vercel environment variables.
- CORS is configured via `CLIENT_ORIGIN` (server reads it from env). Set it to your client URL.
- The monorepo `vercel.json` routes `/api/*` to the serverless Node function at `server/api/index.js` and serves the client from `client/dist`.
- If you get function timeout errors on Vercel, increase `maxDuration` in `server/vercel.json` or optimize long-running endpoints.

Files I added/changed
- `vercel.json` (root) — monorepo Vercel config
- `package.json` (root) — added `vercel-build` script
- `server/vercel.json` — trimmed rewrite to only expose `/api/*` (kept server function config)

If you want, I can:
- Open a PR with `.github/workflows` for automatic deployments on push.
- Add a simple health-check page at the client root that calls `/api/health`.
- Configure Vercel Preview Environment variables and branch protections.


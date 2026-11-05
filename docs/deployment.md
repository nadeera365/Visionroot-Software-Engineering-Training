# Deployment and runbook

This document explains how to configure, build and run the Service Request Management System outside the developer's machine.
It describes a reproducible production-like build that runs locally. It is not a hosted deployment.
Deploying to a real production system needs the supervisor's approval.

## 1. Requirements

- Node.js 20 or newer and npm
- PostgreSQL 13 or newer
- Git

## 2. Configuration

All configuration comes from environment variables. No secret is stored in the repository.
Copy `.env.example` to `.env` (backend) or `.env.local` (frontend) and fill in your own values.
A variable set in the terminal overrides the value from the file.

Backend (`backend/.env`):

| Variable | Required | Placeholder example | Notes |
|---|---|---|---|
| NODE_ENV | No | development | Use `production` for the production build |
| PORT | No | 4000 | |
| DATABASE_URL | Yes | postgresql://USER:PASSWORD@localhost:5432/service_requests | Contains the database password. Never commit it or send it in chat |
| FRONTEND_ORIGIN | Yes in production | http://localhost:3000 | The only website allowed to call the API from a browser (CORS). It must match exactly: scheme, host and port |

Frontend (`frontend/.env.local`):

| Variable | Required | Placeholder example | Notes |
|---|---|---|---|
| NEXT_PUBLIC_API_URL | Yes | http://localhost:4000/api | Public. It is written into the browser files when the app is built. Never put a secret in a NEXT_PUBLIC_ variable. After a change, build again |

## 3. Build and run from a clean checkout (PowerShell)

1. Create an empty database called `service_requests`.

2. Backend. Install first, then set the variables (if NODE_ENV=production is set before `npm ci`, the tools needed for migrations are not installed):

```
git clone <repository-url>
cd <repository-folder>\backend
npm ci
npm run build

$env:NODE_ENV="production"
$env:PORT="4000"
$env:DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/service_requests"
$env:FRONTEND_ORIGIN="http://localhost:3000"

npm run migrate
npm start
```

3. Frontend (new terminal):

```
cd <repository-folder>\frontend
npm ci
$env:NEXT_PUBLIC_API_URL="http://localhost:4000/api"
npm run build
npm start
```

Open http://localhost:3000. On Linux or macOS use `export NAME="value"` instead of `$env:NAME="value"`.

## 4. Verify

Health check: `curl.exe http://localhost:4000/api/health`

- `{"status":"ok","database":"connected"}` with HTTP 200 means the app and the database are fine.
- HTTP 503 `SERVICE_UNAVAILABLE` means the app is running but the database is not reachable.

Security headers: `curl.exe -i http://localhost:4000/api/health` shows `X-Content-Type-Options`, `Strict-Transport-Security` and others, and no `X-Powered-By`.

## 5. Logs

The backend writes one JSON object per line to the console:

```
{"time":"...","level":"info","message":"Server started","port":4000,"nodeEnv":"production"}
{"time":"...","level":"info","message":"request","method":"GET","path":"/api/health","status":200,"durationMs":5}
{"time":"...","level":"error","message":"Health check failed","error":"..."}
```

Request logs contain the method, the path, the status and the duration. They never contain bodies, query strings, headers or passwords.
Error logs contain the error message and the stack, but only on the server. The client always receives a safe message.

## 6. HTTPS

The app listens on plain HTTP. In a real deployment the hosting platform or a reverse proxy provides HTTPS and forwards requests to the app.
Then FRONTEND_ORIGIN must be the https address of the frontend.

## 7. Database migrations

Migrations are SQL files in `backend/src/database/migrations/`. `npm run migrate` runs each file once, in order, and records it in the `schema_migrations` table.
Never edit a migration that has already been applied. Add a new numbered file instead.

## 8. Rollback

Application:
1. Tag every release: `git tag v0.1.0` and `git push origin v0.1.0`.
2. To go back: `git checkout <previous-tag>`, then `npm ci`, `npm run build`, restart, and check the health endpoint.

Database:
1. Migrations only go forward. To undo a change, write a new migration that reverses it.
2. Before every migration, take a backup: `pg_dump -U <user> -d service_requests -F c -f backup.dump`
3. To restore: `pg_restore -U <user> -d service_requests --clean backup.dump`

## 9. Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| Server stops with "DATABASE_URL is not set" | The variable is missing | Set it in `.env` or in the terminal |
| Server stops with "FRONTEND_ORIGIN is not set" | Production mode needs it | Set FRONTEND_ORIGIN |
| Health returns 503 | The database is down, or the URL, user or password is wrong | Check that PostgreSQL is running and check DATABASE_URL. The reason is in the server log |
| The browser shows a CORS error | FRONTEND_ORIGIN does not match the frontend address exactly | Fix FRONTEND_ORIGIN and restart the backend |
| The frontend still calls the old API address | NEXT_PUBLIC_API_URL is fixed at build time | Change it and run `npm run build` again |
| "port already in use" | Another process uses the port | Stop it or change PORT |

## 10. Recommended for real use: a limited database user (least privilege)

Run the migrations with the owner user. Let the running app use a user that can only read and write the data:

```sql
CREATE ROLE service_requests_app LOGIN PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
GRANT CONNECT ON DATABASE service_requests TO service_requests_app;
GRANT USAGE ON SCHEMA public TO service_requests_app;
GRANT SELECT, INSERT, UPDATE ON requests TO service_requests_app;
```

On PostgreSQL 14 or older also run `REVOKE CREATE ON SCHEMA public FROM PUBLIC;`.
This user can create, list, view and update requests, but it cannot delete rows, drop tables or change the schema.

## 11. Known limitations

See `docs/security-checklist.md`.
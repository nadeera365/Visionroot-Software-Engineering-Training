# Service Request Management System

A small internal web app where users submit service requests and track them from open to closed.
Built as the VisionRoot trainee software engineer training project.

Version: v0.1.0 (MVP). This is a training project. It is not approved for production use (see "Known limitations").

## What it does

- Create a request (title, description, category, priority)
- List requests and filter by status
- View the details of a request
- Move a request through OPEN, IN_PROGRESS, RESOLVED and CLOSED (only the next step is allowed)
- Data is stored in PostgreSQL

## Tech stack

Next.js (frontend), Express.js with TypeScript (backend), PostgreSQL (database).

## Architecture

![Architecture diagram](docs/architecture.drawio)

A request flows like this: UI, controller (validates the input), service (business rules), repository (SQL), PostgreSQL.

| Layer | Responsibility |
|---|---|
| Frontend | Screens, form validation for usability, loading and error states, calls the API through one API client |
| Controller | HTTP only: reads the request, validates it, sends the status code and JSON |
| Service | Business rules, for example the status workflow |
| Repository | SQL only (parameterized queries) |
| Database | Stores the data, constraints and indexes protect it |

Why it is built this way: see `docs/decisions/ADR-001-architecture.md` (modular monolith with a layered backend) and `docs/decisions/ADR-002-database-access.md` (PostgreSQL with SQL migrations, no ORM).

## Getting started

Full steps for a clean machine: `docs/deployment.md`.

Short version for development:

1. Create a PostgreSQL database called `service_requests`.
2. Backend: `cd backend`, copy `.env.example` to `.env` and fill in the values, then `npm install`, `npm run migrate`, `npm run dev`.
3. Frontend: `cd frontend`, copy `.env.example` to `.env.local`, then `npm install`, `npm run dev`.
4. Open http://localhost:3000

Never commit `.env` files or share passwords in chat.

## Configuration

| Folder | Variable | Notes |
|---|---|---|
| backend | NODE_ENV, PORT, DATABASE_URL, FRONTEND_ORIGIN | FRONTEND_ORIGIN is required in production |
| frontend | NEXT_PUBLIC_API_URL | Public. Fixed when the frontend is built |

## Testing

Run in `backend`: `npm test`, `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:workflow` (needs the running backend).
Run in `frontend`: `npm run lint`, `npm run build`.
Final results: `evidence/Day-10/test-results.md`.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | App and database health |
| POST | /api/requests | Create a request |
| GET | /api/requests | List requests (optional ?status=) |
| GET | /api/requests/:id | Request details |
| PATCH | /api/requests/:id/status | Move to the next status |

Details, examples and error codes: `docs/api-contract.md`.

## Project structure

- `backend/`: Express API, migrations, tests
- `frontend/`: Next.js app
- `docs/`: requirements, architecture, data model, API contract, deployment runbook, security checklist, decisions
- `evidence/`: daily logs and evidence, one folder per day (Day-01 to Day-10)

## Git workflow

Feature branch for each task, small commits, pull request, review, merge. No direct commits to `main`.

## Known limitations

No login or roles (anyone who can reach the API can change a status), plain HTTP, no rate limiting, no automatic backups.
Full list: `docs/security-checklist.md`.

## Release

Current version: v0.1.0. Release notes: `docs/release-notes.md`.
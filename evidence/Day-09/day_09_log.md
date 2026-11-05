# Daily Evidence Record: Day 09

Date: 2026-11-05
Day / topic: Day 09, Security, deployment and operations
Objective: Prepare a repeatable build and document how to run it outside the developer's machine.

## What I learned
- Authentication means "who are you". Authorization means "what are you allowed to do". Hidden buttons in the UI are not authorization, because anyone can call the API directly.
- Least privilege: give the application only the permissions it needs. For the database, that means a user who can read and write the data but cannot drop tables or change the schema.
- Safe error handling: the client gets a generic message. The details (error message and stack) stay in the server log.
- Secrets belong in environment variables, not in code, Git history or chat. The .env.example file contains placeholder names only.
- NEXT_PUBLIC_ variables are written into the browser files when the frontend is built. They are public, so they must never contain a secret, and a change needs a new build.
- CORS allows only the frontend origin. HTTPS is provided by the hosting platform or a reverse proxy, not by the app.
- A health check shows whether the app and its database work. Structured logs (one JSON object per line) are easy to search.
- Rollback: tag each release, take a database backup before a migration, and only move migrations forward.

## What I implemented
- Security review: a written review of authorization needs and server-side validation.
- Security headers with helmet (X-Powered-By is hidden).
- Structured JSON logging, with a request logger that never logs bodies, query strings or headers.
- Configuration check: the app refuses to start without DATABASE_URL, and without FRONTEND_ORIGIN when NODE_ENV=production.
- docs/deployment.md (runbook): configuration, clean build, verification, logs, HTTPS, migrations, rollback, troubleshooting, least privilege database user.
- docs/security-checklist.md with the checklist and the known limitations.
- Updated .env.example files (placeholder names only).
- Checked the Git status and history for accidental secrets.
- Built and ran the backend and frontend from a clean checkout in production mode.

## Files / folders changed
- backend/src/logger.ts
- backend/src/middleware/request-logger.ts
- backend/src/middleware/error-handler.ts
- backend/src/config/environment.ts
- backend/src/app.ts
- backend/src/server.ts
- backend/package.json and package-lock.json (helmet)
- backend/.env.example
- frontend/.env.example
- docs/deployment.md
- docs/security-checklist.md
- evidence/Day-09/

## How I tested it

| # | Check | Expected | Result (write what you saw) |
|---|---|---|---|
| 1 | npm test (backend) | 45 tests pass | |
| 2 | npm run lint, format:check and typecheck | no problems | |
| 3 | git check-ignore -v backend/.env frontend/.env.local | both files are ignored | |
| 4 | git ls-files, filtered for .env | only backend/.env.example and frontend/.env.example | |
| 5 | Git history: .env-like file names | only the two .env.example files | |
| 6 | Git history: a connection string with a password | no commits found | |
| 7 | Clean checkout, npm ci, npm run build | both succeed | |
| 8 | Start in production mode without DATABASE_URL | the app refuses to start with a clear message | |
| 9 | Start in production mode without FRONTEND_ORIGIN | the app refuses to start with a clear message | |
| 10 | Migrate and start with all variables set | "Server started" JSON log line | |
| 11 | GET /api/health | 200, database connected | |
| 12 | Response headers | security headers present, no X-Powered-By | |
| 13 | Server log lines | JSON lines with method, path, status, duration; no passwords, bodies or query strings | |
| 14 | npm audit --omit=dev (backend and frontend) | (write the number of vulnerabilities) | |

## Evidence links
- evidence/Day-09/01-env-check.png
- evidence/Day-09/02-missing-database-url.png
- evidence/Day-09/03-missing-frontend-origin.png
- evidence/Day-09/04-production-server-started.png
- evidence/Day-09/05-health-check.png
- evidence/Day-09/npm-audit-backend.txt
- evidence/Day-09/npm-audit-frontend.txt
- docs/deployment.md
- docs/security-checklist.md

All screenshots are redacted: no passwords, no real DATABASE_URL, no private URLs and no personal data.

## Problem encountered

While navigating to the clean clone's backend directory in PowerShell, an error occurred: `Illegal characters in path`. The directory change command also included an unnecessary `>` character at the end of the path.

## How I investigated it

Reviewed the PowerShell error message and checked the current working directory. Identified that the path supplied to the `cd` command contained an extra character.

## Root cause

The `>` character was accidentally included at the end of the directory path. PowerShell interpreted it as part of the path instead of treating it as a prompt symbol.

## How I fixed it

Used the correct PowerShell command without the extra character:

```powershell
cd "$env:TEMP\clean-test-day09\backend"
```

Verified the working directory using:

```powershell
pwd
```

Successfully corrected the directory navigation command.

## What I would improve
- Add login and roles (F-01), so that only support staff can change a status.
- Use a limited database user for the running app.
- Add rate limiting, and add HTTPS through the hosting platform or a reverse proxy.

## GitHub branch
feat/day-09-security

## Pull request


## Commit hash


## Blockers / questions for supervisor
- None
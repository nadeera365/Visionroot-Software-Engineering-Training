# Security checklist (Day 09)

## 1. Authentication and authorization

Authentication means "who are you". Authorization means "what are you allowed to do".
The MVP has neither. Login and roles are a future item (F-01).

Who should be able to do what:

| Action | Requester | Support staff | Enforced in the MVP? |
|---|---|---|---|
| Create a request | Yes | Yes | No. Anyone who can reach the API can do it |
| List and view requests | Own requests only | All requests | No. Everyone sees everything |
| Change the status | No | Yes | No. Anyone can call PATCH |

Hidden or disabled buttons in the UI are not authorization. Anyone can call the API directly (with Postman or curl).
The server rules for status changes are enforced and tested, but the server does not check who is calling.

Plan for F-01: login, a role on each user, an auth middleware, a role check on PATCH /api/requests/:id/status (support staff only),
and a created_by column so requesters see only their own requests.

## 2. Server-side validation review

| Input | Where it is validated | Rules | Tested by |
|---|---|---|---|
| POST body | createRequestSchema (schema.ts) | title 3 to 100, description 1 to 1000, category and priority from fixed lists. Unknown fields (for example status) are ignored | Integration tests |
| PATCH body | updateStatusSchema and the service | status must be a known value and only the next step is allowed | 16 unit tests and integration tests |
| :id in the URL | idParamSchema | must be a UUID | Integration tests |
| ?status= filter | listQuerySchema | must be a known status | Integration tests |
| Request body size | express.json default limit | over 100 KB returns 413 | Regression test |
| SQL values | repository.ts | parameterized queries ($1, $2), never string concatenation | Manual check: a description with SQL text is saved as plain text |

The frontend also validates the form, but only for usability. The server never trusts the frontend.

## 3. Checklist

| # | Item | Status | How verified |
|---|---|---|---|
| 1 | .env files are ignored by Git | Done | `git check-ignore -v backend/.env frontend/.env.local` |
| 2 | No secrets in tracked files or in Git history | Done | Commands in section 4 of this folder's evidence (Day-09) |
| 3 | .env.example files contain placeholder names only | Done | Opened both files |
| 4 | Secrets come only from environment variables | Done | Clean checkout run (docs/deployment.md, section 3) |
| 5 | The app refuses to start without required configuration | Done | Missing DATABASE_URL, and missing FRONTEND_ORIGIN in production |
| 6 | CORS allows only the frontend origin | Done | Access-Control-Allow-Origin header in the response |
| 7 | Security headers (helmet), X-Powered-By hidden | Done | `curl.exe -i http://localhost:4000/api/health` |
| 8 | Server-side validation for every input | Done | Section 2 and the Day 08 tests |
| 9 | Parameterized SQL queries | Done | repository.ts |
| 10 | Safe error messages (no stack, SQL or password) | Done | Day 08 test "unexpected error: 500 with a safe message" |
| 11 | Request body size limit | Done | Day 08 regression test (413) |
| 12 | Logs contain no passwords, bodies, queries or headers | Done | Read the log lines of a run |
| 13 | NEXT_PUBLIC_ variables contain no secrets | Done | Only NEXT_PUBLIC_API_URL exists |
| 14 | Dependencies checked with npm audit | (write your own result) | `npm audit --omit=dev` in backend and frontend |
| 15 | Least privilege database user | Partly | Documented in docs/deployment.md. Local development uses the postgres user |
| 16 | HTTPS | Not handled by the app | TLS must be provided by the host or a reverse proxy |
| 17 | Authentication and authorization | Not done | MVP scope (F-01) |
| 18 | Rate limiting | Not done | Not in the MVP |
| 19 | Audit trail (who changed a status) | Not done | Needs login first |
| 20 | Two users changing a status at the same time | Not done | The service reads then updates. A conditional UPDATE can fix it later |

## 4. Known limitations

- Anyone who can reach the API can create requests, see all requests and change any status (no login, no roles).
- The API listens on plain HTTP. HTTPS must be added by the hosting platform or a reverse proxy.
- There is no rate limiting, so a client can send many requests.
- The local database user is the postgres administrator. A real deployment should use a limited user.
- Status changes have no audit trail and a small race condition when two users act at once.
- No automatic backups. Backups and rollback are manual (see docs/deployment.md).
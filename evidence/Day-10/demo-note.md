# Demo notes (Day 10)

Length: 8 minutes. Repository: https://github.com/nadeera365/Visionroot-Software-Engineering-Training

## Before the demo
- [ ] PostgreSQL is running and the backend and frontend are running
- [ ] Backend: npm run dev (health returns 200). Frontend: npm run dev
- [ ] The list has no secret data. Postman is closed or shows only {{base_url}}
- [ ] Terminal and browser have no passwords visible
- [ ] Plan B ready: the screenshots in evidence/ and the Postman collection

## Script

| Time | Topic | What I say | What I show |
|---|---|---|---|
| 0:00 | The problem | People report problems by chat or email and the reports get lost. This system gives one place to submit and track requests. | README top |
| 1:00 | Requirements | 8 user stories, 2 users (requester, support staff). MVP versus future items. | docs/requirements.md and the Jira board |
| 2:00 | Architecture | Next.js frontend, Express backend in layers (controller, service, repository), PostgreSQL. Validation, business rules and persistence each have their own place. | docs/architecture.png |
| 3:30 | End-to-end flow | Create a request, see it in the list, open the details, move it to the next status. | Browser: create, list, details, status buttons |
| 5:00 | A rule the server enforces | A button is not security. The server rejects a skipped step. | npm run test:workflow, or Postman: OPEN to CLOSED returns 400 |
| 5:45 | Tests | Unit tests for the status rules (16 cases), API integration tests for validation and not-found, a regression test for a bug I found. | npm test (all pass) |
| 6:45 | Security and operations | Secrets only in environment variables, helmet, CORS, structured logs, health check, deployment runbook. | docs/security-checklist.md, health check |
| 7:30 | Risks and next steps | No login or roles yet, plain HTTP, no rate limiting. Next: login and roles. | docs/security-checklist.md section 4 |

## Numbers for the demo (write the real ones)
- Backend tests: 45 passed 
- Lint, format check, typecheck: passed
- Workflow test: 12 checks passed

## Final version
- Tag: v0.1.0
- Commit hash: (paste after tagging)

## Questions I should be able to answer
- What did you build? A small full-stack app to submit and track service requests, with a tested API and a PostgreSQL database.
- Why is it structured like this? Layers keep HTTP, business rules and SQL apart. That makes the code easy to test and change (ADR-001).
- What is tested? The status rules (all 16 combinations), validation, not-found cases, safe errors, the health check, and a bug with a regression test.
- What remains before real production use? Login and roles, HTTPS, rate limiting, monitoring and backups, a security review, and approval from the supervisor.
# Release notes

## v0.1.0 (MVP, training project)

Date: 06.11.2023

### Added
- Create, list (with status filter), view and update the status of service requests
- Status workflow: OPEN, IN_PROGRESS, RESOLVED, CLOSED (only the next step is allowed)
- PostgreSQL storage with SQL migrations
- Frontend with loading, empty, error and success states
- Server-side validation, safe error responses, health check, structured logs, security headers
- Unit and integration tests, an end-to-end workflow script
- Deployment runbook and security checklist

### Known limitations
- No authentication or roles
- Plain HTTP, no rate limiting
- Manual backups and rollback
- Not approved for production use

### How to run
See docs/deployment.md. Run `npm run migrate` before starting the backend.
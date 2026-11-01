# Daily Evidence Record — Day 06

**Date:** 2026-11-01  
**Day / Topic:** Database Integration, PostgreSQL, and Data Persistence

## Objective

Connect the Service Request Management API to PostgreSQL, replace temporary in-memory storage with database persistence, and verify database operations and failure handling.

## What I learned

- What a database migration is and why schema changes should be version-controlled.
- How a migration tracking table records migrations that have already been applied.
- How PostgreSQL constraints such as `PRIMARY KEY`, `NOT NULL`, and `CHECK` help protect data.
- How indexes can improve filtering and sorting operations.
- How parameterized SQL queries using placeholders such as `$1` and `$2` help prevent SQL injection.
- How transactions use `BEGIN`, `COMMIT`, and `ROLLBACK` to keep database changes consistent.
- How a connection pool reuses database connections.
- Why a running Express server does not automatically mean that the database connection is working.

## What I implemented

- Added PostgreSQL connectivity using the `pg` package.
- Added a shared PostgreSQL connection pool.
- Added `DATABASE_URL` to the environment configuration.
- Created a SQL migration to create the `requests` table, including its fields, constraints, and indexes.
- Implemented a migration runner that applies SQL migration files in order and records applied migrations in `schema_migrations`.
- Updated the request repository to use PostgreSQL instead of the in-memory array.
- Used parameterized queries for creating, listing, and retrieving service requests.
- Added a database connectivity check for the health endpoint.
- Updated the database setup documentation.

## How I tested it

- Ran the migration against a PostgreSQL database and checked that the migration was applied.
- Ran the migration again and checked that the already-applied migration was skipped.
- Tested creating, listing, and retrieving service requests against PostgreSQL.
- Tested that request records remained available after restarting the backend.
- Tested a missing request and checked the expected 404 response.
- Tested database connection failure and missing `DATABASE_URL` configuration.
- Tested invalid request data and checked the expected 400 response.
- Tested parameterized query handling with SQL-like text in a request description.

## Evidence

Screenshots and test outputs should be saved in `evidence/Day-06/`.


## Problems encountered

- The backend initially could not read `DATABASE_URL` because it was not included in the exported environment configuration.
- Postman returned `read ECONNRESET` even though the backend printed that it was running on port 5000.
- The database URL and PostgreSQL port needed to be checked separately from the Express API port.

## How I fixed them

- Added `DATABASE_URL` to the exported environment configuration.
- Checked that dotenv configuration was loaded and that the `.env` file was in the backend root directory.
- Reviewed the database connection configuration.
- Started checking the Postman connection and PostgreSQL service separately. The local `ECONNRESET` issue still needs final verification.

## What I would improve

- Resolve and retest the local Postman `ECONNRESET` issue.
- Add automated integration tests for PostgreSQL repository operations.
- Add more database migration tests for future schema changes.
- Improve database monitoring and logging without exposing credentials or sensitive connection details.

## GitHub branch

`feat/day-06-database`

## Pull request



## Commit hash



## Blockers / questions for supervisor

- Confirm the expected health-check route and response format for the database-connected API.
- Confirm whether any additional database constraints or indexes are required for the MVP.

# ADR-002: Use PostgreSQL with parameterized SQL and SQL migration files, without an ORM

Status: Accepted

## Context
The MVP stores one entity (a request) with fixed rules (allowed values, lengths) and needs a repeatable way to create the schema on any machine.

## Decision
- Use PostgreSQL through the `pg` library. All SQL is in the repository layer, and every value is passed as a parameter ($1, $2).
- The schema is created by numbered .sql files in `backend/src/database/migrations/`. A small script (`npm run migrate`) runs each file once, inside a transaction, and records it in `schema_migrations`.
- Rules such as allowed values are also enforced by CHECK constraints in the database.

## Alternatives considered
- An ORM (for example Prisma, Drizzle or TypeORM): less SQL to write, but more concepts and dependencies, and less visible SQL for a small project.
- A migration library (for example node-pg-migrate): more features, but one more tool to learn. A small script was enough.
- Changing the database by hand: not repeatable and not documented, so a teammate could not recreate it.

## Consequences
- Easier: the SQL is visible and easy to review, SQL injection is prevented by parameters, and any machine can create the schema with one command.
- Harder: rows must be mapped to objects by hand, and the migration script has no "down" migrations or checksums. Undoing a change needs a new migration.


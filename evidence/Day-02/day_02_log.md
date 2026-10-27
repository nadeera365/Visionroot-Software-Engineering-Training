# Daily Evidence Record: Day 02

**Date:** 2026-10-27  
**Day / Topic:** Day 02 – Architecture and Data Modelling  
**Objective:** Define the system architecture, design the request data model, and document the API contract for the Service Request Management System.

## What I Learned

- Learned how to document architecture decisions using an Architecture Decision Record (ADR).
- Understood the difference between a Request Entity diagram and a database relationship diagram (ERD).
- Learned how to identify database fields, data types, primary keys, and foreign keys.
- Understood why the MVP should contain only the features and database structures needed for the initial version.
- Learned how to document API endpoints, HTTP methods, request bodies, and expected responses.

## What I Implemented

- Created an architecture diagram showing the frontend, backend layers, and database.
- Wrote ADR-001 to explain the decision to use a modular monolith with a layered backend.
- Updated the data model to include only the `requests` table for the current MVP.
- Separated the current MVP database design from possible future improvements.
- Prepared the entity relation diagram.
- Created an API contract documenting the endpoints required for managing service requests.

## Files / Folders Changed

- `docs/architecture.drawio`
- `docs/ADR-001-architecture.md`
- `docs/data-model.md`
- `docs/ERD.drawio`
- `docs/api-contract.md`
- `evidence/Day-02/daily-log.md`

## How I Checked My Work

- Checked that the architecture diagram shows the main parts of the system and how they communicate.
- Reviewed ADR-001 to ensure the architecture decision and alternatives are documented.
- Checked that the current MVP data model contains only the `requests` table.
- Verified that the ERD represent the current MVP without adding future database tables or relationships.
- Reviewed the API contract to check that the documented endpoints, request fields, and response expectations are clear.

## Problems Encountered

I faced a few challenges while working on Day 02:

1. I was unsure about the difference between a Request Entity diagram and a database relationship diagram.
2. My initial ERD included separate Requester and Support Staff tables, even though these are not part of the current MVP database.
3. I needed to make sure the architecture, data model, and API contract were consistent with the agreed MVP scope.

## How I Investigated the Problems

1. I reviewed the purpose of entity diagrams and ERDs to understand what each diagram should represent.
2. I reviewed the MVP requirements and confirmed that only the `requests` table is needed for the initial version.
3. I reviewed the architecture decision and data model to keep the current implementation separate from future improvements.

## Root Cause

I was still learning how to translate requirements into an architecture and database design. I initially included possible future features in the current ERD, which made the database design inconsistent with the MVP scope.

## How I Fixed the Problems

1. Separated the Request Entity diagram from the database relationship diagram.
2. Updated the current MVP ERD to show only the `requests` table, without Requester or Support Staff tables and their foreign keys.
3. Moved the Requester and Support Staff database relationships to the future improvements section of the data model.
4. Documented the architecture decision and API contract to make the system design clearer.

## What I Would Improve

Next time, I will review the MVP requirements before creating diagrams and make sure all design documents follow the same scope. I will also check the diagrams against the data model before submitting them.

## GitHub branch
docs/day-02-

## Pull request
https://github.com/nadeera365/Visionroot-Software-Engineering-Training/pull/

## Commit hash


## Blockers / Questions for Supervisor

- Is the proposed modular monolith architecture suitable for this project?
- Is the current MVP data model, with only the `requests` table, sufficient for the initial implementation?
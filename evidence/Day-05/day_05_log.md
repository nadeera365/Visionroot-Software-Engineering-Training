# Daily Evidence Record — Day 05

**Date:** 2026-10-30  
**Day / Topic:** Backend API Development, Validation, and Error Handling

## Objective
Implement the service request API with proper validation, separate application layers, and consistent error handling.

## What I learned
- How API routes connect HTTP requests to controller functions.
- How controllers, services, and repositories have different responsibilities.
- How to validate incoming data using Zod.
- How to handle errors using centralized error-handling middleware.
- How HTTP status codes such as 200, 201, 400, and 404 are used in REST APIs.
- How to test backend endpoints independently using Postman.

## What I implemented
- Implemented the health check endpoint.
- Implemented the create request endpoint.
- Implemented the request list endpoint with an optional status filter.
- Implemented the get request by ID endpoint.
- Added server-side validation for request data.
- Added service and repository layers to separate business logic from data access.
- Added centralized error handling for validation errors, missing resources, and unexpected errors.
- Added consistent JSON error responses.

## How I tested it
- Tested the health check endpoint using Postman and verified the 200 response.
- Tested request creation and verified the 201 response.
- Tested retrieving all service requests.
- Tested filtering requests by status.
- Tested retrieving a service request using its ID.
- Tested invalid request details and verified the 400 validation error.
- Tested retrieving a request with a non-existent ID and verified the 404 response.
- Tested an invalid request ID and verified the 400 validation error.

## Evidence
Postman screenshots are saved in `evidence/Day-05/`.

- `01-health-200.png` — Health check successful.
- `02-createReq-201.png` — Create request successful.
- `03-viewReq-200.png` — View request successful.
- `04-SearchByOpen-200.png` — Search requests by status.
- `05-SearchByID-200.png` — Search request by ID.
- `06-invalidDetailsCheck-400.png` — Invalid request details.
- `07-WrongIDCheck-404.png` — Request not found.
- `08-validationCheck-400.png` — Invalid request ID validation.

## Problems encountered
- I needed to understand how to separate API logic into controllers, services, and repositories.
- I also needed to handle invalid inputs and missing requests consistently.

## How I fixed them
- Separated HTTP handling, business logic, and data access into different layers.
- Used Zod schemas to validate incoming request data.
- Added centralized error-handling middleware to return consistent JSON error responses.
- Used Postman to test successful requests and error scenarios.

## What I would improve
- Connect the API to PostgreSQL instead of using temporary in-memory storage.
- Add automated tests for API endpoints and error-handling scenarios.
- Improve API documentation as additional endpoints are implemented.

## GitHub branch
`feat/day-05-backend-api`

## Pull request


## Commit hash


## Blockers / questions for supervisor
None at the moment.
# Daily Evidence Record — Day 08

**Date:** 2026-11-04  
**Day / Topic:** Automated Testing, Debugging, Code Review, and Quality Assurance

## Objective

Set up automated testing with Vitest and Supertest, implement unit and integration test suites, diagnose and fix a payload size error handling bug using a regression test, refactor duplicated logic, and enforce code quality using ESLint and Prettier.

## What I learned

- **Unit vs. Integration Tests:** Unit tests isolate specific modules (like `requestService`) using mocks without database dependencies, while integration tests verify HTTP endpoints, validation pipelines, and error handlers together.
- **Test Fixtures & Determinism:** Using reproducible test fixtures (`makeRequest`) and resetting mocks before each test (`beforeEach(vi.resetAllMocks)`) prevents test bleed and ensures consistent results.
- **Parameterized Testing:** Utilizing `it.each` allows running comprehensive matrix tests (e.g., all 16 status transition combinations and multiple validation failure cases) cleanly.
- **Regression Testing:** Writing a test for a known bug *before* fixing it ensures the bug is caught and prevents future regressions.
- **Express Error Handling Mechanics:** Errors originated by Express middlewares (such as payload size limit errors with HTTP status `413`) carry status codes that must be handled separately from generic `500 Internal Server Errors`.
- **Code Refactoring with Safety:** Running test suites during refactoring provides immediate feedback, ensuring architectural improvements (e.g., centralized parsing helper, decoupling `Zod` from error classes) do not alter behavior.

## What I implemented

- **Testing Infrastructure:**
  - Installed `vitest`, `supertest`, and `@types/supertest`.
  - Configured `vitest.config.mts` with `node` environment and dummy `DATABASE_URL` to avoid real database connection initialization during test execution.
  - Added test scripts (`test`, `test:watch`, `format`, `format:check`) to `package.json`.

- **Shared Domain Constants:**
  - Updated `src/modules/requests/types.ts` to centralize `CATEGORIES`, `PRIORITIES`, and `STATUSES` array constants and derived TypeScript types.
  - Refactored `schema.ts` to consume central domain arrays for Zod enum validations.

- **Automated Test Suites:**
  - **Unit Tests (`tests/unit/requestService.test.ts`):** Mocked `requestRepository` using Vitest (`vi.mock`). Created matrix tests checking all 16 status transition scenarios (`OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`) to guarantee invalid transitions are rejected before touching the repository layer.
  - **Integration Tests (`tests/integration/requests.api.test.ts`):** Built end-to-end HTTP API tests using `supertest` for request creation, listing, retrieval by UUID, status updates, health checks, error shape compliance, and database disconnect behavior.
  - **Regression Test:** Added a test checking that payloads exceeding the size limit return `413 PAYLOAD_TOO_LARGE` instead of generic `500 INTERNAL_ERROR`.

- **Bug Fix & Error Handling Enhancement:**
  - Refactored `src/middleware/error-handler.ts` to include `getClientErrorStatus()` which inspects standard Express 4xx status properties and handles payload size errors correctly.

- **Code Review Refactoring:**
  - Created `src/validation.ts` with `parseOrThrow()` helper function to eliminate repetitive Zod validation logic in controllers.
  - Decoupled `Zod` dependencies from `src/errors.ts`.
  - Updated `src/modules/requests/controller.ts` to use `parseOrThrow()`.
  - Fixed explicit `this` binding reliance in `service.ts` by invoking methods explicitly on `requestService`.

- **Linting and Formatting Setup:**
  - Configured `eslint.config.mjs` with Node globals and TypeScript rules allowing unused variables starting with `_`.
  - Executed `prettier` and `eslint` checks across `src/`, `tests/`, and `scripts/`.

## How I tested it

- Ran `npm test` prior to the bug fix to capture expected failure (`44 passed`, `1 failed`: `expected 500 to be 413`). Saved log to `evidence/Day-08/test-output-before-fix.txt`.
- Ran `npm test` after modifying `error-handler.ts` to confirm all **45 tests passed**. Saved log to `evidence/Day-08/test-output.txt`.
- Verified status transition boundary enforcement across 16 matrix test permutations.
- Verified validation rejection on bad types, short/long titles, empty descriptions, unknown categories, and malformed UUID parameters.
- Executed quality commands:
  ```bash
  npm run format
  npm run lint
  npm run format:check
  npm run typecheck
  npm test
  ```
  All commands executed cleanly without errors.

## Evidence

Files and test outputs saved in `evidence/Day-08/`:
- `test-output-before-fix.txt` (Output showing the initial 413 vs 500 regression failure)
- `test-output.txt` (Output showing 45 passing tests)
- `bug-log.md` (Detailed bug report detailing issue, reproduction steps, root cause, and fix)
- `code-review-notes.md` (Notes on identified code duplication, boundaries, and refactoring steps)

## Problems encountered

- **Initial Regression Test Failure:** The API returned HTTP `500` instead of `413` when receiving an oversized body payload (`200,000` characters), because standard Express parsing errors were falling through to the generic internal error handler branch.
- **Repository Context Loss:** Direct reliance on `this.getRequestById` inside `updateStatus` could cause unhandled scope errors if method reference context changed.
- **Redundant Validation Duplication:** The controller contained identical `safeParse` error conversion blocks in 5 separate endpoints.

## How I fixed them

- **Express Client Error Handling:** Added inspection logic (`getClientErrorStatus`) inside `errorHandler` middleware to identify `4xx` status codes set by Express built-in parsing middlewares and format them into standard API JSON error shapes.
- **Refactored Controller Validation:** Encapsulated Zod parsing and `AppError(400, "VALIDATION_ERROR", ...)` mapping inside `parseOrThrow()` in `src/validation.ts`.
- **Method Calls Scope Fix:** Replaced `this.getRequestById(id)` call in `service.ts` with direct invocation `requestService.getRequestById(id)`.

## What I would improve

- Add real database integration test execution against a PostgreSQL container in CI/CD pipeline alongside unit/mocked integration suites.
- Address potential database race conditions when concurrent `PATCH /api/requests/:id/status` requests execute simultaneously.
- Consolidate status badge styling constants on the frontend to prevent duplicated label arrays.

## GitHub branch

`feat/day-08-tests`

## Pull request
https://github.com/nadeera365/Visionroot-Software-Engineering-Training/pull/9


## Commit hash
247bc35


## End-of-day review / Questions for supervisor

 Which automated test protects the most important business rule, and what failure would it catch?


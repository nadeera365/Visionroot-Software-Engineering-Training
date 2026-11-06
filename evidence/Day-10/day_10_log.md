# Daily Evidence Record: Day 10

**Date:** 2026-11-06\
**Day / topic:** Day 10, Final review, demo and handover\
**Objective:** Present a working MVP and explain its architecture, tests
and remaining risks.

## What I learned

-   A final review is not only about checking whether the application
    works. It also involves explaining the design decisions, test
    coverage, known limitations and possible next improvements.
-   Architecture decisions should explain why a particular approach was
    selected and what trade-offs came with it.
-   A useful demo should cover the requirements, architecture, one
    complete end-to-end workflow and the test results.
-   A training MVP is not automatically production-ready. Security,
    monitoring, backups, operational procedures and further testing may
    still be required.
-   A self-review helps identify what went well, what problems I faced
    and what I would improve next.

## What I completed

-   Reviewed the MVP and prepared the final Day 10 handover evidence.
-   Updated the README, architecture diagram, API contract and ADR-001.
-   Added ADR-002 to document the database access decision.
-   Fixed Prettier formatting issues in the backend workflow script and
    test files.
-   Prepared the demo notes, self-review and final test-results
    document.
-   Recorded the final test output in
    `evidence/Day-10/final-test-output.txt`.
-   Reviewed the known security limitations and documented the remaining
    risks in the project documentation.

## Files / folders changed

-   `README.md`
-   `docs/architecture.drawio`
-   `docs/api-contract.md`
-   `docs/decisions/ADR-001-architecture.md`
-   `docs/decisions/ADR-002-database-access.md`
-   `backend/scripts/workflow-test.mjs`
-   `backend/tests/integration/requests.api.test.ts`
-   `backend/tests/unit/requestService.test.ts`
-   `evidence/Day-10/`

## How I tested it

  -----------------------------------------------------------------------------------
  \#                Check                       Expected          Result
  ----------------- --------------------------- ----------------- -------------------
  1                 Backend unit and            All tests pass    **Pass --- 45 tests
                    integration tests                             passed across 2
                    (`npm test`)                                  test files**

  2                 Backend lint                No lint errors    **Pass**
                    (`npm run lint`)                              

  3                 Backend format check        All matched files **Pass**
                    (`npm run format:check`)    follow Prettier   
                                                style             

  4                 Backend type check          No type errors    **Pass**
                    (`npm run typecheck`)                         

  5                 End-to-end workflow         Request workflow  **Pass --- all 12
                    (`npm run test:workflow`)   and status        checks passed**
                                                transitions work  

  6                 Frontend lint               No lint errors    **Pass**
                    (`npm run lint`)                              

  7                 Frontend production build   Build completes   **Pass**
                    (`npm run build`)           successfully      

  8                 Backend dependency audit    No production     **Pass --- 0
                    (`npm audit --omit=dev`)    dependency        vulnerabilities**
                                                vulnerabilities   

  9                 Frontend dependency audit   No production     **Pass --- 0
                    (`npm audit --omit=dev`)    dependency        vulnerabilities**
                                                vulnerabilities   

  10                Manual API workflow         Create, list,     **Pass --- verified
                    verification                view and update a through the
                                                request           workflow test**
  -----------------------------------------------------------------------------------

## End-to-end workflow scenarios

The workflow test verified these 12 scenarios:

1.  Creating a request returns `201` and an `OPEN` status.
2.  Listing requests returns `200` and includes the created request.
3.  Viewing the request by ID returns `200` and the same request.
4.  An invalid `OPEN` to `CLOSED` transition is rejected with `400`.
5.  `OPEN` to `IN_PROGRESS` succeeds with `200`.
6.  An invalid backward transition from `IN_PROGRESS` to `OPEN` is
    rejected.
7.  `IN_PROGRESS` to `RESOLVED` succeeds.
8.  `RESOLVED` to `CLOSED` succeeds.
9.  A closed request cannot be changed again.
10. The final `CLOSED` status is saved in the database.
11. An unknown status value is rejected with `400`.
12. Updating a request that does not exist returns `404`.

## Evidence links

-   `evidence/Day-10/demo-note.md`
-   `evidence/Day-10/self-review.md`
-   `evidence/Day-10/final-test-results.md`
-   `evidence/Day-10/final-test-output.txt`

## Problem encountered

When I first ran the end-to-end workflow test, it failed with a
`fetch failed` / `ECONNREFUSED` error.

## How I investigated it

I checked the workflow test script and the backend server configuration.
I also tried the health-check endpoint to confirm whether the API was
responding.

## Root cause

The backend server was not running when I executed the workflow test. I
also initially tried `/health`, but the correct health-check endpoint is
`/api/health`.

## How I fixed it

I started the backend server in a separate terminal and checked the
correct endpoint:

``` powershell
Invoke-RestMethod http://localhost:4000/api/health
```

After confirming that the application and database were connected, I ran
`npm run test:workflow` again. All 12 workflow checks passed. No code
change was required to resolve this connection issue.

## What I would improve

-   Add authentication and role-based access control so only authorized
    users can perform restricted actions.
-   Configure a restricted database user for the running application.
-   Add rate limiting and ensure HTTPS is configured through the hosting
    platform or a reverse proxy.
-   Add automated frontend tests.
-   Perform load testing and penetration testing before considering
    production use.
-   Improve audit logging and database backup and rollback procedures.

## Known limitations

-   The MVP does not include authentication or authorization.
-   HTTPS must be provided by the hosting platform or a reverse proxy.
-   Rate limiting has not been implemented.
-   Automated frontend tests have not been implemented.
-   Load testing and penetration testing have not been performed.
-   Repository SQL is not covered by dedicated automated repository
    tests; it is exercised through the workflow and manual checks
    against a real database.
-   This is a training MVP and is not approved for production use.


## GitHub branch

`feat/day-10-final-review`

## Pull request



## Commit hash / release tag



## Blockers / questions for supervisor


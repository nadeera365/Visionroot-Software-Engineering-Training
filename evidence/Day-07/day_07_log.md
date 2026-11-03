# Daily Evidence Record — Day 07

**Date:** 2026-11-03

**Day / Topic:** Full-Stack Integration, API Communication, Status Management, and Integration Testing

## Objective

Connect the frontend, backend API, and PostgreSQL database to complete the full-stack request workflow. Implement request status updates with valid transition rules, handle API and network failures correctly, and verify the complete workflow using automated and manual testing.

## What I learned

- How the frontend communicates with the backend through asynchronous API calls using `async` and `await`.
- Why every API operation should handle loading, success, and error states.
- How errors are passed through different application layers, from the database and service layer to the controller and frontend.
- What CORS is and why browsers block API requests when the backend does not allow the frontend origin.
- Why Postman requests can work while the same API requests fail in the browser due to CORS restrictions.
- How browser preflight `OPTIONS` requests work for methods such as `PATCH`.
- How to debug integration issues using the browser Console and Network tab.
- What state transitions and business rules are, and why they should be enforced in the backend service layer.
- Why frontend button restrictions are not enough to protect API operations and why server-side validation is important.
- How to prevent false success messages by updating the UI only after receiving a successful server response.
- How to use `Suspense` with dynamic route parameters in Next.js 16 when using the `cacheComponents` setting.
- How automated workflow tests can verify communication between the frontend API, backend, and PostgreSQL database.

## What I implemented

- Connected the frontend request management pages to the real backend API instead of mock data.
- Updated the request service to support creating, listing, retrieving, and updating requests through the API client.
- Implemented the backend status update endpoint using `PATCH /api/requests/:id/status`.
- Added status validation using Zod.
- Implemented status transition rules in the service layer:
  - `OPEN → IN_PROGRESS`
  - `IN_PROGRESS → RESOLVED`
  - `RESOLVED → CLOSED`
- Added server-side validation to reject invalid status transitions and prevent changes after a request is closed.
- Updated the PostgreSQL repository to save status changes and update the `updated_at` timestamp.
- Added request details functionality to display individual request information.
- Added status update functionality to the request details page.
- Added appropriate loading, success, and error messages for frontend API operations.
- Removed the mock request data and connected the request list and details pages to the real API.
- Added CORS middleware and configured `FRONTEND_ORIGIN` to allow communication between the frontend and backend.
- Updated the Next.js dynamic request details page to use `Suspense` and resolved the frontend build issue.
- Added an automated workflow test script to verify the complete request management workflow.
- Updated the architecture documentation, API contract, and README with the new implementation details.

## How I tested it

- Tested the backend API against a real PostgreSQL database in the sandbox environment.
- Ran the backend workflow test script and verified that all 12 automated checks passed.
- Tested creating a new service request through the frontend.
- Checked that newly created requests appeared in the request list and remained available after refreshing the page.
- Tested opening individual request details using the request title.
- Tested all valid status transitions from `OPEN` to `CLOSED`.
- Tested invalid status transitions, including `OPEN → CLOSED` and backward status changes, and verified that the server rejected them.
- Tested that a closed request could not be updated again.
- Tested invalid status values and updates for non-existing requests.
- Performed 8 frontend UI checks against the real API, including request creation, listing, details, status updates, and network failure handling.
- Stopped the backend and tested frontend network failure handling to verify that false success messages were not displayed.
- Verified the CORS configuration and checked that the frontend could successfully communicate with the backend.
- Ran the frontend build and confirmed that the Next.js build completed successfully after adding `Suspense` to the dynamic request details page.

## Evidence

Screenshots, documentation, test outputs, and the workflow demonstration video are saved in `evidence/Day-07/`.

Evidence includes:

- `browser.png` – Frontend request list after fixing the integration issue.
- `console.png` – Browser Console after resolving the CORS error.
- `1_invalidRequestChange.png` – Evidence of an invalid request status change being rejected.
- `2-validRequestChange.png` – Evidence of a valid request status change being successfully completed.
- `integration-bug.md` – Documentation of the integration bug, diagnosis, root cause, and solution.
- `workflow-demo.mp4` – Screen recording demonstrating the complete request management workflow, including request creation, listing, viewing details, status updates, and error handling.
- `workflow-test-output.txt` – Backend automated workflow test results showing all 12 checks passed.

## Problems encountered

- The frontend initially displayed "Cannot reach the server" even though the backend was running.
- Postman requests returned `200 OK`, but browser requests were blocked because of a CORS error.
- The backend did not initially send the required `Access-Control-Allow-Origin` header for `http://localhost:3000`.
- The Next.js 16 production build initially failed on the `/requests/[id]` dynamic page because the `cacheComponents` configuration required `Suspense` around the asynchronous route parameter handling.

## How I fixed them

- Tested the backend API using Postman to confirm that the API and database were working.
- Used the browser Console and Network tab to identify the CORS issue.
- Installed and configured the CORS middleware in the backend.
- Added `FRONTEND_ORIGIN` to the backend environment configuration.
- Restarted the backend and verified that the frontend could successfully retrieve the request list.
- Updated the dynamic request details page to use `Suspense` around the component that handles the asynchronous route parameters.
- Rebuilt the frontend and confirmed that the build issue was resolved.

## What I would improve

- Add more automated frontend integration tests for different API failure scenarios.
- Improve error messages to make API and database problems easier to identify.
- Add more comprehensive tests for status transition rules.
- Improve logging and monitoring across the frontend and backend.
- Add additional integration tests to verify data consistency between the API and PostgreSQL database.

## GitHub branch

`feat/day-07-integration`

## Pull request

https://github.com/nadeera365/Visionroot-Software-Engineering-Training/pull/7

## Commit hash
19fd61c

## Blockers / questions for supervisor

- Confirm whether the current request status transition rules match the expected MVP workflow.
- Confirm whether additional integration or automated frontend tests are required.
- Confirm whether the current CORS configuration is sufficient for the expected deployment environments.
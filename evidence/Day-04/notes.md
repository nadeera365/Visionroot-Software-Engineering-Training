# Day 04 — Frontend Architecture and UI

## Objective
Create a usable interface with clear component boundaries and states.

## What I implemented
- Created TypeScript types for service requests.
- Added a central API client to handle API requests and errors.
- Created a request service module to separate data logic from UI components.
- Added mock request data to test the frontend without a running backend.
- Added frontend environment variables for API configuration.
- Created the main layout and navigation for the service request pages.

## Frontend structure
- `features/requests/` — Request-related types, components, and services.
- `services/` — Shared API client.
- `app/` — Next.js pages and layout.

## Validation and UI states
- Loading, empty, success, and error states should be checked during testing.
- Form validation should provide clear messages for invalid or missing input.
- Labels should be available for form fields.

## Testing
- TypeScript type check: TODO
- ESLint: TODO
- Frontend manual testing: TODO

## Limitations
- Mock data is used while the backend integration is not ready.
- API integration must be verified when the backend endpoints are available.

## Future improvements
- Improve accessibility and form feedback.
- Add automated tests for the request form and request list.
# Daily Evidence Record — Day 04

**Date:** 2026-10-29  
**Day / Topic:** Frontend Architecture and UI

## Objective
Create a usable frontend with clear component boundaries and states.

## What I learned
- How to organize pages and reusable components in Next.js.
- How TypeScript interfaces describe request data.
- Why API calls should be separated from UI components.
- How loading, empty, success, and error states improve user experience.
- Why forms need clear validation messages and accessible labels.

## What I implemented
- Frontend request types and service modules.
- A shared API client.
- Mock data for frontend testing.
- Main layout and navigation.

## How I tested it

- Ran the frontend using the Next.js development server and checked the pages in the browser.
- Ran TypeScript type checking using `npx tsc --noEmit`.
- Ran ESLint using `npm run lint`.
- Tested the request form with valid and invalid inputs.
- Checked the loading, empty, success, and error states.
- Verified that mock requests could be created and displayed without connecting to the backend.
- Checked that environment variables were configured correctly and that no real `.env` files were committed to Git.

## Evidence
- Request list screenshot: `evidence/Day-04/01-request-list.png`
- Create request screenshot: `evidence/Day-04/02-create-request.png`
- Validation screenshot: `evidence/Day-04/03-validation.png`
- Empty state screenshot: `evidence/Day-04/04-empty-state.png`


## Problems encountered

- Next.js was new to me, so I needed time to understand its project structure, routing, and how to organize components.

## How I fixed them

- I learned the basics of Next.js by following the setup instructions and practising how to create pages, layouts, and reusable components.

## What I would improve
- I would improve the frontend accessibility and add automated tests for the request form and request list.

## GitHub branch
`feat/day-04-frontend-ui`

## Pull request
https://github.com/nadeera365/Visionroot-Software-Engineering-Training/pull/4

## Commit hash
e81b46b07dd6311d30392ab2082ecf1e8622b3bc

## Blockers / questions for supervisor
None, unless a real blocker needs to be reported.
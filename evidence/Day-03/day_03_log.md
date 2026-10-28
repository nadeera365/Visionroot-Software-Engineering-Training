# Daily Evidence Record: Day 03

Date: 2026-10-28
Day / topic: Day 03, GitHub workflow and environment setup
Objective: Make the project reproducible and establish a professional contribution workflow.

## What I learned
- Feature branch workflow: create a branch, make small commits, open a pull request, get review, then merge into main.
- Dependencies are tracked in package.json and package-lock.json. node_modules is never committed.
- Environment variables keep configuration and secrets out of the code. The real .env file is ignored by Git, and .env.example has placeholder values only.
- ESLint finds code problems and Prettier formats code.
- A README should let a new developer run the project without extra help.

## What I implemented
- Backend scaffold (Express.js, TypeScript, scripts, environment config).
- Frontend scaffold (Next.js).
- Root .gitignore, backend and frontend .env.example files.
- README with the repository URL, default branch and setup steps.

## Files / folders changed
- README.md
- .gitignore
- backend/
- frontend/
- evidence/Day-03/day_03_log.md

## How I tested it
- Ran the backend and the frontend by following the README steps.
- Ran typecheck, build and lint.
- Cloned the repository into a new folder and followed the README.
- Checked with git ls-files that no real .env file is committed.

## Problem encountered
- I was not familiar with TypeScript when setting up the backend and frontend.

## How I investigated it
- I learned the basic concepts of TypeScript and how it works with JavaScript while setting up the project.

## Root cause
- I had not used TypeScript much before, so I needed to understand its basic syntax and type definitions.

## How I fixed it
- I studied the basic TypeScript concepts and followed the setup instructions to understand how TypeScript is configured and used in the project.

## What I would improve
- I would practise TypeScript more by writing small examples and using types properly in my future projects.

## GitHub branch
chore/day-03-environment-setup

## Pull request


## Commit hash


## Blockers / questions for supervisor
- None

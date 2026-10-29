# Visionroot-Software-Engineering-Training# Service Request Management System

A small internal web app where users submit and track service requests.
Built during the VisionRoot trainee software engineer program.

## Repository

- Repository URL: https://github.com/nadeera365/Visionroot-Software-Engineering-Training
- Default branch: `main`

## Tech stack

- Frontend: Next.js
- Backend: Express.js with TypeScript
- Database: PostgreSQL

## Prerequisites

- Node.js 20 or newer
- npm
- Git
- PostgreSQL (needed from the database step onwards)

## Getting started

1. Clone the repository

   ```
   git clone https://github.com/nadeera365/Visionroot-Software-Engineering-Training.git
   cd Visionroot-Software-Engineering-Training
   ```

2. Run the backend

   ```
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

   The backend should print `Backend running on port 4000`.

3. ## Frontend Setup

   ### Prerequisites
   - Node.js
   - npm
   
   ### Install dependencies
   
   ```bash
   cd frontend
   npm install
   ```
   
   ### Configure environment variables
   
   Create a local `.env.local` file using `.env.example` as a reference.
   
   On Windows PowerShell:
   
   ```powershell
   Copy-Item .env.example .env.local
   ```
   
   Make sure `NEXT_PUBLIC_API_URL` points to the correct local API URL. Set `NEXT_PUBLIC_USE_MOCK=true` if you want to use mock request data.
   
   Do not commit `.env.local` or real credentials.
   
   ### Run the frontend
   
   ```bash
   npm run dev
   ```
   
   Open `http://localhost:3000` in your browser.
   
   ### Run checks
   
   ```bash
   npx tsc --noEmit
   npm run lint
   npm run build
```

## Scripts

| Folder | Command | Purpose |
|---|---|---|
| backend | `npm run dev` | Start in development mode |
| backend | `npm run build` | Compile TypeScript |
| backend | `npm start` | Run the compiled build |
| backend | `npm run typecheck` | Check types only |
| backend | `npm run lint` | Run ESLint |
| backend | `npm run format` | Format code with Prettier |
| frontend | `npm run dev` | Start in development mode |
| frontend | `npm run build` | Production build |
| frontend | `npm run lint` | Run ESLint |

## Folder structure

- `backend/`: Express.js API (TypeScript)
- `frontend/`: Next.js app
- `docs/`: requirements, architecture, data model, API contract, decisions
- `evidence/`: daily logs and evidence, one folder per day (`Day-01`, `Day-02`, ...)

## Git workflow

- Do not commit directly to `main`.
- Create a feature branch for each task (for example `chore/day-03-environment-setup`).
- Use small, clear commit messages (`docs: ...`, `chore: ...`, `feat: ...`).
- Open a pull request, describe what changed and how it was tested, then merge it after review.

## Documentation

- [Requirements](docs/requirements.md)
- [Data model](docs/data-model.md)
- [API contract](docs/api-contract.md)
- [ADR-001: Architecture](docs/decisions/ADR-001-architecture.md)

## Security

Never commit `.env` files, passwords, API keys or tokens. Use `.env.example` files with placeholder values only.

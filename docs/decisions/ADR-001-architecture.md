# ADR-001: Use a Modular Monolith with a Layered Backend

**Status:** Proposed

## Context

We need to build a small Service Request Management System within 10 days. The system needs a frontend, a backend API, business rules for handling request statuses, and a database. Since only one trainee is working on the project. the architecture should be simple and easy to manage.

## Decision

We decided to use a modular monolith architecture with a layered backend.

- **Frontend:** Next.js
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL

The backend will be organized into three main layers: controllers, services, and repositories. Each layer will have a separate responsibility, making the code easier to understand, test and maintain.

## Alternatives Considered

**1. Microservices**

Microservices would make the system more complex to develop and deploy. They also introduce challenges such as network failures and data consistency. This approach is unnecessary for a small project with a short development timeline.

**2. Next.js API Routes Only**

Using Next.js API routes would be simpler initially. However keeping the frontend and all backend logic in the same application could make the project structure less clear. A separate Express.js backend makes the layers easier to demonstrate and test.

**3. NoSQL Database**

A NoSQL database offers flexibility but our service request data has a defined structure and needs data constraints. PostgreSQL is a suitable choice for storing this structured data.

## Consequences

**Benefits**
- Simple to develop and deploy.
- Easier to test and debug.
- Clear separation of responsibilities in the backend.
- Suitable for a small project with one developer.

**Limitations**
- The backend scales as a single application.
- Poor separation of responsibilities could cause the layers to become mixed.
- If the application grows significantly, the architecture may need to be reviewed.

## Review Trigger

We will review this decision if the system grows significantly, requires separate development teams or needs different parts of the backend to scale independently.
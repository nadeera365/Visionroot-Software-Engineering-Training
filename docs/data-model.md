# Data Model — Service Request Management System

**Day:** 02 — Architecture and System Design. 
**Database:** PostgreSQL.  
**Scope:** MVP only.

## 1. Overview

The MVP stores service requests in one database table: `requests`. The application does not implement login, accounts, or role-based access yet. Therefore, `Requester` and `Support Staff` describe how people use the application; they are not database tables in this MVP.

No `requesters`, or `service_staff` tables and no requester/staff foreign keys are required at this stage. If authentication, ownership, or staff assignment is introduced in a future version so the data model can be extended then.

## 2. Request entity

A **Request** represents an issue submitted to the service request system.

| Field | PostgreSQL type | Required | Default | Rules / purpose |
|---|---|---:|---|---|
| `id` | `UUID` | Yes | `gen_random_uuid()` | Primary key; unique request identifier |
| `title` | `VARCHAR(100)` | Yes | — | Trimmed length must be 3–100 characters |
| `description` | `TEXT` | Yes | — | Trimmed length must be 1–1000 characters |
| `category` | `VARCHAR(20)` | Yes | — | One of `IT`, `Facilities`, `Other` |
| `priority` | `VARCHAR(10)` | Yes | `MEDIUM` | One of `LOW`, `MEDIUM`, `HIGH` |
| `status` | `VARCHAR(20)` | Yes | `OPEN` | One of `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `created_at` | `TIMESTAMPTZ` | Yes | `now()` | Time the request was created; server/database controlled |
| `updated_at` | `TIMESTAMPTZ` | Yes | `now()` | Time the request was last updated; refresh on update |

## 3. Database relationships

The MVP has **one persisted entity/table**, so there are no foreign-key relationships yet.

- **Requester (conceptual actor):** submits a request and checks its status.
- **Request (database entity):** stores the submitted issue and current status.
- **Support Staff (conceptual actor):** views requests, filters by status, and updates request status.

These are application interactions, not database relationships. The system does not currently store who submitted a request or which staff member handled it because login, roles, and staff assignment are outside the MVP scope.

See `ERD.drawio` for the editable diagram.

## 4. Constraints and indexes

### Constraints

- `id` is the primary key.
- All listed columns are `NOT NULL`.
- `title` length must be 3–100 characters after trimming.
- `description` length must be 1–1000 characters after trimming.
- `category` must be `IT`, `Facilities`, or `Other`.
- `priority` must be `LOW`, `MEDIUM`, or `HIGH`.
- `status` must be `OPEN`, `IN_PROGRESS`, `RESOLVED`, or `CLOSED`.
- New requests start with `OPEN` status.
- The service layer enforces the allowed status transition sequence; a database `CHECK` constraint only validates the allowed status values.

### Indexes

| Index | Column(s) | Reason |
|---|---|---|
| Primary key index | `id` | Efficient request detail lookup |
| `idx_requests_status` | `status` | Efficient status filtering |
| `idx_requests_created_at` | `created_at` | Efficient newest-first listing |

## 5. Status workflow

The status can move forward one step at a time only:

`OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`

`CLOSED` is final. For example, changing `OPEN` directly to `CLOSED`, moving backwards, or changing a closed request must be rejected with HTTP `400 Bad Request`.

## 6. Reference SQL

This SQL describes the intended schema; the actual migration can be created during the implementation phase.

```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL
        CHECK (category IN ('IT', 'Facilities', 'Other')),
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM'
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (char_length(trim(title)) BETWEEN 3 AND 100),
    CHECK (char_length(trim(description)) BETWEEN 1 AND 1000)
);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
```

The application should update `updated_at` whenever a request changes. Status-transition validation belongs in the service/business-logic layer because it depends on both the current status and the requested next status.

## 7. Design trade-off and known risk

**Trade-off:** Keeping one table makes the MVP simpler and avoids designing authentication and assignment features before they are required.

**Known risk:** Because the MVP has no login and does not record requester/staff identities, it cannot prove who submitted or changed a request. This is acceptable for the agreed MVP but should be revisited before real organizational use.

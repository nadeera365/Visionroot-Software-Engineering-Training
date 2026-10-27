# API Contract — Service Request Management System

**Day:** 02 — Architecture and System Design  
**Base path:** `/api`  
**Content type:** `application/json`  
**Scope:** MVP only

## 1. General rules

- All request and response bodies use JSON unless the endpoint has no body.
- No authentication or role headers are required in the MVP because login and roles are future features.
- The backend must validate all client input. Frontend validation is for usability only and does not replace server-side validation.
- New requests receive `status: "OPEN"` from the server. Clients cannot choose the initial status when creating a request.
- The status workflow is `OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`; only the next step is allowed.
- Category values are `IT`, `Facilities`, and `Other`.
- Priority values are `LOW`, `MEDIUM`, and `HIGH`.
- Status values are `OPEN`, `IN_PROGRESS`, `RESOLVED`, and `CLOSED`.
- This MVP does not include user accounts, role-based access, comments, notifications, file attachments, keyword search, or staff assignment.

## 2. Endpoint summary

| Method | Path | Purpose | Success response |
|---|---|---|---|
| `GET` | `/api/health` | Check application and database health | `200 OK` |
| `POST` | `/api/requests` | Create a request | `201 Created` |
| `GET` | `/api/requests` | List requests; optionally filter by status | `200 OK` |
| `GET` | `/api/requests/:id` | Get one request by ID | `200 OK` |
| `PATCH` | `/api/requests/:id/status` | Move a request to its next status | `200 OK` |

## 3. Health check

### `GET /api/health`

Checks whether the API is running and the database is reachable.

**Response — `200 OK`**

```json
{
  "status": "ok",
  "database": "connected"
}
```

If the API is running but the database is unavailable, return `503 Service Unavailable` with the standard error shape below. Do not expose database credentials or internal connection details.

## 4. Create a request

### `POST /api/requests`

**Request body**

```json
{
  "title": "Laptop cannot connect to Wi-Fi",
  "description": "The office laptop cannot connect to the staff Wi-Fi network.",
  "category": "IT",
  "priority": "HIGH"
}
```

Rules:

- `title`: required string, 3–100 characters after trimming.
- `description`: required string, 1–1000 characters after trimming.
- `category`: required; one of `IT`, `Facilities`, `Other`.
- `priority`: optional; defaults to `MEDIUM` if omitted. If supplied, it must be `LOW`, `MEDIUM`, or `HIGH`.
- `status`, `id`, `created_at`, and `updated_at` are server/database controlled and must not be accepted from the client for creation.

**Response — `201 Created`**

```json
{
  "data": {
    "id": "8f2a3c1e-6b5d-4a70-9a2d-1c3e5f7a9b11",
    "title": "Laptop cannot connect to Wi-Fi",
    "description": "The office laptop cannot connect to the staff Wi-Fi network.",
    "category": "IT",
    "priority": "HIGH",
    "status": "OPEN",
    "created_at": "2026-10-27T10:30:00.000Z",
    "updated_at": "2026-10-27T10:30:00.000Z"
  }
}
```

The ID and timestamps above are illustrative examples.

## 5. List and filter requests

### `GET /api/requests`

Returns requests ordered newest first.

Optional query parameter:

- `status`: filters by one allowed status value, e.g. `GET /api/requests?status=OPEN`.

**Response — `200 OK`**

```json
{
  "data": [
    {
      "id": "8f2a3c1e-6b5d-4a70-9a2d-1c3e5f7a9b11",
      "title": "Laptop cannot connect to Wi-Fi",
      "description": "The office laptop cannot connect to the staff Wi-Fi network.",
      "category": "IT",
      "priority": "HIGH",
      "status": "OPEN",
      "created_at": "2026-10-27T10:30:00.000Z",
      "updated_at": "2026-10-27T10:30:00.000Z"
    }
  ],
  "meta": {
    "count": 1
  }
}
```

When there are no matching requests, return `200 OK` with `"data": []` and `"count": 0`. If `status` is supplied but is not a supported value, return `400 Bad Request`.

## 6. Get request details

### `GET /api/requests/:id`

Returns one request using its UUID.

**Response — `200 OK`**

```json
{
  "data": {
    "id": "8f2a3c1e-6b5d-4a70-9a2d-1c3e5f7a9b11",
    "title": "Laptop cannot connect to Wi-Fi",
    "description": "The office laptop cannot connect to the staff Wi-Fi network.",
    "category": "IT",
    "priority": "HIGH",
    "status": "OPEN",
    "created_at": "2026-10-27T10:30:00.000Z",
    "updated_at": "2026-10-27T10:30:00.000Z"
  }
}
```

- Malformed UUID: `400 Bad Request`.
- Well-formed UUID that does not match a request: `404 Not Found`.

## 7. Update request status

### `PATCH /api/requests/:id/status`

Moves a request to the next status in the workflow.

**Request body**

```json
{
  "status": "IN_PROGRESS"
}
```

Allowed transitions:

| Current status | Allowed next status |
|---|---|
| `OPEN` | `IN_PROGRESS` |
| `IN_PROGRESS` | `RESOLVED` |
| `RESOLVED` | `CLOSED` |
| `CLOSED` | None; final status |

**Response — `200 OK`**

```json
{
  "data": {
    "id": "8f2a3c1e-6b5d-4a70-9a2d-1c3e5f7a9b11",
    "title": "Laptop cannot connect to Wi-Fi",
    "description": "The office laptop cannot connect to the staff Wi-Fi network.",
    "category": "IT",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "created_at": "2026-10-27T10:30:00.000Z",
    "updated_at": "2026-10-27T10:45:00.000Z"
  }
}
```

Return `400 Bad Request` if the status value is invalid or the transition is not the next allowed step. Return `404 Not Found` if the request does not exist. The service layer must check the current status and enforce the transition rule before saving.

## 8. Consistent error response

All API errors should use this structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "title",
        "message": "Title must be between 3 and 100 characters."
      }
    ]
  }
}
```

`details` may be an empty array or omitted when field-level details do not apply. Never return stack traces, SQL statements, secrets, or private implementation details to clients.

## 9. Status codes

| HTTP status | When to use it |
|---|---|
| `200 OK` | Successful read or status update |
| `201 Created` | Request created successfully |
| `400 Bad Request` | Invalid input, malformed UUID, unsupported filter value, or invalid status transition |
| `404 Not Found` | Request ID is valid in format but no matching request exists |
| `500 Internal Server Error` | Unexpected server error; use a safe generic message |
| `503 Service Unavailable` | Health check detects that the database is unavailable |

## 10. Implementation responsibilities

- **Route/controller:** map HTTP requests to the correct use case and return HTTP status codes and response bodies.
- **Validation:** validate request bodies, query parameters, and ID format on the server.
- **Service layer:** enforce status transitions and other business rules.
- **Repository/data-access layer:** read and write PostgreSQL records.
- **Database:** enforce primary-key, required-field, enum-like value, and length constraints as a final data-integrity safeguard.

This contract describes the MVP agreed for Day 01. Login, roles, comments, notifications, attachments, keyword search, pagination, and staff assignment are intentionally excluded for now.

## Data flow: update a request status (Day 07)

1. The user clicks "Move to In progress" on the details page (RequestDetails).
2. The frontend calls updateRequestStatus() in requestsService, which uses apiClient to send PATCH /api/requests/{id}/status with { "status": "IN_PROGRESS" }.
3. The browser first sends a CORS preflight (OPTIONS). The backend cors middleware allows the frontend origin.
4. The controller validates the id and the body with the schema.
5. The service loads the request and checks the business rule: only the next step is allowed (OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED). If not, it throws INVALID_STATUS_TRANSITION (400). If the request does not exist, it throws NOT_FOUND (404).
6. The repository runs UPDATE requests SET status = $1, updated_at = now() WHERE id = $2 RETURNING *.
7. PostgreSQL saves the row. The repository, the service and the controller pass it back, and the controller sends 200 with { data }.
8. The frontend updates the screen only after this 200 response. On any error (400, 404, 500 or a network failure) it keeps the old status and shows the error message.
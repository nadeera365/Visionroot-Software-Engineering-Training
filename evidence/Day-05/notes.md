# Day 05 Notes

## How the layers differ

| Layer | File | What it does | What it does not do |
|---|---|---|---|
| Controller | controller.ts | Reads the HTTP request, validates input with the schema, calls the service, sends the status code and JSON | Business rules, storage |
| Service | service.ts | Business rules (new requests start as OPEN, a missing request is an error) | Anything about HTTP |
| Repository | repository.ts | Saves and reads data (in memory for now, PostgreSQL on Day 06) | Business rules, HTTP |

## End-of-day review
- The API can be tested without the frontend. I used Postman.
- Errors are consistent: every error uses { error: { code, message, details } }.
- Errors are safe: unexpected errors return a generic message, and the details are only logged on the server.
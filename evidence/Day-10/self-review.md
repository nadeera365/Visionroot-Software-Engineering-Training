# Self-review (Day 10)

## One decision

I decided to separate the backend into controller, service, and repository layers instead of writing all the logic in one place.

I chose this approach because it makes the code easier to understand, maintain, and test. Each layer has its own responsibility. For example, I could test the service logic using a fake repository without connecting to the actual database.

One trade-off is that I need to manage communication between two separate applications, including CORS configuration. This decision is documented in ADR-001.

## One bug

On Day 07, I faced a CORS issue when opening the requests list page. The frontend displayed "Cannot reach the server", even though the backend was running.

First, I tested the `GET /api/requests` endpoint using Postman, and it returned `200 OK`. This helped me confirm that the backend API and database were working.

Then I checked the browser Console and found that the browser was blocking the request because the backend did not allow the frontend origin `http://localhost:3000`.

To fix this, I added CORS middleware to the backend and configured the `FRONTEND_ORIGIN` environment variable. After restarting the backend and reloading the frontend, the requests list loaded successfully and the CORS error was gone.

## One improvement

If I continue developing this project, I would add authentication and role-based access control.

Currently, there is no login system, so anyone who can reach the API may be able to perform actions such as changing a request status.

I would improve this by adding user accounts, password hashing, authentication middleware, and role-based permissions. I would also add a `created_by` field to identify which user submitted each request.

## Known limitations

- There is no authentication or role-based access control.
- HTTPS is not configured directly in the application. It should be provided through the hosting platform or a reverse proxy.
- There is no rate limiting to protect the API from excessive requests.
- The local database user has administrator privileges. A restricted database user should be configured for production.
- There is no complete audit trail to track every change made to a request.
- Concurrent status updates may cause conflicts if two users update the same request at the same time.
- Database backups and rollback procedures are currently manual.
- Automated frontend tests have not been implemented.
- Load testing and penetration testing have not been performed.
- This is a training MVP and requires further security and operational improvements before production use.
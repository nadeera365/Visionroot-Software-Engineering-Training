# Day 07 – Integration Bug Fix (CORS)

## What Happened
When I opened the requests list page, it showed **"Cannot reach the server"**, even though the backend was running.

## How I Diagnosed It
1. First, I tested `GET /api/requests` using Postman. It returned `200 OK`, so the backend API and database were working correctly.
2. Then I checked the browser Console and found this CORS error:

   `Access to fetch at 'http://localhost:5000/api/requests' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

3. I also checked the Network tab and found that the browser was blocking the API request.

## Root Cause
The backend was not allowing requests from the frontend origin `http://localhost:3000`. Because of this, the browser blocked the API response due to CORS policy.

## Fix
I added the CORS middleware in the backend and configured `FRONTEND_ORIGIN` to allow requests from the frontend.

## How I Checked the Fix
1. Restarted the backend and reloaded the frontend.
2. The requests list loaded successfully.
3. Checked the browser Console again and confirmed there were no CORS errors.

## Evidence
The following screenshots are included in the `evidence/Day-07/` folder:

- `browser.png` – Shows the requests list loading successfully after the fix.
- `console.png` – Shows the browser Console after fixing the CORS issue.
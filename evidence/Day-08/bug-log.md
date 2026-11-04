# Bug log (Day 08)

## Bug 1: An oversized request body returned 500 instead of 413

### Issue
When a client sent a request body that was too large (over the 100 KB default limit of express.json), the API answered with
500 INTERNAL_ERROR ("Something went wrong."). A 500 means "the server broke", but here the client sent too much data.
The correct answer is 413 (Payload Too Large).

### How I found it
I wrote the regression test below before fixing anything. It failed:
`AssertionError: expected 500 to be 413`
The output is saved in evidence/Day-08/test-output-before-fix.txt.

### How to reproduce
 run `npm test`. The test "a request body that is too large returns 413 PAYLOAD_TOO_LARGE, not 500" fails.

### Root cause
The error handler in `src/middleware/error-handler.ts` only knew two kinds of errors: our own AppError and an invalid JSON SyntaxError.
The "body too large" error is created by Express itself. It already carries `status = 413`, but our handler did not look at that, so it
fell into the last branch, which answers 500 for every unknown error.

### Fix
The error handler now also checks for errors that carry their own 4xx status. For 413 it returns
`{ error: { code: "PAYLOAD_TOO_LARGE", message: "Request body is too large.", details: [] } }`.
Other 4xx errors return code BAD_REQUEST. Unexpected errors still return 500 with a safe message.

### Regression test
`tests/integration/requests.api.test.ts` > "regression tests" > "a request body that is too large returns 413 PAYLOAD_TOO_LARGE, not 500".
If someone breaks this behaviour again, the test fails.

### Result after the fix
`npm test` passes. The output is saved in evidence/Day-08/test-output.txt.
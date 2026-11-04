# Code review notes (Day 08)

I reviewed the backend and the frontend for duplicated logic and unclear boundaries.

## Found and fixed

| # | Problem | Why it is a problem | Fix |
|---|---|---|---|
| 1 | The allowed categories, priorities and statuses were written again in types.ts, in three places in schema.ts, and in the service | If one list changes, the others can be forgotten | Backend: the lists are defined once in `types.ts` (CATEGORIES, PRIORITIES, STATUSES). The types and the schemas use them |
| 2 | The same block "safeParse, then throw a validation error" was copied five times in the controllers | Long and easy to get wrong | One helper, `parseOrThrow`, in `src/validation.ts` |
| 3 | `errors.ts` imported zod, so the error classes depended on the validation library | Unclear boundary: error classes should not know about validation | The zod code moved to `validation.ts`. `errors.ts` has no dependencies |
| 4 | `service.updateStatus` called `this.getRequestById` | `this` is lost if the method is passed around without its object, and then the call breaks | It now calls `requestService.getRequestById` |
| 5 | Frontend: the status order was written in `statusFlow.ts`, and the status labels were written again in `StatusBadge.tsx` | Duplicated | `statusFlow.ts` is the only place for the order and the labels. `StatusBadge` and `StatusStepper` use it |

## Found, not fixed (and why)

| # | Observation | Decision |
|---|---|---|
| 1 | The transition rule exists in the backend service and in the frontend `statusFlow.ts` | Intentional. The frontend copy only decides which button to show. The server is the real protection (it is tested) |
| 2 | `updateStatus` reads the request and then updates it. Two users at the same time could both pass the check | Known limitation. A later improvement is a conditional update: `UPDATE ... WHERE id = $1 AND status = $current` |
| 3 | The category and priority lists are also written in the frontend form and in `validation.ts` | Small and low risk for the MVP. Can be shared later |
| 4 | The tests are not included in `npm run typecheck` because tsconfig only includes `src` | Vitest still runs them. A separate tsconfig for tests can be added later |

## Responsibilities after the review
- Controller: HTTP only (reads the request, calls `parseOrThrow`, calls the service, sends the response).
- Service: business rules and status transitions. No HTTP.
- Repository: SQL only.
- validation.ts: turns schema errors into one error shape.
- error-handler.ts: turns every error into the same JSON.
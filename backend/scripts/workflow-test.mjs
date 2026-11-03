const BASE_URL = process.env.API_URL ?? "http://localhost:4000/api";

let failed = 0;

function check(name, passed, details = "") {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${passed ? "" : `  -> ${details}`}`);
  if (!passed) failed += 1;
}

async function call(method, path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, body: await response.json() };
}

const unknownId = "8f2a3c1e-6b5d-4a70-9a2d-1c3e5f7a9b11";

// 1. Create
const created = await call("POST", "/requests", {
  title: "Workflow test request",
  description: "Created by the workflow test script",
  category: "IT",
  priority: "HIGH",
});
check("create returns 201 and status OPEN", created.status === 201 && created.body.data?.status === "OPEN", JSON.stringify(created.body));
const id = created.body.data?.id;

// 2. List
const list = await call("GET", "/requests");
check("list returns 200 and contains the new request", list.status === 200 && list.body.data?.some((r) => r.id === id));

// 3. Details
const details = await call("GET", `/requests/${id}`);
check("details returns 200 and the same request", details.status === 200 && details.body.data?.id === id);

// 4. Update status: only the next step is allowed
const skip = await call("PATCH", `/requests/${id}/status`, { status: "CLOSED" });
check("OPEN -> CLOSED is rejected (400 INVALID_STATUS_TRANSITION)", skip.status === 400 && skip.body.error?.code === "INVALID_STATUS_TRANSITION", JSON.stringify(skip.body));

const step1 = await call("PATCH", `/requests/${id}/status`, { status: "IN_PROGRESS" });
check("OPEN -> IN_PROGRESS works (200)", step1.status === 200 && step1.body.data?.status === "IN_PROGRESS", JSON.stringify(step1.body));

const back = await call("PATCH", `/requests/${id}/status`, { status: "OPEN" });
check("IN_PROGRESS -> OPEN (backwards) is rejected (400)", back.status === 400 && back.body.error?.code === "INVALID_STATUS_TRANSITION", JSON.stringify(back.body));

const step2 = await call("PATCH", `/requests/${id}/status`, { status: "RESOLVED" });
check("IN_PROGRESS -> RESOLVED works (200)", step2.status === 200 && step2.body.data?.status === "RESOLVED", JSON.stringify(step2.body));

const step3 = await call("PATCH", `/requests/${id}/status`, { status: "CLOSED" });
check("RESOLVED -> CLOSED works (200)", step3.status === 200 && step3.body.data?.status === "CLOSED", JSON.stringify(step3.body));

const final = await call("PATCH", `/requests/${id}/status`, { status: "IN_PROGRESS" });
check("CLOSED is final: any change is rejected (400)", final.status === 400, JSON.stringify(final.body));

// 5. The change is really saved
const saved = await call("GET", `/requests/${id}`);
check("status CLOSED is saved in the database", saved.body.data?.status === "CLOSED");

// 6. Bad input and missing records
const invalidStatus = await call("PATCH", `/requests/${id}/status`, { status: "DONE" });
check("unknown status value is rejected (400 VALIDATION_ERROR)", invalidStatus.status === 400 && invalidStatus.body.error?.code === "VALIDATION_ERROR");

const missing = await call("PATCH", `/requests/${unknownId}/status`, { status: "IN_PROGRESS" });
check("status update on a missing request returns 404", missing.status === 404 && missing.body.error?.code === "NOT_FOUND");

console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
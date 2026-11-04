import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // A fake value, so importing the app never needs a real database.
    env: { DATABASE_URL: "postgresql://test:test@localhost:5432/test" },
  },
});

import "dotenv/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

// In production, FRONTEND_ORIGIN must be explicitly configured.
if (nodeEnv === "production" && !process.env.FRONTEND_ORIGIN) {
  throw new Error(
    "FRONTEND_ORIGIN is not set. It is required when NODE_ENV=production.",
  );
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
};

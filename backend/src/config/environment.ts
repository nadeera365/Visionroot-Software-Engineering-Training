import "dotenv/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

// Production requires a database connection string.
if (nodeEnv === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Production also requires an explicitly configured frontend origin.
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

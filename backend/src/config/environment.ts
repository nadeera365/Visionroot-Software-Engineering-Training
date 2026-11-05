import "dotenv/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

if (nodeEnv === "production" && !process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is required in production.");
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
};

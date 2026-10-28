import "dotenv/config";

const portValue = Number(process.env.PORT ?? 5000);

if (
  !Number.isInteger(portValue) ||
  portValue < 1 ||
  portValue > 65535
) {
  throw new Error("PORT must be a valid port number.");
}

const nodeEnv = process.env.NODE_ENV ?? "development";

if (!["development", "production", "test"].includes(nodeEnv)) {
  throw new Error("NODE_ENV must be development, production, or test.");
}

export const env = {
  port: portValue,
  nodeEnv,
};
import { app } from "./app.js";
import { env } from "./config/environment.js";
import { log } from "./logger.js";

app.listen(env.port, (error?: Error) => {
  if (error) {
    log("error", "Could not start the server", { error: error.message });
    process.exit(1);
  }
  log("info", "Server started", { port: env.port, nodeEnv: env.nodeEnv });
});

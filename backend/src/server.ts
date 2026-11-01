import {app} from "./app.js";
import { env } from "./config/environment.js";

app.listen(env.port, (error?: Error) => {
  if (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
  console.log(`Backend running on port ${env.port}`);
});
import app from "./app.js";
import { env } from "./config/environment.js";

app.listen(env.port, () => {
  console.log(
    `Server is running at http://localhost:${env.port}`,
  );
});
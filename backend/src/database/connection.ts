import {Pool} from "pg";
import "dotenv/config";
import { env } from "../config/environment";

const databaseUrl = (env as typeof env & { DATABASE_URL?: string }).DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export const pool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
})

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

export async function checkDatabase():Promise<void>{
    await pool.query("SELECT 1");   
}
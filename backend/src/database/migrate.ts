import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pool } from "./connection.js";

async function migrate() {
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const folder = path.join(process.cwd(), "src", "database", "migrations");
  const files = (await readdir(folder)).filter((file) => file.endsWith(".sql")).sort();

  for (const file of files) {
    const applied = await pool.query("SELECT 1 FROM schema_migrations WHERE name = $1", [file]);
    if (applied.rowCount) {
      console.log(`Skipped (already applied): ${file}`);
      continue;
    }

    const sql = await readFile(path.join(folder, file), "utf8");
    const client = await pool.connect();
    try {
      
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`Applied: ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

migrate()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error("Migration failed:", error instanceof Error ? error.message : error);
    await pool.end();
    process.exit(1);
  });
import { pool } from "../../database/connection.js";
import type { NewRequestRecord, ServiceRequest, Status } from "./types.js";


type RequestRow = Omit<ServiceRequest, "created_at" | "updated_at"> & {
  created_at: Date;
  updated_at: Date;
};

function toServiceRequest(row: RequestRow): ServiceRequest {
  return row;
}


export const requestRepository = {
  async create(record: NewRequestRecord): Promise<ServiceRequest> {
    const result = await pool.query<RequestRow>(
      `INSERT INTO requests (title, description, category, priority, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [record.title, record.description, record.category, record.priority, record.status],
    );
    return toServiceRequest(result.rows[0]);
  },

  async findAll(status?: Status): Promise<ServiceRequest[]> {
    const result = status
      ? await pool.query<RequestRow>(
          "SELECT * FROM requests WHERE status = $1 ORDER BY created_at DESC",
          [status],
        )
      : await pool.query<RequestRow>("SELECT * FROM requests ORDER BY created_at DESC");
    return result.rows.map(toServiceRequest);
  },

  async findById(id: string): Promise<ServiceRequest | undefined> {
    const result = await pool.query<RequestRow>("SELECT * FROM requests WHERE id = $1", [id]);
    return result.rows[0] ? toServiceRequest(result.rows[0]) : undefined;
  },
};
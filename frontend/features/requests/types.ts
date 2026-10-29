export type Category = "IT" |"Facilities" | "Other";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  created_at: Date;
  updated_at: Date;
}

export interface NewRequestInput {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
}
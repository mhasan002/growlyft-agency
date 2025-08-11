import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create the connection for Supabase
const sql = postgres(process.env.DATABASE_URL);

// Create the database instance
export const db = drizzle(sql, { schema });
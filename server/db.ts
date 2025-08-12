import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

// Use Supabase database URL if available, fallback to DATABASE_URL
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL environment variable is required");
}

// Create the connection for Supabase
const sql = postgres(databaseUrl);

// Create the database instance
export const db = drizzle(sql, { schema });
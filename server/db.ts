import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

// Use Supabase database URL if available, fallback to DATABASE_URL
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

let db: any = null;
let sql: any = null;

if (databaseUrl) {
  try {
    // Create the connection for Supabase/PostgreSQL
    sql = postgres(databaseUrl);
    // Create the database instance
    db = drizzle(sql, { schema });
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.warn("Failed to connect to database:", error);
    db = null;
  }
} else {
  console.log("No database URL provided, will use in-memory storage");
}

export { db, sql };
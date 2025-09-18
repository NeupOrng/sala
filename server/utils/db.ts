import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';

const sql = postgres(process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/sala", {
    ssl: process.env.ENVIRONMENT === 'production' ? 'require' : false,
  });

// Create Drizzle client
export const db = drizzle(sql, { schema });
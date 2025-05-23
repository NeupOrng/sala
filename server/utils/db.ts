import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create a pg Pool instance with connection info from env variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle client
export const db = drizzle(pool);

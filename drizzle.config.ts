import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/schema/schools.ts',
  out: './server/schema/migrations',
  dbCredentials: {
    url: "postgres://postgres:postgres@127.0.0.1:5432/sala"
  }
})

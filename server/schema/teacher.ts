import { pgTable, uuid } from "drizzle-orm/pg-core";

export const Classes = pgTable("teachers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid()
});
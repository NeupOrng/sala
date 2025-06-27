import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const Schools = pgTable("schools", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    shortName: varchar("short_name", { length: 5 }),
});

import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { StatusEnum } from "./status";

export const Schools = pgTable("schools", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    shortName: varchar("short_name", { length: 5 }),
    address: varchar("address", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    status: StatusEnum('status').notNull().default("active"),
});

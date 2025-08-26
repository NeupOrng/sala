import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { StatusEnum } from "./status";
import { Users } from "./user";
import { Schools } from "./schools";

export const Teachers = pgTable("teachers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => Users.id).notNull(),
    schoolId: uuid("school_id").references(() => Schools.id).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    status: StatusEnum('status').notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
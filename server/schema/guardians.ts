import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { Students } from "./students";
import { StatusEnum } from "./status";

export const Guardians = pgTable("guardians", {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
        .references(() => Students.id, { onDelete: "cascade" })
        .notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    relationship: varchar("relationship", { length: 50 }),
    isPrimary: boolean("is_primary").default(false).notNull(),
    status: StatusEnum("status").notNull().default("active"),
});

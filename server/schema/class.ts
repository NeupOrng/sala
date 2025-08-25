import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text
} from "drizzle-orm/pg-core";
import { Schools } from "./schools";
import { StatusEnum } from "./status";

export const Classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => Schools.id).notNull(),
  teacherId: uuid("teacher_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  status: StatusEnum('status').notNull().default("active"),
});
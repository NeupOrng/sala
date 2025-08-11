import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text
} from "drizzle-orm/pg-core";
import { Schools } from "./schools";

export const Classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => Schools.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});
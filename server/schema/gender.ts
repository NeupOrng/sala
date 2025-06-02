import { pgEnum } from "drizzle-orm/pg-core";

export const GenderEnum = pgEnum('gender', [
    'male',
    'female',
    'other'
])
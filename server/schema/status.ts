import { pgEnum } from "drizzle-orm/pg-core";

export const StatusEnum = pgEnum('status', [
    'active',
    'suspended'
])
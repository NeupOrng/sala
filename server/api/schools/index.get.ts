import { db } from '~/server/utils/db';
import { Schools } from '~/server/schema/schools';

export default defineEventHandler(async () => {
  return await db.select().from(Schools);
});

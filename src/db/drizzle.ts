import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  casing: "snake_case",
});

import { pgTable, integer, text, timestamp, serial } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial().primaryKey(),
  email: text().unique().notNull(),
  password: text().unique().notNull(),
});

export const shortenedLinkTable = pgTable("shortened_links", {
  id: serial().primaryKey(),
  slug: text().unique().notNull(),
  url: text().notNull(),
  createDate: timestamp().notNull().defaultNow(),
  updateDate: timestamp().notNull().defaultNow(),
  clicks: integer().notNull().default(0),
  lastClick: timestamp(),
});

export const sessionTable = pgTable("sessions", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  sessionToken: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

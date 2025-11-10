import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { contentTypeEnum } from "~/server/db/types";

export const themes = pgTable("themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  type: contentTypeEnum("type").notNull().default("user"),
  created_by: uuid("created_by")
    .references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

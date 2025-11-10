import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { themes } from "./themes";
import { contentTypeEnum } from "../common";

export const difficultyLevels = pgEnum("difficulty_levels", [
  "easy",
  "medium",
  "hard",
  "expert",
]);

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  theme_id: uuid("theme_id")
    .notNull()
    .references(() => themes.id),
  type: contentTypeEnum("type").notNull().default("user"),
  question: text("question"),
  difficulty: difficultyLevels("difficulty").notNull().default("easy"),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

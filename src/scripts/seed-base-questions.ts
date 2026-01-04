import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { themes, questions } from "~/server/db/schema/tables";
import { baseQuestions } from "./base-questions";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in the environment variables");
    process.exit(1);
  }

  const conn = postgres(process.env.DATABASE_URL);
  const db = drizzle(conn);

  console.log("Starting seed process...");

  // Extract unique theme titles from base questions
  const uniqueThemeNames = Array.from(
    new Set(baseQuestions.map((q) => q.theme)),
  );

  console.log(`Found ${uniqueThemeNames.length} unique themes`);

  // Insert themes into the database
  const insertedThemes = await db
    .insert(themes)
    .values(
      uniqueThemeNames.map((themeName) => ({
        title: themeName,
        type: "system" as const,
        created_by: null,
      })),
    )
    .returning();

  console.log(`Inserted ${insertedThemes.length} themes`);

  // Create a mapping of theme name to theme id
  const themeMap = new Map(
    insertedThemes.map((theme): [string | null, string] => [
      theme.title,
      theme.id,
    ]),
  );

  // Insert questions with the correct theme_id
  const insertedQuestions = await db
    .insert(questions)
    .values(
      baseQuestions.map((q) => ({
        question: q.question,
        theme_id: themeMap.get(q.theme)!,
        difficulty: q.difficulty as "easy" | "medium" | "hard" | "expert",
        type: "system" as const,
        created_by: null,
      })),
    )
    .returning();

  console.log(`Inserted ${insertedQuestions.length} questions`);
  console.log("Seed process completed successfully!");

  await conn.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error during seed:", error);
  process.exit(1);
});

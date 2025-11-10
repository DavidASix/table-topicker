import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { questions, themes } from "~/server/db/schema/tables";

export const questionsRouter = createTRPCRouter({
  selectRandomByTheme: publicProcedure
    .input(z.object({ themeId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        const themeExists = await db
          .select()
          .from(themes)
          .where(eq(themes.id, input.themeId))
          .limit(1);

        if (themeExists.length === 0) {
          throw new Error("Theme not found");
        }

        const [randomQuestion] = await db
          .select({
            id: questions.id,
            question: questions.question,
          })
          .from(questions)
          .where(eq(questions.theme_id, input.themeId))
          .orderBy(sql`RANDOM()`)
          .limit(1);

        if (!randomQuestion) {
          throw new Error("No questions found for the given theme");
        }

        return randomQuestion;
      } catch (error) {
        console.error("Error fetching random question:", error);
        throw new Error("Failed to fetch random question");
      }
    }),
});

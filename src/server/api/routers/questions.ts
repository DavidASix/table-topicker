import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { questions, themes } from "~/server/db/schema/tables";
import { env } from "~/env";

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

  generateAiQuestion: protectedProcedure
    .input(
      z.object({
        theme: z.string().min(1),
        difficulty: z
          .enum(["easy", "medium", "hard", "expert"])
          .optional()
          .default("easy"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const openai = createOpenAI({
          apiKey: env.OPEN_AI_API_KEY,
        });
        const model = openai("gpt-4o-mini");

        const { object: generatedQuestion } = await generateObject({
          model,
          schema: z.object({
            question: z
              .string()
              .describe("A question for a Toastmasters Table Topics session"),
          }),
          prompt: `Generate a single ${input.difficulty} difficulty table topics question for the theme: "${input.theme}".

The question should be:
- Appropriate for the specified difficulty level (${input.difficulty})

Theme: ${input.theme}
Difficulty: ${input.difficulty}`,
        });

        return {
          question: generatedQuestion.question,
          difficulty: input.difficulty,
          theme: input.theme,
        };
      } catch (error) {
        console.error("Error generating AI question:", error);
        throw new Error("Failed to generate AI question");
      }
    }),
});

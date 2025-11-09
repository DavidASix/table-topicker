import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { themes } from "~/server/db/tables";

export const themesRouter = createTRPCRouter({
  selectSystemThemes: publicProcedure.input(z.object({})).query(async () => {
    try {
      const systemThemes = await db
        .select({ title: themes.title, id: themes.id })
        .from(themes)
        .where(eq(themes.type, "system"));

      if (systemThemes.length === 0) {
        throw new Error("Theme not found");
      }
      return systemThemes;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching system themes");
    }
  }),
});

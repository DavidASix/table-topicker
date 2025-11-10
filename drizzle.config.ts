import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: [
    "./src/server/db/schema/tables/*.ts",
    "./src/server/db/schema/common.ts",
  ],
  dialect: "postgresql",

  out: "./src/server/db/migrations/",

  verbose: true,
  strict: true,

  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;

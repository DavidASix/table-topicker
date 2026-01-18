import { pgEnum } from "drizzle-orm/pg-core";

export const contentTypeEnum = pgEnum("content_type", ["system", "user"]);

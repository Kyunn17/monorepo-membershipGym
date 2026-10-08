import { PgTable,serial,text,integer, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    membership: text("membership").notNull()
})

export const packages = pgTable("packages",{
    id: serial("id").primaryKey(),
    name : text("name").notNull(),
    description : text("description")
})
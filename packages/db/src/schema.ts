
import { pgEnum,serial,text,integer, pgTable, date,timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    membership: text("membership").notNull()
})

export const packages = pgTable("packages",{
    id: serial("id").primaryKey(),
    name : text("name").notNull(),
    description : text("description"),
    price: integer("price").notNull(),
    duration: integer("duration").notNull()
})


export const membershipStatus = pgEnum("membership_status", [
  "active",
  "expired",
  "cancelled",
]);

export const membership = pgTable("membership",{
    id: serial("id").primaryKey(),
    userId: text("userId").notNull(),
    packageId: integer("packageId").references(() => (packages.id)),
    status: membershipStatus("active").notNull(),
    startDate: date("startDate").notNull(),
    endDate: date("endDate").notNull()
})

export const attendance = pgTable("attendance",{
    id: serial("id").primaryKey(),
    userId: text("userId").notNull(),
    checkIn: timestamp("checkIn").notNull(),
    checkOut: timestamp("checkOut")
})
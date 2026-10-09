import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, user, session, account, verification } from "@repo/db";

export const auth = betterAuth({
  baseURL: "http://localhost:3001",
  trustedOrigins: ["http://localhost:3000"],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },
});

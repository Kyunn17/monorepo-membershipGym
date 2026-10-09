import { config } from "dotenv";
config({
  path: "../../.env",
});
import { Hono } from "hono";
import { cors } from "hono/cors";
import user from "./routes/users";
import  pack  from "./routes/package";
import memberships from "./routes/membership";
import { auth } from "./auth";
import "dotenv/config";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/", (c) => {
  return c.json({
    message: "API is running",
  });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/users", user);
app.route("/pack", pack)
app.route("/memberships", memberships)

export default {
  port: 3001,
  fetch: app.fetch,
}
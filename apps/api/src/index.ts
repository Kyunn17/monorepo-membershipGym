import { config } from "dotenv";
config({
  path: "../../.env",
});
import { Hono } from "hono";
import { cors } from "hono/cors";
import user from "./routes/users";
import  pack  from "./routes/package";
import memberships from "./routes/membership";
import "dotenv/config";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.json({
    message: "API is running",
  });
});

app.route("/users", user);
app.route("/pack", pack)
app.route("/memberships", memberships)

export default {
  port: 3001,
  fetch: app.fetch,
}
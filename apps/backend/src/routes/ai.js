import { Hono } from "hono";

// For the bot_whatsapp route
const Router_ai = new Hono();

userRoute.get("/", (c) => c.text("All users"));
userRoute.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`User ID: ${id}`);
});

export default Router_ai;

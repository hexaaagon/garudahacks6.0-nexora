import { Hono } from "hono";
import { Router_bot_whatsapp } from "Routes/bot_whatsapp";
import { Router_user } from "Routes/user";
import { Router_ai } from "Routes/ai";


const app = new Hono();


app.route('/bot_whatsapp', Router_bot_whatsapp)
app.route('/user', Router_user)
app.route('/ai', Router_ai);


app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;

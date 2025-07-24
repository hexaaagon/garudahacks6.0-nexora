import { Hono } from "hono";
const Routes_student = new Hono();

import { drizzle } from "@nexora/database";
import { student } from "@nexora/database/drizzle/schema/student";
import { userDetails } from "@nexora/database/drizzle/schema/userDetails";

const { db } = drizzle;

  

//make
Routes_student.post("/", async (c) => {
  const data = await c.req.json();
  await db.insert(userDetails).values({
    role: data.role,
    id: data.id
  });
  return c.text("student created!");
});

// get all classrooms
Routes_student.get("/", async (c) => {
  const students = await db.select().from(userDetails);
  return c.json(students);
});

//class stuff
Routes_student.delete("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.text("No student token provided", 400);
  }
  await db.delete(student).where(student.token.eq(token));
  return c.text("student deleted with token: " + token);
});

Routes_student.get("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.text("No student token provided", 400);
  }
  const result = await db.select().from(student).where(student.token.eq(token));
  return c.json(result);
});

Routes_student.put("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.text("No student token provided", 400);
  }
  const data = await c.req.json();
  await db
    .update(student)
    .set({
      name: data.name,
      grade: data.grade,
      classroom: data.classroom,
    })
    .where(student.token.eq(token));
  return c.text(`student updated with token: ${token}`);
});

Routes_student.post("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.text("No student token provided", 400);
  }
  await db.insert(student).values({
    token,
  });
  return c.text(`student join classrom with token: ${token}`);
});

export { Routes_student };
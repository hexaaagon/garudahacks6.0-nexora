import { Hono } from "hono";
const Routes_student = new Hono();

import { drizzle } from "@nexora/database";
const { db } = drizzle;

//make
Routes_student.post("/", async (c) => {
  const data = await c.req.json();
  await db.insert(student_scheem).values({
    name: data.name,
    grade: data.grade,
    classroom: data.classroom,
  });

  return c.text("student created!");
});
// get all classrooms
Routes_student.get("/", async (c) => {
  const students = await db.select().from(student_scheem);
  return c.json(students);
});

//class stuff
Routes_student.delete("/:token", async (c) => {
  // delete by id
  const student = c.req.param("token");
  if (!student) {
    return c.text("No student token provided", 400);
  }
  await db.delete(student).where(student_scheem.token.eq(student));
  return c.text("student deleted with token: " + token);
});
Routes_student.get("/:token", async (c) => {
  // get info of calssrom by id
  const student = c.req.param("token");
  if (!student) {
    return c.text("No student token provided", 400);
  }
  await db.select().from(student).where(student_scheem.token.eq(student));
  const token = c.req.param("token");
  return c.text(`student token: ${token}`);
});
Routes_student.put("/:token", async (c) => {
  // update/edit by id
  const student = c.req.param("token");
  if (!student) {
    return c.text("No student token provided", 400);
  }
  await db
    .update(student)
    .set({
      name: c.req.json().name,
      grade: c.req.json().grade,
      classroom: c.req.json().classroom,
    })
    .where(student_scheem.token.eq(student));
  const token = c.req.param("token");
  return c.text(`student updated with token: ${token}`);
});
Routes_student.post("/:token", async (c) => {
  // join classroom by token
  const student = c.req.param("token");
  if (!student) {
    return c.text("No student token provided", 400);
  }
  await db.insert(student_scheem).values({
    token: student,
  });
  const token = c.req.param("token");
  return c.text(`student join classrom with token: ${token}`);
});

export { Routes_student };

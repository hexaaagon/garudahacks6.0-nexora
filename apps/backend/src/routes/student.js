import { Hono } from "hono";
import { supabaseService } from "@nexora/database";

const Routes_student = new Hono();

//make
Routes_student.post("/", async (c) => {
  const data = await c.req.json();
  const { data: newUser, error } = await supabaseService
    .from("user_details")
    .insert({
      role: data.role,
      id: data.id,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(newUser);
});

// get all students
Routes_student.get("/", async (c) => {
  const { data: students, error } = await supabaseService
    .from("user_details")
    .select("*")
    .eq("role", "student");

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(students);
});

//student operations
Routes_student.delete("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.json({ error: "No student token provided" }, 400);
  }

  const { error } = await supabaseService
    .from("students")
    .delete()
    .eq("token", token);

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json({ message: "Student deleted successfully" });
});

Routes_student.get("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.json({ error: "No student token provided" }, 400);
  }

  const { data: student, error } = await supabaseService
    .from("students")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(student);
});

Routes_student.put("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.json({ error: "No student token provided" }, 400);
  }

  const data = await c.req.json();
  const { data: updatedStudent, error } = await supabaseService
    .from("students")
    .update({
      name: data.name,
      grade: data.grade,
      classroom: data.classroom,
    })
    .eq("token", token)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(updatedStudent);
});

Routes_student.post("/:token", async (c) => {
  const token = c.req.param("token");
  if (!token) {
    return c.json({ error: "No student token provided" }, 400);
  }

  const { data: newStudent, error } = await supabaseService
    .from("students")
    .insert({ token })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(newStudent);
});

export { Routes_student };

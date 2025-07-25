import { Hono } from "hono";
import { supabaseService } from "@nexora/database";

const Routes_teacher = new Hono();

const classroom = new Hono();

//make class
classroom.post("/", async (c) => {
  const data = await c.req.json();
  const { data: newClassroom, error } = await supabaseService
    .from("classrooms")
    .insert({
      name: data.name,
      grade: data.grade,
      classroom: data.classroom,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(newClassroom);
});

// get all classrooms
classroom.get("/", async (c) => {
  const { data: classrooms, error } = await supabaseService
    .from("classrooms")
    .select("*");

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(classrooms);
});

//class stuff
classroom.delete("/:token", async (c) => {
  const token = c.req.param("token");
  const { error } = await supabaseService
    .from("classrooms")
    .delete()
    .eq("id", token);

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json({ message: "Classroom deleted successfully" });
});

classroom.get("/:token", async (c) => {
  const token = c.req.param("token");
  const { data: classroom, error } = await supabaseService
    .from("classrooms")
    .select("*")
    .eq("id", token)
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(classroom);
});

classroom.put("/:token", async (c) => {
  const token = c.req.param("token");
  const data = await c.req.json();
  const { data: updatedClassroom, error } = await supabaseService
    .from("classrooms")
    .update(data)
    .eq("id", token)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(updatedClassroom);
});

const subject = new Hono();
//make subject
subject.post("/", async (c) => {
  const data = await c.req.json();
  const { data: newSubject, error } = await supabaseService
    .from("subjects")
    .insert(data)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(newSubject);
});

// get all subjects
subject.get("/", async (c) => {
  const { data: subjects, error } = await supabaseService
    .from("subjects")
    .select("*");

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(subjects);
});

//subject operations
subject.delete("/:token", async (c) => {
  const token = c.req.param("token");
  const { error } = await supabaseService
    .from("subjects")
    .delete()
    .eq("id", token);

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json({ message: "Subject deleted successfully" });
});

subject.get("/:token", async (c) => {
  const token = c.req.param("token");
  const { data: subject, error } = await supabaseService
    .from("subjects")
    .select("*")
    .eq("id", token)
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(subject);
});

subject.put("/:token", async (c) => {
  const token = c.req.param("token");
  const data = await c.req.json();
  const { data: updatedSubject, error } = await supabaseService
    .from("subjects")
    .update(data)
    .eq("id", token)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(updatedSubject);
});

const question = new Hono();
// add question
question.post("/", async (c) => {
  const data = await c.req.json();
  const { data: newQuestion, error } = await supabaseService
    .from("questions")
    .insert(data)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(newQuestion);
});

//get all questions
question.get("/", async (c) => {
  const { data: questions, error } = await supabaseService
    .from("questions")
    .select("*");

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(questions);
});

question.put("/:token", async (c) => {
  const token = c.req.param("token");
  const data = await c.req.json();
  const { data: updatedQuestion, error } = await supabaseService
    .from("questions")
    .update(data)
    .eq("id", token)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(updatedQuestion);
});

// delete question
question.delete("/:token", async (c) => {
  const token = c.req.param("token");
  const { error } = await supabaseService
    .from("questions")
    .delete()
    .eq("id", token);

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json({ message: "Question deleted successfully" });
});

question.get("/:token", async (c) => {
  const token = c.req.param("token");
  const { data: question, error } = await supabaseService
    .from("questions")
    .select("*")
    .eq("id", token)
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }
  return c.json(question);
});

Routes_teacher.route("/question", question);
Routes_teacher.route("/classroom", classroom);
Routes_teacher.route("/subject", subject);

export { Routes_teacher };

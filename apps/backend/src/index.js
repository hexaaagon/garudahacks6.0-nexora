import { Hono } from 'hono'
import { Routes_teacher } from './routes/teacher.js';
import { Routes_student } from './routes/student.js';

const app = new Hono()

app.route('/teacher', Routes_teacher)
app.route('/students', Routes_student)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  fetch: app.fetch,
  port: 3003
}

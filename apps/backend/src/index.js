import { Hono } from 'hono'
import { teacher } from './routes/teacher.js';
import { student } from './routes/student.js';

const app = new Hono()

app.route('/teacher', teacher)
app.route('/students', student)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  fetch: app.fetch,
  port: 3001
}

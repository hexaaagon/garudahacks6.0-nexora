import { Hono } from 'hono'
import { db } from '@nexora/database/src/drizzle';
import { student } from '@nexora/database/src/drizzle/db/schema';


const Routes_student = new Hono()


//make
Routes_student.post('/', async (c) => {
    const data = await c.req.json();
    await db.insert(student).values({
        name: data.name,
        grade: data.grade,
        classroom: data.classroom
    })

    return c.text('student created!')
})
// get all classrooms
Routes_student.get('/', async (c) => {
    const students = await db.select().from(student)
    return c.json(students)
})

//class stuff
Routes_student.delete('/:token', (c) => {
    // delete by id
    const token = c.req.param('token')
    return c.text('student deleted with token: ' + token)
})
Routes_student.get('/:token', (c) => {
    // get info of calssrom by id
    const token = c.req.param('token')
    return c.text(`student token: ${token}`)
})
Routes_student.put('/:token', (c) => {
    // update/edit by id
    const token = c.req.param('token')
    return c.text(`student updated with token: ${token}`)
})
Routes_student.post('/:token', (c) => {
    // join classroom by token
    const token = c.req.param('token')
    return c.text(`student join classrom with token: ${token}`)
})






export { Routes_student };

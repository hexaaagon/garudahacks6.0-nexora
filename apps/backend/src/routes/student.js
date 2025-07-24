import { Hono } from 'hono'

const student = new Hono()


//make
student.post('/', (c) => {
    return c.text('student created!')
})
// get all classrooms
student.get('/', (c) => {
    return c.text('All students')
})

//class stuff
student.delete('/:token', (c) => {
    // delete by id
    const token = c.req.param('token')
    return c.text('student deleted with token: ' + token)
})
student.get('/:token', (c) => {
    // get info of calssrom by id
    const token = c.req.param('token')
    return c.text(`student token: ${token}`)
})
student.put('/:token', (c) => {
    // update/edit by id
    const token = c.req.param('token')
    return c.text(`student updated with token: ${token}`)
})
student.post('/:token', (c) => {
    // join classroom by token
    const token = c.req.param('token')
    return c.text(`student join classrom with token: ${token}`)
})






export { student };

import { Hono } from 'hono'

const teacher = new Hono()


const classroom = new Hono()

//make class
classroom.post('/', (c) => {
    return c.text('Classroom created!')
})
// get all classrooms
classroom.get('/', (c) => {
    return c.text('All classrooms')
})

//class stuff
classroom.delete('/:token', (c) => {
    // delete by id
    const token = c.req.param('token')
    return c.text('All classrooms')
})
classroom.get('/:token', (c) => {
    // get info of calssrom by id
    const token = c.req.param('token')
    return c.text(`Classroom token: ${token}`)
})
classroom.put('/:token', (c) => {
    // update/edit by id
    const token = c.req.param('token')
    return c.text(`Classroom updated with token: ${token}`)
})



const subject = new Hono()
//make class
subject.post('/', (c) => {
    return c.text('Classroom created!')
})
// get all classrooms
subject.get('/', (c) => {
    return c.text('All classrooms')
})

//class stuff
subject.delete('/:token', (c) => {
    // delete by id
    const token = c.req.param('token')
    return c.text('All classrooms')
})
subject.get('/:token', (c) => {
    // get info of calssrom by id
    const token = c.req.param('token')
    return c.text(`Classroom token: ${token}`)
})
subject.put('/:token', (c) => {
    // update/edit by id
    const token = c.req.param('token')
    return c.text(`Classroom updated with token: ${token}`)
})



const question = new Hono()
// add question
question.post('/', (c) => {
  return c.text('Question added!')
})

//get all question
question.get('/', (c) => {
  return c.text('All questions')
})


question.put('/:token', (c) => {
    // update/edit by id
    const token = c.req.param('token')
    return c.text(`Classroom updated with token: ${token}`)
})
// delete question
question.delete('/:token', (c) => {
    // delete by id
    const token = c.req.param('token')
    return c.text(`Question deleted with token: ${token}`)
})
question.get('/:token', (c) => {
    // get info of question by id
    const token = c.req.param('token')
    return c.text(`Classroom token: ${token}`)
})
 




teacher.route('/question', question)
teacher.route('/classroom', classroom)
teacher.route('/subject', subject)


export { teacher };

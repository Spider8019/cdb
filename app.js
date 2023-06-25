const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const taskModel = require('./models/task')
const app = express()
const axios = require('axios')
const port = 4000
const verifyJwt = require('./middleware/auth')

mongoose
  .connect(
    'mongodb+srv://cduser:Spider8019@cluster0.u9p42lo.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('DATABASE CONNECTED SUCCESSFULLY'))
  .catch((err) => console.log(err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(verifyJwt)

app.get('/protectedroute', async (req, res) => {
  res.send('you are on protected route')
})
app.get('/', async (req, res) => {
  const response = 'aman pratap singh'
  const task = await taskModel.findById('644f471a3c7d565eb5cda996')
  console.log(task)
  res.send(task)
})
app.post('/addtask', async (req, res) => {
  const task = new taskModel({
    title: req.body.title,
    date: req.body.date,
    type: req.body.type,
  })
  const response = await task.save()
  console.log(response)
  res.send(response)
})
app.post('/recreatetask', async (req, res) => {
  const task = await taskModel.findById(req.body.id)
  const response = await taskModel.findByIdAndUpdate(req.body.id, {
    date: [
      ...task.date.slice(0, -1),
      req.body.timeWeHave,
      new Date().getTime(),
    ],
  })
  res.send(response)
})
app.get('/alltask', async (req, res) => {
  const tasks = await taskModel.find({})
  res.json(tasks)
})
app.delete('/deletetask', async (req, res) => {
  const response = await taskModel.findByIdAndDelete(req.body._id)
  res.json(response)
})

app.use((req,res,next)=>{
    const error=new Error('Not Found')
    error.status=404;
    next(error)
})

app.use((error,req,res next)=>{
    const status=error.status || 500;
    const message=error.message || 'Internal server error';
    res.status(status).send(message) ;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

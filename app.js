require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const taskModel = require('./models/task')
const userModel = require('./models/user')
const app = express()
const axios = require('axios')
const port = 4000
const auth = require('./middleware/auth')
// const { auth } = require('express-oauth2-jwt-bearer')
// const jwt = require('jsonwebtoken')
// const jwksRsa = require('jwks-rsa')
// const { expressjwt: jwt } = require('express-jwt')

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

app.get('/', async (req, res) => {
  const task = await taskModel.findById('644f471a3c7d565eb5cda996')
  console.log(task)
  res.send(task)
})
app.post('/createuser', async (req, res) => {
  try {
    const user = new userModel({
      userPhoneNumber: req.body.userPhoneNumber,
      password: req.body.password,
    })
    const response = await user.save()
    console.log(response)
    res.send(response)
  } catch (err) {
    res.send(err)
  }
})
app.post('/login', async (req, res) => {
  try {
    var user = await userModel.findOne({
      userPhoneNumber: req.body.userPhoneNumber,
    })
    var isMatch = await bcrypt.compare(req.body.password, user.password)
    if (isMatch) {
      var token = await user.generateAuthToken()
      res.send({
        token,
        userPhoneNumber: user.userPhoneNumber,
        userId: user._id,
      })
    }
  } catch (err) {
    res.send(err)
  }
})
app.post('/logout', async function (req, res) {
  req.user.tokens = []
  req.user.save()
  res.send('Logout')
})
app.post('/subscribetask', async (req, res) => {
  try {
    const taskId=req.body._id;
    console.log(taskId)
    res.send(taskId)
  } catch (e) {
    res.send(e)
  }
})
app.post('/addtask', async (req, res) => {
  console.log(req.body)
  console.log(req.user)
  const task = new taskModel({
    title: req.body.title,
    date: req.body.date,
    type: req.body.type,
    createdBy: req.body.createdBy,
    forPublic: req.body.checked,
  })
  const response = await task.save()
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
  try {
    const tasks = await taskModel.find({ forPublic: { $ne: false } })
    console.log(tasks.filter(x=>{return x.title==="dubai trip"}))
    console.log(tasks.length)
    res.send(tasks)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})
app.get('/alltaskbyyou', async (req, res) => {
  try {
    const tasks = await taskModel.find({
      createdBy: req.query.userId,
    })
    console.log(tasks)
    console.log(tasks.length)
    res.send(tasks)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})
app.delete('/deletetask', async (req, res) => {
  const response = await taskModel.findByIdAndDelete(req.body._id)
  res.json(response)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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
// const checkJwt = auth({
//   audience: 'this api is created first time for testing purposse',
//   issuerBaseURL: 'https://dev-j5c8r52qumbdfppi.us.auth0.com/',
// })

// const authConfig = {
//   domain:'dev-j5c8r52qumbdfppi.us.auth0.com',
//   audience: "this api is created first time for testing purposse",
// }

// const checkJwt = jwt({
//   // Dynamically provide a signing key based on the key identifier in the header
//   // and the signing keys provided by the JWKS endpoint.
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
//   }),

//   // Validate the audience and the issuer.
//   audience: authConfig.audience,
//   issuer: `https://${authConfig.domain}/`,
//   algorithms: ['RS256'],
// })

// app.use(checkJwt)

// app.get('/protectedroute', checkJwt, async (req, res) => {
//   res.send('you are on protected route')
// })

// {
//   "userPhoneNumber": "+916005285787",
//   "password": "$2a$10$gBY5cqIre5OFEBhDILxtcuJGGG8duRXNb85lUFPsY5PgYPR/84sjG",Aman@123
//   "_id": "64b3e27545b8d3b551a8edb4",
//   "authorizedTillDate": "2023-08-15T18:30:00.000Z",
//   "createdAt": "2023-07-16T12:28:37.497Z",
//   "updatedAt": "2023-07-16T12:28:37.497Z",
//   "__v": 0
// }

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
      console.log('possible correct passwword')
      console.log(token)
      res.send({ token, userPhoneNumber: user.userPhoneNumber })
    }
  } catch (err) {
    res.send(err)
  }
})
app.post('/logout', auth, async function (req, res) {
  req.user.tokens = []
  req.user.save()
  res.send('Logout')
})
app.post('/addtask', async (req, res) => {
  const task = new taskModel({
    title: req.body.title,
    date: req.body.date,
    type: req.body.type,
    createdBy: req.body.userId,
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
    const tasks = await taskModel.find({})
    res.send(tasks)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})
app.get('/alltaskbyyou', async (req, res) => {
  try {
    const tasks = await taskModel.find({
      phoneNumber: req.query.phoneNumber,
    })
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

// app.use((req, res, next) => {
//   const error = new Error('Not Found')
//   error.status = 404
//   next(error)
// })

// app.use((error, req, res, next) => {
//   const status = error.status || 500
//   const message = error.message || 'Internal server error'
//   res.status(status).send(message)
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

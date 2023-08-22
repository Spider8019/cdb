const jwt = require('jsonwebtoken')
const user = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const verify = jwt.verify(token, process.env.SECRET_KEY)
    const user = await user.findOne({ _id: verify._id })
    req.token = token
    req.user = user

    next()
  } catch (error) {
    res.send(error)
  }
}

module.exports = auth

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const schema = mongoose.Schema


const userSchema = new mongoose.Schema(
  {
    userPhoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regular expression for Indian mobile numbers
          const mobileNumberRegex = /^(\+?91|0)?[6789]\d{9}$/
          return mobileNumberRegex.test(value)
        },
        message: 'Invalid mobile number',
      },
    },
    password: {
      type: String,
      required: true,
    },
    authorizedTillDate: {
      type: Date,
      default: function () {
        const currentDate = new Date()
        const nextMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1,
        )
        return new Date(
          nextMonth.getFullYear(),
          nextMonth.getMonth(),
          currentDate.getDate(),
        )
      },
    },
    subscribedTo: [
      {
        type: schema.Types.ObjectId,
        ref: Task,
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
)

userSchema.methods.generateAuthToken = async function () {
  try {
    var token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, {
      expiresIn: '24h',
    })
    console.log(token)
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    return token
  } catch (error) {
    console.log('there is an error', error)
  }
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

const Users = mongoose.model('User', userSchema)

module.exports = Users

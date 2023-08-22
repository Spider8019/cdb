const mongoose = require('mongoose')
const User = require('./user')
const schema = mongoose.Schema

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: [
      {
        type: Number,
        required: true,
      },
    ],
    createdBy: {
      type: schema.Types.ObjectId,
      ref: User,    
    },
    type: {
      type: String,
      enum: ['+', '-'],
      required: true,
    },
    forPublic:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true },
)

const Tasks = mongoose.model('Task', taskSchema)

module.exports = Tasks

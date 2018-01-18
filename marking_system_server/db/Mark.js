const mongoose = require('mongoose')
const db = require('./db')

const MarkSchema = mongoose.Schema({
  owner: {
    username: String,
    id: String
  },
  markName: String,
  encrypt: Boolean,
  password: String,
  auth: Boolean,
  privary: Boolean,
  done: {
    type: Boolean,
    default: false
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  members: [
    {
      username: String,
      id: String
    }
  ],
  charts: [
    {
      username: String,
      sex: String,
      age: Number,
      otherMessage: String,
      scores: [
        {
          username: String,
          id: String,
          score: Number,
          createDate: {
            type: Date,
            default: Date.now
          }
        }
      ],
      createDate: {
        type: Date,
        default: Date.now
      }
    }
  ]
})

const MarkModel = db.model('Mark', MarkSchema)

module.exports = MarkModel
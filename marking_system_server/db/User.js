const mongoose = require('mongoose');
const db = require('./db');

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  create_date: {
    type: Date,
    default: Date.now
  },
  marks: [
    {
      markName: String,
      id: String,
      owner: Boolean,
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
      charts: [
        {
          username: String,
          score: Number
        }
      ]
    }
  ]
});

const UserModel = db.model('user', UserSchema)

module.exports = UserModel
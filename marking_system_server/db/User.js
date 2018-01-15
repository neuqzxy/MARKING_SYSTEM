const mongoose = require('mongoose');
const db = require('./db');

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});

const UserModel = db.model('user', UserSchema)

module.exports = UserModel
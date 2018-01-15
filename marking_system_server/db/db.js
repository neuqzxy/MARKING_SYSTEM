const mongoose = require('mongoose')
const config = require('config-lite')(__dirname)
const {mongodb, user, pass} = config.db
const db = mongoose.createConnection(mongodb, {useMongoClient: true, user, pass})

db.on('open', () => {
  console.log('数据库打开')
})
db.on('error', (err) => {
  console.log(err.message)
})

module.exports = db;
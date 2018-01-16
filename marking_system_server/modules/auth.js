/**
 * code表
 * 4001 出现未知错误
 * 4002 没有该用户
 * 4003 密码错误
 */
const UserModel = require('../db/User')
const createMark = require('./socket/createMark/index')
const getAllMark = require('./socket/getAllMark/index')
const md5 = require('./common/md5')

module.exports = {
  authenticate(socket, data, callback) {
    UserModel.find({username: data.username}, (err, docs) => {
      if (err || docs.length > 1) {
        return callback(new Error('4001'))
      } else if (docs.length === 0) {
        return callback(new Error('4002'))
      } else if (docs.length === 1) {
        if (docs[0].password !== md5(data.password)) {
          return callback(new Error('4003'))
        }
        return callback(null, true);
      }
    })
  },
  postAuthenticate(socket, data) {
    socket.client.username = data.username;
    console.log('连接成功', socket.client.username, socket.id);
    createMark(socket)
    getAllMark(socket)
  },
  disconnect(socket) {
    console.log(socket.id + ' disconnected');
  }
}
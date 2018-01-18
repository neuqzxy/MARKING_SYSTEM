const Mark = require('../../../db/Mark')
const User = require('../../../db/User')
module.exports = socket => {
  socket.on('add_person', data => {
    // 先检查有没有连接到该room
    const keys = Object.keys(socket.rooms)
    if (!keys.includes(data.id) || socket.client.username !== data.clientUsername) {
      socket.emit('add_person_error', {message: '非法的操作'})
    } else {
      // 将该人存到数据库中
      const {username, sex, age, otherMessage} = data
      Mark.update({_id: data.id}, {$push: {charts: {username, sex, age, otherMessage}}}, {}, (err, doc) => {
        if (err) {
          socket.emit('add_person_error', {message: '存储失败'})
        } else {
          User.update({username: data.clientUsername, 'marks.id': data.id}, {$push: {'marks.$.charts': {username, sex, age, otherMessage}}}, {}, err => {
            if (err) {
              Mark.update({_id: data.id}, {$pop: {charts: 1}}, {}, () => {
                socket.emit('add_person_error', {message: '存储失败'})
              })
            } else {
              socket.emit('add_person_success', {message: '存储成功'})
              socket.to(data.id).emit('broadcast_add_person_success', {data, message: `${data.clientUsername}刚刚添加了评分信息`})
            }
          })
        }
      })
    }
  })
}
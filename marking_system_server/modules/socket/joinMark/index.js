const Mark = require('../../../db/Mark')
module.exports = socket => {
  socket.on('join_mark_group', data => {
    Mark.find({markName: data.markName, _id: data.id}, (err, docs) => {
      if (err || docs.length > 1) {
        return socket.emit('join_mark_group_error', {markName: data.markName, message: '查询出现错误'})
      } else {
        if (docs.length === 0) {
          return socket.emit('join_mark_group_error', {markName: data.markName, message: '没有该评分工作组'})
        } else {
          if (docs[0].password === data.password) {
            socket.join(data.id, () => {
              socket.client.rooms.add(data.id)
              socket.to(data.id).emit('broadcast_join_mark_group_success', {message: `${socket.client.username}进入了${data.markName}评分工作组`})
              return socket.emit('join_mark_group_success', {markName: data.markName, data: docs[0]})
            })
          } else {
            return socket.emit('join_mark_group_error', {markName: data.markName, message: '密码错误'})
          }
        }
      }
    })
  })
}

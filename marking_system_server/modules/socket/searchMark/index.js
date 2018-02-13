const Marks = require('../../../db/Mark')

module.exports = socket => {
  socket.on('get_mark_by_id', data => {
    if (data.id) {
      console.log(data.id)
      Marks.find({_id: data.id}, (err, docs) => {
        if (err) {
          socket.emit('get_mark_by_id_error', {message: '获取评分信息发生错误'})
        } else {
          socket.emit('get_mark_by_id_success', {message: '获取评分信息成功', data: docs})
        }
      })
    } else {
      socket.emit('get_mark_by_id_error', {message: '非法的操作'})
    }
  })
}
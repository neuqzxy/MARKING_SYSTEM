const Marks = require('../../../db/Mark')
module.exports = socket => {
  socket.on('get_mark_rooms', data => {
    if (data.username === socket.client.username) {
      const keys = Object.keys(socket.rooms).splice(1,)
      Marks.find({_id: {$in: keys}}, (err, docs) => {
        if (err) {
          socket.emit('get_mark_rooms_error', {message: '查询出错'})
        } else {
          const data = docs.map(item => {
            return {
              id: item._id,
              markName: item.markName,
              charts: item.charts,
            }
          })
          socket.emit('get_mark_rooms_success', {message: '查询成功', data})
        }
      })
    } else {
      socket.emit('get_mark_rooms_error', {message: '非法的操作'})
    }
  })
}
const Marks = require('../../../db/Mark')

module.exports = socket => {
  socket.on('get_mark_by_id', data => {
    if (data.id) {
      console.log(data.id)
      Marks.find({_id: data.id}, (err, docs) => {
        if (err) {
          socket.emit('get_mark_by_id_error', {message: '获取评分信息发生错误'})
        } else {
          const data = docs.map(item => {
            return {
              id: item._id,
              markName: item.markName,
              encrypt: item.encrypt,
              privary: item.privary,
              auth: item.auth,
              createDate: item.createDate,
              owner: item.owner.username,
              member: item.members,
              done: item.done
            }
          })
          socket.emit('get_mark_by_id_success', {message: '获取评分信息成功', data})
        }
      })
    } else {
      socket.emit('get_mark_by_id_error', {message: '非法的操作'})
    }
  })
}
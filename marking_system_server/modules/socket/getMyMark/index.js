const Marks = require('../../../db/Mark')
module.exports = socket => {
  socket.on('get_my_marks', data => {
    if (data.username === socket.client.username) {
      Marks.find({'owner.username': data.username}, (err, docs) => {
        if (err) {
          socket.emit('get_my_marks_error', {message: '非法的操作'})
        } else {
          const data = docs.map(item => {
            return {
              id: item._id,
              markName: item.markName,
              encrypt: item.encrypt,
              auth: item.auth,
              privary: item.privary,
              createDate: item.createDate,
              owner: item.owner.username,
              member: item.members,
              done: item.done,
              accessCode: item.accessCode
            }
          })
          socket.emit('get_my_marks_success', {message: '获取信息成功', data: docs})
        }
      })
    } else {
      socket.emit('get_my_marks_error', {message: '非法的操作'})
    }
  })
}
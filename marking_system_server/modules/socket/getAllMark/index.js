const Mark = require('../../../db/Mark')

module.exports = socket => {
  socket.on('get_all_mark', () => {
    Mark.find({privary: false}, (err, docs) => {
      if (err) {
        socket.emit('get_all_mark_err', {message: '查询出现错误'})
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
            done: item.done
          }
        })
        socket.emit('get_all_mark_success', {message: '查询成功', data})
      }
    })
  })
}
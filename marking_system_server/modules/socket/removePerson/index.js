const MarkModel = require('../../../db/Mark')
const UserModel = require('../../../db/User')
const checkFormFull = require('../../common/checkFormFull')

module.exports = socket => {
  socket.on('remove_person', data => {
    // 先检查有没有连接到该room
    const keys = Object.keys(socket.rooms)
    if (!keys.includes(data.markId) || socket.client.username !== data.username) {
      socket.emit('remove_person_error', {message: '非法的操作'})
    } else {
      // 检查请求信息是否完整
      let flag = checkFormFull(data)
      if (flag) {
        MarkModel.findOneAndUpdate({_id: data.markId, markName: data.markName}, {$pull: {charts: {'personId': data.personId}}}, {}, (err, markData) => {
          if (err) {
            socket.emit('remove_person_error', {message: '发生错误'})
          } else {
            UserModel.updateMany({}, {$pull: {scores: {'personId': data.personId}}}, {}, (err, docs) => {
              // 如果发生错误，就回滚
              if (err) {
                MarkModel.update({_id: data.markId, markName: data.markName}, markData, {}, (err, docs) => {
                  socket.emit('remove_person_error', {message: '发生错误'})
                })
              } else {
                socket.emit('remove_person_success', data)
                socket.to(data.markId).emit('broad_remove_person_success', data)
              }
            })
          }
        })
      } else {
        socket.emit('remove_person_error', {message: '非法的操作'})
      }
    }
  })
}

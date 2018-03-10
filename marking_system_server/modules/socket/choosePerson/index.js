module.exports = socket => {
  socket.on('choose_person', data => {
    // 先检查有没有连接到该room
    const keys = Object.keys(socket.rooms)
    if (!keys.includes(data.markId) || socket.client.username !== data.username) {
      socket.emit('choose_person_error', {message: '非法的操作'})
    } else {
      socket.to(data.markId).emit('broadcast_choose_person_success', data)
      socket.emit('choose_person_success', data)
    }
  })
}

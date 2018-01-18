/**
 * code 表
 * 5000 表单没有填写完整
 * 5001 表单存储失败
 * 5002 没有权限
 * 5003 发生未知错误
 */
const User = require('../../../db/User')
const Mark = require('../../../db/Mark')
const checkFormFull = require('../../common/checkFormFull')
module.exports = (socket) => {
  socket.on('createMark', data => {
    let flag = checkFormFull(data)
    if (flag) {
      const {owner, markName, encrypt, password, auth, privary} = data
      if (owner === socket.client.username) {
        // 先找到该用户的id，然后存到Mark表中，存完后再信息存入User表中，如果失败，删除Mark表中的那一个文档
        User.find({username: owner}, (err, data) => {
          if (err) {
            socket.emit('createMark-formErr', {code: 5001, message: '表单存储失败'})
          } else {
            Mark.create({owner: {username: owner, id: data[0]._id}, markName, encrypt, password, auth, privary}, (err, docs) => {
              if (err) {
                socket.emit('createMark-formErr', {code: 5001, message: '表单存储失败'})
              } else {
                User.update({username: owner}, {$push: {marks: {markName, id: docs._id, owner: true, password, auth, privary, encrypt}}}, {}, (err) => {
                  if (err) {
                    Mark.remove({_id: docs._id}, (err) => {
                      if (err) {
                        socket.emit('createMark-err', {code: 5003, message: '发生未知错误，请联系管理员'})
                      } else {
                        socket.emit('createMark-formErr', {code: 5001, message: '表单存储失败'})
                      }
                    })
                  } else {
                    const data = {
                      id: docs._id,
                      markName: markName,
                      encrypt: encrypt,
                      auth: auth,
                      createDate: docs.createDate,
                      owner: owner,
                      done: false
                    }
                    socket.emit('createMark-success', {code: 1000, message: '创建成功', data})
                    if (!privary) {
                      socket.broadcast.emit('broadcast-createMark-success', {code: 10000, message: `${owner}刚刚创建了一个新评分`, data})
                    }
                  }
                })
              }
            })
          }
        })
      } else {
        socket.emit('createMark-err', {code: 5002, message: '没有权限'})
      }
    } else {
      socket.emit('createMark-formErr', {code: 5000, message: '表单填写不完整'})
    }
  })
}
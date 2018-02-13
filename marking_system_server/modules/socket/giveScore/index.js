const User = require('../../../db/User')
const Mark = require('../../../db/Mark')
module.exports = socket => {
  socket.on('give_score', data => {
    // 判断打分是实名还是匿名
    if (socket.client.rooms.has(data.markId)) {
      // 先找到，再修改，再存入
      Mark.find({'charts.personId': data.personId}, (err, docs) => {
        if (err || docs.length !== 1) {
          socket.emit('give_score_error', {message: '出现错误1' + docs.length})
        } else {
          // 取出该人的chart，并保存之前的chart
          data.username = socket.client.realNameRooms.has(data.markId) ? data.username : socket.id
          let chart = {}
          let originChart = {}
          for (let i of docs[0].charts) {
            if (i.personId === data.personId) {
              let flag = false
              chart = i
              originChart = JSON.parse(JSON.stringify(i))
              for (let item of i.scores) {
                if (item.username === data.username) {
                  item.score = data.score
                  flag = true
                }
              }
              if (!flag) {
                i.scores.push({username: data.username, score: data.score})
              }
            }
          }
          // 存入数据库
          Mark.update({'charts.personId': data.personId}, {$set: {'charts.$': chart}}, {}, err => {
            if (err) {
              socket.emit('give_score_error', {message: '出现错误2'})
            } else {
              User.update({username: socket.client.username, 'scores.markId': data.markId, 'scores.personId': data.personId}, {$set: {'scores.$.score': data.score || 0}}, {}, (err, updateResult) => {
                if (err) {
                  Mark.findOneAndUpdate({'charts.personId': data.personId}, {$set: {'charts.$': originChart}}, {}, (err) => {
                    socket.emit('give_score_error', {message: '出现错误3'})
                  })
                } else {
                  if (updateResult.n === 0 && updateResult.nModified === 0) {
                    User.update({username: socket.client.username}, {$push: {scores: {markId: data.markId, score: data.score, personId: data.personId, personName: data.personName}}}, {}, err => {
                      if (err) {
                        Mark.findOneAndUpdate({'charts.personId': data.personId}, {$set: {'charts.$': originChart}}, {}, (err) => {
                          socket.emit('give_score_error', {message: '出现错误4'})
                        })
                      } else {
                        socket.emit('give_score_success', {message: '评分成功', reqData: data})
                        socket.to(data.markId).emit('broadcast_give_score_success', {message: '评分成功', reqData: data})
                      }
                    })
                  } else {
                    socket.emit('give_score_success', {message: '评分成功', reqData: data})
                    socket.to(data.markId).emit('broadcast_give_score_success', {message: '评分成功', reqData: data})
                  }
                }
              })
            }
          })
        }
      })
    } else if (socket.client.notRealNameRooms.has(data.markId)) {
      Mark.find({'charts.personId': data.personId}, (err, docs) => {
        if (err || docs.length !== 1) {
          socket.emit('give_score_error', {message: '出现错误1' + docs.length})
        } else {
          // 取出该人的chart，并保存之前的chart
          let chart = {}
          let originChart = {}
          for (let i of docs[0].charts) {
            if (i.personId === data.personId) {
              let flag = false
              chart = i
              originChart = JSON.parse(JSON.stringify(i))
              for (let item of i.scores) {
                if (item.username === socket.id) {
                  item.score = data.score
                  flag = true
                }
              }
              if (!flag) {
                i.scores.push({username: socket.id, score: data.score})
              }
            }
          }
          // 存入数据库
          Mark.update({'charts.personId': data.personId}, {$set: {'charts.$': chart}}, {}, err => {
            if (err) {
              socket.emit('give_score_error', {message: '出现错误2'})
            } else {
              User.update({username: socket.client.username, 'scores.markId': data.markId, 'scores.personId': data.personId}, {$set: {'scores.$.score': data.score || 0}}, {}, (err, updateResult) => {
                if (err) {
                  Mark.findOneAndUpdate({'charts.personId': data.personId}, {$set: {'charts.$': originChart}}, {}, (err) => {
                    socket.emit('give_score_error', {message: '出现错误3'})
                  })
                } else {
                  if (updateResult.n === 0 && updateResult.nModified === 0) {
                    User.update({username: socket.client.username}, {$push: {scores: {markId: data.markId, score: data.score, personId: data.personId, personName: data.personName}}}, {}, err => {
                      if (err) {
                        Mark.findOneAndUpdate({'charts.personId': data.personId}, {$set: {'charts.$': originChart}}, {}, (err) => {
                          socket.emit('give_score_error', {message: '出现错误4'})
                        })
                      } else {
                        socket.emit('give_score_success', {message: '评分成功', reqData: data})
                      }
                    })
                  } else {
                    socket.emit('give_score_success', {message: '评分成功', reqData: data})
                  }
                }
              })
            }
          })
        }
      })
    } else {
      socket.emit('give_score_error', {message: '没有权限'})
    }
  })
}
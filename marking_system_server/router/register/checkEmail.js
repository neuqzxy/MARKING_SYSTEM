/**
 * code表
 * 1000 用户名可用
 * 3001 用户名重复
 * 3002 出现错误
 * 3003 表单有误
 */
const UserModel = require('../../db/User');
module.exports = (req, res) => {
  if (req.query.email) {
    UserModel.find({email: req.query.email}, (err, docs) => {
      if (docs.length === 0) {
        return res.json({
          code: 1000,
          message: '邮箱可用'
        })
      } else if (docs.length === 1) {
        return res.json({
          code: 3001,
          message: '该邮箱已经注册'
        })
      } else {
        return res.json({
          code: 3002,
          message: '出现错误，可能存在重复邮箱'
        })
      }
    })
  } else {
    return res.json({
      code: 3003,
      message: '表单填写有误'
    })
  }
}
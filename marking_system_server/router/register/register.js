/**
 * code表
 * 1000 完全正确
 * 1005 表单错误
 * 1006 临时修改邮箱
 * 1007 请求出现未知错误
 * 1008 重复提交表单
 * @param app
 */
const formidable = require('formidable');
const md5 = require('../../modules/common/md5');
const UserModel = require('../../db/User');

module.exports = (req, res) => {
  let form = formidable.IncomingForm()
  form.parse(req, (err, fields) => {
    if (err) {
      return res.json({
        code: 1004,
        message: '请求出现未知错误'
      })
    } else {
      UserModel.find({username: fields.username}, (err, docs) => {
        if (docs.length === 0) {
          if (fields.email !== req.session.email || fields.authCode !== req.session.authCode) {
            req.session.email = void 0;
            req.session.authCode = void 0;
            return res.json({
              code: 1006,
              message: '临时修改邮箱'
            })
          } else if (!fields.password || !fields.email || !fields.username || !fields.authCode) {
            return res.json({
              code: 1005,
              message: '表单填写不完整'
            })
          } else {
            const {username, password, email} = fields;
            UserModel.create({
              username,
              email,
              password: md5(password)
            }, (err, docs) => {
              if (err) {
                return res.json({
                  code: 1007,
                  message: '存储表单出现未知错误'
                })
              } else {
                res.json({
                  code: 1000,
                  message: '注册成功'
                })
              }
            })
          }
        } else if (docs.length === 1) {
          return res.json({
            code: 1008,
            message: '重复提交表单'
          })
        } else {
          return res.json({
            code: 1007,
            message: '表单检测出错'
          })
        }
      })
    }
  })
};
const formidable = require('formidable');

module.exports = (req, res) => {
  const form = formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) {
      return res.json({
        code: 1004,
        message: '请求出错'
      })
    } else if (fields.authCode) {
      if(fields.authCode === req.session.authCode) {
        return res.json({
          code: 1000,
          message: '验证成功'
        })
      } else {
        return res.json({
          code: 1001,
          message: '验证码错误'
        })
      }
    } else {
      return res.json({
        code: 1005,
        message: '表单错误'
      })
    }
  })
};
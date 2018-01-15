const mail = require('../../modules/mail');
const rendomNum = require('../../modules/common/randomNum');

module.exports = (req, res) => {
  if(req.query.email) {
    mail(req.query.email, rendomNum(5), (data) => {
      if (data.code === 1002) {
        return res.json({
          code: 1002,
          message: '邮箱发送失败'
        })
      } else if (data.code === 1000) {
        req.session.authCode = data.data.authCode;
        req.session.email = req.query.email;
        return res.json({
          code: 1000,
          message: '验证码发送成功'
        })
      }
    })
  }
};
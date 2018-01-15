const nodemailer = require('nodemailer');
const config = require('config-lite')(__dirname);

module.exports = (email, authCode, callback) => {
  const transporter = nodemailer.createTransport({
    service: 'qq',
    port: 456,
    secureConnection: true,
    auth: {
      user: config.mail.email,
      pass: config.mail.SMATPasswd    //这里的密码是QQ授权码
    }
  });
  const mailOptions = {
    from: config.mail.email,
    to: email,
    subject: '开源评分系统',
    text: '验证码',
    html: `欢迎使用该开源评分系统，您本次的验证码为<br><h1><b>${authCode}</b></h1>`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err.message);
      callback({
        code: 1002
      })
    } else {
      callback({
        code: 1000,
        data: {
          authCode: authCode
        }
      })
    }
  });
};
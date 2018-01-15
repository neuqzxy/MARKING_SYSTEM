/**
 * code表
 * 1000 完全正确
 * 1001 邮箱验证码错误
 * 1002 邮箱发送出错
 * 1003 验证码验证出错
 * 1004 请求出现未知错误
 * 1005 表单错误
 * @param app
 */
const express = require('express');
const router = express.Router();

// 注册
router.post('/', require('./register'));
// 检查用户名是否重复
router.get('/check/username', require('./checkUsername'));
// 检查验证码是否正确
router.post('/check/authcode', require('./checkAuthCode'));
// 检查邮箱是否已经注册
router.get('/check/email', require('./checkEmail'));
// 发送验证码
router.get('/authcode', require('./sendMail'));

module.exports = router;
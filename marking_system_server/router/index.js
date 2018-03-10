module.exports = app => {
  app.use('/api/register', require('./register/index'))
  app.use('/api/userinfo', require('./info/index'))
}
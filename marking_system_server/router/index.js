module.exports = app => {
  app.use('/api/register', require('./register/index'))
}
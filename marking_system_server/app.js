const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const auth = require('./modules/auth');
const router = require('./router');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('config-lite')(__dirname)
require('socketio-auth')(io, {
    authenticate: auth.authenticate,
    postAuthenticate: auth.postAuthenticate,
    disconnect: auth.disconnect,
    timeout: 1000
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});


app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true,// 强制更新 session
  saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: 'mongodb://xinzai:zxy13966238190@127.0.0.1:27017/marking_system'// mongodb 地址
  })
}));

router(app)

server.listen(3000, () => {
    console.log('server running at 127.0.0.1:3000')
});
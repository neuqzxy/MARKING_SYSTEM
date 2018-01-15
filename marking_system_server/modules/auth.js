module.exports = {
  authenticate(socket, data, callback) {
    console.log('a')
    const username = data.username;
    const password = data.password;

    /* db.findUser('User', {username: username}, function (err, user) {
        if (err || !user) return callback(new Error("User not found"));
        return callback(null, user.password == password);
    }); */
    console.log('a', username, password)
    return callback(null, user.password == password);
  },
  postAuthenticate(socket, data) {
    const username = data.username;
    console.log(data)

    console.log('b')
    socket.client.user = username;
    /*db.findUser('User', {username: username}, function (err, user) {
        socket.client.user = user;
    });*/
  },
  disconnect(socket) {
    console.log('断开连接')
    console.log(socket.id + ' disconnected');
  }
}
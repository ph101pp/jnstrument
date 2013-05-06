var io = require('socket.io').listen(8800);

io.sockets.on('connection', function (socket) {
  socket.on('__pca__', function (data) {
    	console.log(data);
  });
});
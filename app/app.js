var stylus = require('stylus');
var express = require('express')
var http = require("http");
var app = express();
var server = http.createServer(app)
var io = require('socket.io').listen(server);


app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware({ 
	src: __dirname + '/public', 
	compile: function(str, path){
	  return stylus(str).set('filename', path).use(require('nib')());
	}
}))
app.use(express.static(__dirname + '/public'))


app.get("/|/*", require("./proxyRequest.js"), function (req, res) {
  res.render('index',{ 
  	title : 'Home' 
  });
})


io.sockets.on('connection', function (socket) {
  socket.on('__pca__', function (data) {
      console.log(data);
  });
});



server.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});


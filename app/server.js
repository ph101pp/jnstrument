// Load/Start Dependencies
var stylus = require('stylus');
var browserify = require("browserify-middleware");
var express = require('express');
var http = require("http");
var app = express();
var server = http.createServer(app);

var eventHandler = require("./eventHandler.js")(server);
var proxy = require("./proxyRequest.js");

// Configure Express
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))


app.use(stylus.middleware({ 
	src: __dirname + '/public', 
	compile: function(str, path){
	  return stylus(str).set('filename', path).use(require('nib')());
	}
}))

app.use('/scripts', browserify('./public/scripts/jnstrument'));
app.use(express.static(__dirname + '/public'))


// Routes
app.get("/proxy", express.bodyParser(), require('connect-restreamer')(), function (req, res) {
    proxy.url(req, res);
})

app.get("/|/*", /*proxy.middleware,*/ function (req, res) {
  res.render('index', { 
    title : 'Home'  });
})


server.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});


var express = require('express'),
	stylus = require('stylus');
	proxy = require("./proxyServer/proxyServer2.js");
var app = express();

proxy(9000);

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

app.get('/', function (req, res) {
  res.render('index',{ 
  	title : 'Home' 
  });
})
app.listen(8000);
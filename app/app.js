var express = require('express');
var stylus = require('stylus');
var proxyRequest = require("./proxyServer.js");


var app = express();
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




app.get('/proxy', function (req, res) {
	//forwardRequest(req, res, proxy);
})


app.get("/|/*", proxyRequest, function (req, res) {
  res.render('index',{ 
  	title : 'Home' 
  });
})




app.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});


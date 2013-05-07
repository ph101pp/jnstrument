var express = require('express');
var stylus = require('stylus');

module.exports = function(port){
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

	app.get('/', function (req, res) {
	  res.render('index',{ 
	  	title : 'Home' 
	  });
	})
	app.listen(port, function () {
	  console.log("Express client waiting for requests at port "+port);
	});
}
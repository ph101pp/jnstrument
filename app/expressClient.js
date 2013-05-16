module.exports = function() {

	// Load/Start Dependencies
	var express = require('express');
	var stylus = require('stylus');
	var jadeify2 = require('jadeify2')
	var browserify = require("browserify-middleware").settings({ transform: ['jadeify2'] });
	var proxy = require("./proxyRequest.js");

	var app = express();

	// Configuration
	app.set('views', __dirname + '/views')
	app.set('view engine', 'jade')

	app.use(express.logger('dev'))
	app.use(stylus.middleware({ 
		src: __dirname + '/public', 
		compile: function(str, path){
		  return stylus(str).set('filename', path).use(require('nib')());
		}
	}))
	app.use('/scripts', browserify("./public/scripts/browserify"));
	// app.use(function(req, res, next){
	// 	res.setHeader('Access-Control-Allow-Origin', '*');
	// 	next();
	// });
	// app.get(/\/scripts\/client\.js/, browserify("./public/scripts/client.js"));
	// app.get(/\/scripts\/pca__ProxyInstrumentES5\.js/, browserify("./public/scripts/pca__ProxyInstrumentES5.js"));

	app.use(express.static(__dirname + '/public'))


	// Routes
	// app.get("/proxy", express.bodyParser(), require('connect-restreamer')(), function (req, res) {
	//     proxy.url(req, res);
	// })

	app.get(/\/........-....-4...-....-p....c.....a/, function (req, res) {
		res.render('visuals', { 
			title : 'Visual'  
		});
	});

	app.get(/\/|\/*/, /*proxy.middleware,*/ function (req, res) {
		res.render('index', { 
			title : 'Home'  
		});
	});

	return app;
}

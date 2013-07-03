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
	app.use('/scripts', browserify("./public/scripts/jnstrument"));
	// app.use(function(req, res, next){
	// 	res.setHeader('Access-Control-Allow-Origin', '*');
	// 	next();
	// });

	app.use(express.static(__dirname + '/public'))


	// Routes
	// app.get("/proxy", express.bodyParser(), require('connect-restreamer')(), function (req, res) {
	//     proxy.url(req, res);
	// })

	app.get(/\/d3\/........-....-4...-....-p....c.....a|\/d3\/installation/, function (req, res) {
		res.render('d3Visuals', { 
			title : 'Visual'  
		});
	});

	app.get(/\/gH\/........-....-4...-....-p....c.....a|\/gH\/installation/, function (req, res) {
		res.render('guitarHero', { 
			title : 'Guitar Hero'  
		});
	});

	app.get(/\/atom\/........-....-4...-....-p....c.....a|\/atom\/installation/, function (req, res) {
		res.render('atom', { 
			title : 'atom'  
		});
	});

	app.get(/\/base\/........-....-4...-....-p....c.....a|\/base\/installation/, function (req, res) {
		res.render('base', { 
			title : 'Base'  
		});
	});

	app.get(/\/curtain\/........-....-4...-....-p....c.....a|\/curtain\/installation/, function (req, res) {
		res.render('curtain', { 
			title : 'curtain'  
		});
	});

	app.get(/\/drop\/........-....-4...-....-p....c.....a|\/drop\/installation/, function (req, res) {
		res.render('drop', { 
			title : 'drop'  
		});
	});

	app.get(/\/radar\/........-....-4...-....-p....c.....a|\/radar\/installation/, function (req, res) {
		res.render('radar', { 
			title : 'Radar'  
		});
	});

	app.get(/\/lifeline\/........-....-4...-....-p....c.....a|\/lifeline\/installation/, function (req, res) {
		res.render('lifeline', { 
			title : 'Lifeline'  
		});
	});
	
	app.get(/\/proto\/........-....-4...-....-p....c.....a|\/proto\/installation/, function (req, res) {
		res.render('proto', { 
			title : 'prototypes'  
		});
	});

	app.get(/\/test\/........-....-4...-....-p....c.....a|\/test\/installation/, function (req, res) {
		res.render('test', { 
			title : 'test'  
		});
	});

	app.get(/\/|\/*/, /*proxy.middleware,*/ function (req, res) {
		res.render('index', { 
			title : 'Home'  
		});
	});

	return app;
}

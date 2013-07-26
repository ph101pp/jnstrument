module.exports = function() {

	// Load/Start Dependencies
	var express = require('express');
	var stylus = require('stylus');
	var jadeify2 = require('jadeify2')
	var browserify = require("browserify-middleware").settings({ transform: ['jadeify2'] });
	var url = require('url');
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

	// app.use(function(req, res, next){
	// 	res.setHeader('Access-Control-Allow-Origin', '*');
	// 	next();
	// });

	app.use(express.static(__dirname + '/public'))
	
	app.use('/scripts', browserify("./public/scripts/jnstrument"));

	// jnstrument.com google verifiation
	app.use('/googlef0f547244e0ab5b4.html',"./public/googlef0f547244e0ab5b4.html");


	// Routes
	// app.get("/proxy", express.bodyParser(), require('connect-restreamer')(), function (req, res) {
	//     proxy.url(req, res);
	// })


	app.get(/\/........-....-4...-....-p....c.....a\/atom|\/installation\/atom/, function (req, res) {
		res.render('atom', { 
			title : 'atom'  
		});
	});

	app.get(/\/........-....-4...-....-p....c.....a\/curtain|\/installation\/curtain/, function (req, res) {
		res.render('curtain', { 
			title : 'curtain'  
		});
	});

	app.get(/\/........-....-4...-....-p....c.....a\/drop|\/installation\/drop/, function (req, res) {
		res.render('drop', { 
			title : 'drop'  
		});
	});

	app.get(/\/........-....-4...-....-p....c.....a\/proto|\/installation\/proto/, function (req, res) {
		res.render('proto', { 
			title : 'prototypes'  
		});
	});	


// NEW

	// D3.js
	app.get(/\/........-....-4...-....-p....c.....a\/d3|\/installation\/d3/, function (req, res) {
		res.render('D3Visuals', { 
			title : 'First Visual'  
		});
	});

	// THREE.js
	app.get(/\/(........-....-4...-....-p....c.....a|installation)\/(neuron|radar|lifeline|guitarHero)/, function (req, res) {

		var data = url.parse(req.url).pathname.match(/\/(........-....-4...-....-p....c.....a|installation)\/(neuron|radar|lifeline|guitarHero)/);

		res.render("THREEVisuals", { 
			title : data[2].charAt(0).toUpperCase() + data[2].slice(1),
			show : data[2],
			guid : data[1]
		});
	});

	// jnstrument.com
	app.get(/\/|\/*/, /*proxy.middleware,*/ function (req, res) {
		res.render('index', {});
	});

	return app;
}

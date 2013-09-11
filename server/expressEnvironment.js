module.exports = function() {

	// Load/Start Dependencies
	var config = require("./public/scripts/jnstrument/config.js");
	var express = require('express');
	var stylus = require('stylus');
	var jadeify2 = require('jadeify2')
	var browserify = require("browserify-middleware").settings({ transform: ['jadeify2'] });
	var proxy = require("./proxyRequest.js");

	var app = express();

	var bgImage=0;
	var bgImages = ["lifeline", "lifeline1", "lifeline2", "lifeline3", "neuron", "neuron1", "neuron2", "neuron3", "neuron4", "radar", "radar1", "radar2"];
	
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
	app.get(/\/(........-....-4...-....-p....c.....a|installation)\/(d3)/, function (req, res) {
		res.render('D3Visuals', { 
			title : 'First Visual'  
		});
	});

	// THREE.js
	app.get(/\/(........-....-4...-....-p....c.....a|installation)\/(neuron|radar|lifeline|guitarHero|index)/, function (req, res) {
		var template = req.params[1] === "index" ? "index" : "THREEVisuals";
		var i = bgImage++;
		if(bgImage >= bgImages.length) bgImage=0;

		res.render(template, { 
			socketAdress : config.webAdress,
			title : req.params[1].charAt(0).toUpperCase() + req.params[1].slice(1),
			show : req.params[1],
			guid : req.params[0],
			bgImage : bgImages[i]
		});
	});

	// jnstrument.com
	app.get(/\/|\/*/, /*proxy.middleware,*/ function (req, res) {
		var i = bgImage++;
		if(bgImage >= bgImages.length) bgImage=0;	

		res.render('index', {
			socketAdress : config.webAdress,
			title : "jnstrument",
			show : "none",
			guid : "none",
			bgImage : bgImages[i]
		});
	});

	return app;
}

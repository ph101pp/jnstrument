var http = require("http");
var https = require("https");
var proxy = require("./proxyRequest.js");
var fs = require('fs');
var options = {
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
    };


var httpServer = http.createServer(function(req, res){
	proxy.go(req, res);
}).listen(8000);



var httpsServer = https.createServer(options, function(req, res){
	console.log(req.url);
	proxy.go(req, res);
}).listen(9000);

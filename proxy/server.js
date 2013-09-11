var http = require("http");
var proxy = require("./proxyRequest.js");
// var express = require('express')
// var app = express();

// app.use(express.logger('dev'))

// app.get("/|/*", /*proxy.middleware,*/ function (req, res) {
// 	proxy.go(req, res);

// })


// var server = http.createServer(function(req, res){
// 	proxy.go(req, res);

// }).listen(8000);


var server = http.createServer(function(req, res){
	http.request(req, function(_res){
		res = _res;
	}).end();
}).listen(8000);

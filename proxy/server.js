var http = require("http");
var proxy = require("./proxyRequest.js");

var server = http.createServer(function(req, res){
	proxy.go(req, res);
}).listen(8000);

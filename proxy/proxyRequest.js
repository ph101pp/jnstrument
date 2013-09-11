
var url = require('url');
var httpProxy = require('http-proxy');

var proxy = new httpProxy.RoutingProxy();

var proxyRequest = function(req, res, urlObj) {

	req.headers.host  = urlObj.host;
	req.url           = urlObj.path;
	
	proxy.proxyRequest(req, res, {
		host    : urlObj.hostname,
		port    : urlObj.port || 80,
		enable  : { xforward: true }
	});
}

proxy.on("error", function(exception, socket){
	console.log("ERROR", exception);
});

exports.middleware =  function(req, res, next) {
	var urlObj = url.parse(req.url);
	if(!urlObj.host || urlObj == "localhost") next();
	proxyRequest(req, res, urlObj);
}
exports.url = function(req, res, urlString){
	if(urlString) var urlObj = url.parse(urlString);
	else {
		var urlTemp = url.parse(req.url,true);
		console.log(urlTemp);
		var urlObj = url.parse("http://"+urlTemp.query.url); 
	}
	proxyRequest(res, req, urlObj);
}
exports.go = function(req, res){
	var urlObj = url.parse(req.url);
	proxyRequest(req,res,urlObj);
}

var url = require('url');
var httpProxy = require('http-proxy');
var http = require('http');

var proxy = new httpProxy.RoutingProxy();

var proxyRequest = function(res, req, urlObj) {
	
	


	req.headers.host  = urlObj.host;
	req.url           = urlObj.path;
	req.method		= "GET";
	
	proxy.proxyRequest(req, res, {
		host    : urlObj.hostname,
		port    : urlObj.port || 80,
		enable  : { xforward: true }
	});
}
proxy.on("clientError", function(exception, socket){
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
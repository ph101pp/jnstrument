
var httpProxy = require('http-proxy');
var url       = require('url');

var proxyServer = function(port){
	if(this === global) return new proxyServer(port); // has to be instanciated with new.

	this.port = port;

	httpProxy.createServer(function(req, res, proxy) {
		var urlObj = url.parse(req.url);
		// var urlObj = url.parse("http://www.posterkoenig.ch");

		req.headers.host  = urlObj.host;
		req.url           = urlObj.path;

		if(urlObj.host) 
			proxy.proxyRequest(req, res, {
				host    : urlObj.hostname,
				port    : urlObj.port || 80,
				enable  : { xforward: true }
			});		
		else
			proxy.proxyRequest(req, res, {
				host    : "www.google.ch",
				port    : 80,
				enable  : { xforward: true }
			});
	}).listen(port, function () {
		console.log("Proxy waiting for requests at port "+port);
	});
	return this;
}
module.exports = proxyServer;
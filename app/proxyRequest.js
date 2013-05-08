
var url       = require('url');
var httpProxy = require('http-proxy');

var proxyRequest = function(req, res, next) {
	var urlObj = url.parse(req.url);
	if(!urlObj.host) next();

	var proxy = new httpProxy.RoutingProxy();

	req.headers.host  = urlObj.host;
	req.url           = urlObj.path;
	
	proxy.proxyRequest(req, res, {
		host    : urlObj.hostname,
		port    : urlObj.port || 80,
		enable  : { xforward: true }
	});
}
module.exports = proxyRequest;
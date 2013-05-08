
var url       = require('url');
var httpProxy = require('http-proxy');

var proxy = new httpProxy.RoutingProxy();

var proxyRequest = function(req, res, next) {
	var urlObj = url.parse(req.url);
	if(!urlObj.host) next();

	req.headers.host  = urlObj.host;
	req.url           = urlObj.path;
	
	proxy.proxyRequest(req, res, {
		host    : urlObj.hostname,
		port    : urlObj.port || 80,
		enable  : { xforward: true }
	});
}
module.exports = proxyRequest;
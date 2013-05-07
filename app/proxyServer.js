
var httpProxy = require('http-proxy');
var url       = require('url');

var listensTo = undefined;

module.exports = function(port){
	listensTo = port;

	httpProxy.createServer(function(req, res, proxy) {
	  var urlObj = url.parse(req.url);

	  req.headers.host  = urlObj.host;
	  req.url           = urlObj.path;

	  console.log(urlObj.hostname, urlObj.port);

	 
	  proxy.proxyRequest(req, res, {
	    host    : urlObj.hostname,
	    port    : urlObj.port || 80,
	    enable  : { xforward: true }
	  });
	}).listen(listensTo, function () {
	  console.log("Proxy waiting for requests at port "+listensTo);
	});
	return this;
}

module.exports.listensTo = function(){
	return listensTo;
}

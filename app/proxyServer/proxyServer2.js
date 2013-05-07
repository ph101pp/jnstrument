
var httpProxy = require('http-proxy');
var url       = require('url');


module.exports = function(port){
	httpProxy.createServer(function(req, res, proxy) {
	  var urlObj = url.parse(req.url);

	  req.headers.host  = urlObj.host;
	  req.url           = urlObj.path;

	  console.log(urlObj.host);

	  proxy.proxyRequest(req, res, {
	    host    : urlObj.host,
	    port    : 80,
	    enable  : { xforward: true }
	  });
	}).listen(port, function () {
	  console.log("Proxy waiting for requests at port 9000");
	});
}

var proxyRequest = require("./proxyRequest");
var https = require('https');
var http = require('http');
var fs = require('fs');
var options = {
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
    };
var url       = require('url');



//HTTP
httpProxy.createServer(function(req, res, proxy) {
  var urlObj = url.parse(req.url);

  console.log("8000"+urlObj.host);
  req.headers.host  = urlObj.host;
  req.url           = urlObj.path;

  proxy.proxyRequest(req, res, {
    host    : urlObj.host,
    port    : 80,
    enable  : { xforward: true }
  });
}).listen(8000, function () {
  console.log("Waiting for requests... http 8000");
});



//HTTPS
httpProxy.createServer(options, function(req, res, proxy) {
  var urlObj = url.parse(req.url);

  console.log("9000"+urlObj.host);
  req.headers.host  = urlObj.host;
  req.url           = urlObj.path;

  proxy.proxyRequest(req, res, {
    host    : urlObj.host,
    port    : 443,
    enable  : { xforward: true }
  });
}).listen(9000, function () {
  console.log("Waiting for requests... https 9000");
});

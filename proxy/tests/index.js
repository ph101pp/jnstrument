var httpProxy = require('http-proxy');
var url       = require('url');

httpProxy.createServer(function(req, res, proxy) {
  var urlObj = url.parse(req.url);

  req.headers.host  = urlObj.host;
  req.url           = urlObj.path;

  proxy.proxyRequest(req, res, {
    host    : urlObj.host,
    port    : 80,
    enable  : { xforward: true }
  });
}).listen(9000, function () {
  console.log("Waiting for requests...");
});


// // Load the http module to create an http server.
// var http = require('http');

// // Configure our HTTP server to respond with Hello World to all requests.
// var server = http.createServer(function (request, response) {
//   response.writeHead(200, {"Content-Type": "text/plain"});
//   response.end("Hello World 2\n");
// });

// // Listen on port 8000, IP defaults to 127.0.0.1
// server.listen(8000);

// // Put a friendly message on the terminal
// console.log("Server running at http://127.0.0.1:8000/");
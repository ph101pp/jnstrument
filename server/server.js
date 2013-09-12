// Load/Start Dependencies
var http = require('http');
var express = require("./expressEnvironment.js")();
var server = http.createServer(express);
var eventHandler = require("./serverEventHandler.js")(server);

server.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});


// // HANDLE HTTPS
// var https = require('https');
// var httpProxy = require('http-proxy');
// var fs = require('fs');

// var options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// var proxy = new httpProxy.HttpProxy({
//   target: {
//     host: 'localhost', 
//     port: 8000
//   }
// });

// var httpsServer = https.createServer(options, function (req, res) {
	
// 	proxy.proxyRequest(req, res);
 	
//  // 	res.writeHead(301,
// 	// 	{Location: "http://www.google.com"}
// 	// );
// 	// res.end();
// }).listen(9000, function () {
// 	console.log("HTTPS client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 9000));
// });

// // httpsServer.on('upgrade', function (req, socket, head) {
// // 	proxy.proxyWebSocketRequest(req, socket, head);
// // });

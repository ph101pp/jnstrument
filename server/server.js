// Load/Start Dependencies
var https = require('https');
var http = require('http');
var fs = require('fs');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var express = require("./expressEnvironment.js")();
var server = http.createServer(express);
var socket = https.createServer(options);
var eventHandler = require("./serverEventHandler.js")(socket);

server.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});

socket.listen(process.env.VCAP_APP_PORT || 9000, function () {
  console.log("Socket waiting for requests at port "+ (process.env.VCAP_APP_PORT || 9000));
});


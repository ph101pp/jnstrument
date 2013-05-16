// Load/Start Dependencies
var http = require("http");
var express = require("./expressEnvironment.js")();
var server = http.createServer(express);
var eventHandler = require("./serverEventHandler.js")(server);


server.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});


// Load/Start Dependencies
var http = require("http");
var client = require("./expressClient.js")();
var server = http.createServer(client);
var eventHandler = require("./serverEventHandler.js")(server);


server.listen(process.env.VCAP_APP_PORT || 8000, function () {
  console.log("Express client waiting for requests at port "+ (process.env.VCAP_APP_PORT || 8000));
});


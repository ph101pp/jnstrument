var http = require('http'),
    httpProxy = require('http-proxy');


var proxyServerWithForwarding = httpProxy.createServer(9000, 'localhost', {
  forward: {
    port: 9000,
    host: 'staging.com'
  }
});
proxyServerWithForwarding.listen(80);
var httpProxy = require('http-proxy');
var url = require('url');
var http = require('http');
var https = require('https');

var proxy = new httpProxy.HttpProxy({target:{host: "localhost"} });
 
http.createServer(function(req, res) {
 
 //  var write = res.write,
      var   urlObj = url.parse(req.url);

 //  // res.write = function(data, encoding) {
 //  //   var str = data.toString();
 //  //   var scriptTag = '<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.min.js"></script>';
 //  //   str = str.replace(/(<head[^>]*>)/, "$1" + "\n" + scriptTag);
 //  //   data = new Buffer(str);
 //  //   write.call(this, data, encoding);
 //  // };
 
  console.log(urlObj);

  req.headers['host'] = urlObj.host;
  req.headers['url'] = urlObj.href;
  delete req.headers['accept-encoding'];



  proxy.proxyRequest(req, res, {
    target: {
      host: urlObj.host,
      port: 80
    },
    enable : {
     xforward: true // enables X-Forwarded-For
   }
  });
}).listen(9000, function () {
  console.log("Waiting for requests...");
});

    // host: urlObj.host,
    // port: 80,
    // changeOrigin : true,
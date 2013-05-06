var http = require('http'),
    httpProxy = require('http-proxy'),
    trumpet = require('trumpet');


httpProxy.createServer(function (req, res, proxy) {
  proxy.proxyRequest(req, res, {
     port: 80,
     host: req.headers.host,
     changeOrigin: true,
     enable : { xforward: true }
  });
}).listen(8001);


httpProxy.createServer(function(req, res, next){

  // var _write = res.write;
  // res.write = function(data){
  //     var tr = trumpet();

  //     tr.select('head', function (node) {
  //         node.html(function (html) {
  //             console.log(node.name + ': ' + html);
  //         });
  //     });

  //     tr.on('data', function (buf) { 
  //       _write.call(res, buf);
  //     });
  //     tr.write(data);

  // };
  next();

}, 8001, 'localhost').listen(9000);

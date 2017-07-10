require('babel-register')({
  ignore: /lib|node_modules/,
  cache: false
});
require('./test.js');
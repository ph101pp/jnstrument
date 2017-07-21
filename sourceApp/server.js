const register = require('babel-register').default;

console.log(register);
register({
  "ignore": [
    /lib|node_modules\/(?!lodash)|events.js/
  ],
  "cache": false,
  "plugins": [
    "module:jnstrument"
  ]
});
require('./index');



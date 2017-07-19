require('babel-register')({
  "ignore": /lib|node_modules\/(?!lodash)|events.js/,
  "cache": false,
  "plugins": [
    "jnstrument"
  ]
});
require('./index');



const _ = require('./lodash');

var object = {
  'a': 1,
  'c': {
      d: 1
    }
};
 
var other = {
  'b': 2
};

console.log(_.merge(object, other));
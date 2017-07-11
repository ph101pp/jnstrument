const _ = require('./lodash');


var object = {
  'a': 1
};
 
var other = {
  'b': 2
};

function test() {
  return 'hello';  
}
function tests() {
}


console.log(_.merge(object, other));
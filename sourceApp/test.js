/**
 * Paste or drop some JavaScript here and explore
 * the syntax tree created by chosen parser.
 * You can use all the cool new features from ES6
 * and even more. Enjoy!
 */

let tips = [
  "Click on any AST node with a '+' to expand it",

  "Hovering over a node highlights the \
   corresponding part in the source code",

  "Shift click on an AST node expands the whole substree"
];

function printTips() {
  const hello ="";
  tips.forEach((tip, i) => console.log(`Tip ${i}:` + tip));
  return "hello";
}
class bla {}
class test {
  	constructor(){}
	hello() {
    
    }
}

(()=>{
  jnstrument.callIn();
  const result = doit();
  jnstrument.callOut();
  return result;
})();
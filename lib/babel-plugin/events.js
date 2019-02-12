const nano = require('nano-time');
const pino = require('pino')({
  level: 'jnstrument',
  levelVal: 13,
  extreme: false,
  messageKey: 'jnstrumentEvent',
  base:null,
  timestamp: false
});

///////////////////////////////////////////////////////////////////////////////

module.exports = Events();

let scopeCounter = 0;
let namespace="";

///////////////////////////////////////////////////////////////////////////////

function Events( fileName ) {
  
  return {
    in: enterScope,
    out: exitScope,
    call: callScope,
    startNamespace: startNamespace,
    endNamespace: endNamespace,
  };

///////////////////////////////////////////////////////////////////////////////
  function callScope(inOut, functionId, scopeId, id){
    const time = nano();
    pino.info(`${namespace};${time};C-${inOut};${functionId};${scopeId};${id}`);
  }         
///////////////////////////////////////////////////////////////////////////////
  function enterScope(functionId, parentScopeId){
    const scopeId = ++scopeCounter;
    const time = nano();
    pino.info(`${namespace};${time};E;${functionId};${scopeId};${parentScopeId}`);
    return scopeId;
  }
///////////////////////////////////////////////////////////////////////////////       
  function exitScope(returns, functionId, scopeId){
    const time = nano();
    pino.info(`${namespace};${time};X;${functionId};${scopeId}`);
    return returns;
  }
///////////////////////////////////////////////////////////////////////////////
  function startNamespace(...namespaces){
    namespace = namespace.split('.')
      .concat(namespaces)
      .filter((value, index, self)=>self.indexOf(value) === index && value !== "")
      .join(".");
  }
///////////////////////////////////////////////////////////////////////////////
  function endNamespace(...namespaces){
    namespace = namespace
      .split(".")
      .filter((value)=>namespaces.indexOf(value)<0)
      .join(".");
  }
}
const nano = require('nano-time');
const pino = require('pino')({
  level: 'jnstrument',
  levelVal: 13,
  extreme: false,
  messageKey: 'jnstrumentEvent'
});

///////////////////////////////////////////////////////////////////////////////

module.exports = Events();

let scopeCounter = 0;

///////////////////////////////////////////////////////////////////////////////

function Events( fileName ) {
  
  return {
    in: enterScope,
    out: exitScope,
    call: callScope,
  };

///////////////////////////////////////////////////////////////////////////////
  function callScope(inOut, functionId, scopeId, id){
    const time = nano();
    pino.info(`${time};C-${inOut};${functionId};${scopeId};${id}`);
  }         
///////////////////////////////////////////////////////////////////////////////
         
  function enterScope(functionId, parentScopeId){
    const scopeId = ++scopeCounter;
    const time = nano();
    pino.info(`${time};E;${functionId};${scopeId};${parentScopeId}`);
    return scopeId;
  }
  
///////////////////////////////////////////////////////////////////////////////
         
  function exitScope(returns, functionId, scopeId){
    const time = nano();
    pino.info(`${time};X;${functionId};${scopeId}`);
    return returns;
  }
  
///////////////////////////////////////////////////////////////////////////////

}
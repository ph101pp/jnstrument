const nano = require('nano-time');
const pino = require('pino')({
  level: 'jnstrument',
  levelVal: 13,
  extreme: true,
  messageKey: 'jnstrumentEvent'
});

///////////////////////////////////////////////////////////////////////////////

module.exports = Events();

let scopeCounter = 0;

///////////////////////////////////////////////////////////////////////////////

function Events( fileName ) {
  
  return {
    i: enterScope,
    o: exitScope,
  };

///////////////////////////////////////////////////////////////////////////////
         
  function enterScope(functionId, parentScopeId){
    const scopeId = ++scopeCounter;
    const time = nano();
    pino.info(`${time};ENTER;${functionId};${scopeId};${parentScopeId}`);
    return scopeId;
  }
  
///////////////////////////////////////////////////////////////////////////////
         
  function exitScope(returns, functionId, scopeId){
    const time = nano();
    pino.info(`${time};EXIT;${functionId};${scopeId}`);
    return returns;
  }
  
///////////////////////////////////////////////////////////////////////////////

}
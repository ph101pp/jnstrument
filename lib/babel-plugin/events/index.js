const pino = require('pino')({
  level: 'jnstrument',
  levelVal: 13,
  extreme: true
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
    
    pino.info({'jnstrumentEvent': 'enter', functionId, scopeId, parentScopeId});
    return scopeId;
  }
  
///////////////////////////////////////////////////////////////////////////////
         
  function exitScope(returns, functionId, scopeId){
    pino.info({'jnstrumentEvent': 'exit', functionId, scopeId, 'return': !!returns});

    return returns;
  }
  
///////////////////////////////////////////////////////////////////////////////

}
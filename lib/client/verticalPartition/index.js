const verticalPartition = require('./verticalPartition.js');
const d3 = require('d3');

let callStck = [];
const times ={};
const data = d3.dsvFormat(';').parseRows(window.__DATA__).map((d)=>{
  const [ time, type, functionId, scopeId, parentScopeId ] = d;
  type === 'ENTER' ? callStck.push(scopeId) : callStck.pop();
  
  times[scopeId] = times[scopeId]>0 ? time - times[scopeId] : time; 
  
  d.unshift(callStck.slice());
  return d;
}).filter((d)=>d[2] === 'ENTER');


const stratos = d3.stratify()
  .id(([ stack, time, type, functionId, scopeId, parentScopeId ])=>stack.join('.'))
  .parentId(([ stack, time, type, functionId, scopeId, parentScopeId ])=>{    
    const parent = stack.slice();  
    parent.pop();
    const str = parent.join('.');
    return str;
  })
  (data);
  
const hierarchy = d3.hierarchy(stratos)
  .sum(function(d) { return times[d.data[4]]; });



verticalPartition(hierarchy, times);
const sunburst = require('./sunburst.js');
const d3 = require('d3');

let callStck = [];
let i = 0;
const data = d3.dsvFormat(';').parseRows(window.__DATA__).map((d)=>{
  d[1] === 'ENTER' ? callStck.push(++i) : callStck.pop();
  d.unshift(callStck.slice());
  return d;
}).filter((d)=>d[2] === 'ENTER');

// data.unshift([['root'], '0', 'ROOT', 'ROOT', '0', '']);

console.log(data);

const hierarchy = d3.stratify()
  .id(([ stack,  time, type, functionId, scopeId, parentScopeId ])=>stack.join('.'))
  .parentId(([ stack, time, type, functionId, scopeId, parentScopeId ])=>{
    // if(stack[0] ==='root') return '';
    
    const parent = stack.slice();  
    parent.pop();
    const str = parent.join('.');
    return str;
    // return str === '' ? 'root' : str;
  })
  (data);

console.log(hierarchy);
  
  
// window.__DATA__.forEach((eventRaw)=>{
//   const [ time, type, functionId, scopeId, parentScopeId ] = eventRaw.split(';');
 
//   if(type !== 'ENTER') return;
  


//   // // by scopeId
//   flatTree[scopeId] = flatTree[scopeId] || { name: functionId, children: [], size: 1 };
  
//   const parentId = typeof flatTree[parentScopeId] === 'undefined' ? 'root' : parentScopeId;
//   flatTree[parentId].children.push(scopeId);
  
//   // // by functionId
//   // scopes[scopeId] = functionId;
//   // flatTree[functionId] = flatTree[functionId] || { name: functionId, children: [], size: 0 };
  
//   // flatTree[functionId].size++
  
//   // const parentId = scopes[parentScopeId] || 'root';


//   // if(flatTree[parentId].children.indexOf(functionId) < 0) 
//   //   flatTree[parentId].children.push(functionId);
    

  
// });

// console.log(flatTree);
// const nestedTree = nestTree('root', flatTree);

// function nestTree(nodeId, nodes){
//   const node = nodes[nodeId];
//   return {
//     name: `${node.name} - ${node.size}`,
//     children: node.children.map((nodeId)=>nestTree(nodeId, nodes)),
//     size: node.size
//   };
// }

// console.log(nestedTree);

sunburst(hierarchy);

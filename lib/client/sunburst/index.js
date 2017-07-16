const sunburst = require('./sunburst.js');
const flatTree = {
  "root" : { name: 'root', children: [] }   
};
const scopes = {};


window.__DATA__.forEach((eventRaw)=>{
  const [ time, type, functionId, scopeId, parentScopeId ] = eventRaw.split(';');
 
  if(type !== 'ENTER') return;
  


  // // by scopeId
  flatTree[scopeId] = flatTree[scopeId] || { name: functionId, children: [], size: 1 };
  
  const parentId = typeof flatTree[parentScopeId] === 'undefined' ? 'root' : parentScopeId;
  flatTree[parentId].children.push(scopeId);
  
  // // by functionId
  // scopes[scopeId] = functionId;
  // flatTree[functionId] = flatTree[functionId] || { name: functionId, children: [], size: 0 };
  
  // flatTree[functionId].size++
  
  // const parentId = scopes[parentScopeId] || 'root';


  // if(flatTree[parentId].children.indexOf(functionId) < 0) 
  //   flatTree[parentId].children.push(functionId);
    

  
});

console.log(flatTree);
const nestedTree = nestTree('root', flatTree);

function nestTree(nodeId, nodes){
  const node = nodes[nodeId];
  return {
    name: `${node.name} - ${node.size}`,
    children: node.children.map((nodeId)=>nestTree(nodeId, nodes)),
    size: node.size
  };
}

console.log(nestedTree);

sunburst(nestedTree);

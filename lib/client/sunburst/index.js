const sunburst = require('./sunburst.js');
const flatTree = {
  "root" : { name: 'root', children: [] } 
};
const scopes = {};


window.__DATA__.forEach((eventRaw)=>{
  const [ time, type, functionId, scopeId, parentScopeId ] = eventRaw.split(';');
 
  if(type !== 'ENTER') return;
  
  scopes[scopeId] = functionId;
  
  // flatTree[scopeId] = flatTree[scopeId] || { name: functionId, children: [] };
  // flatTree[parentScopeId].children.push(scopeId);
  
  flatTree[functionId] = flatTree[functionId] || { name: functionId, children: [] };
  flatTree[functionId] = flatTree[functionId] || { name: functionId, children: [] };
  
  const parentId = scopes[parentScopeId] || 'root';
  
  if(flatTree[parentId].children.indexOf(functionId) < 0) 
    flatTree[parentId].children.push(functionId);

  
});

console.log(flatTree);
const nestedTree = nestTree('root', flatTree);

function nestTree(nodeId, nodes){
  const node = nodes[nodeId];
  return {
    name: node.name,
    children: node.children.map((nodeId)=>nestTree(nodeId, nodes)),
    size: 1
  };
}

console.log(nestedTree);

sunburst(nestedTree);

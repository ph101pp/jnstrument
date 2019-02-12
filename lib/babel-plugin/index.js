/* 
http://astexplorer.net/#/gist/4bdbaedabd939ef702b7036d87b2bba1/e1374b619c559bf2d0c6f84bcfac2483d366bd94
*/
const { default:generate } = require("babel-generator");
const startNamespaceRegex=/^\s*jnstrument\.([\.\w]+)\s*$/;
const endNamespaceRegex=/^\s*\/jnstrument\.([\.\w]+)\s*$/;

module.exports = jnstrumentVisitor;

///////////////////////////////////////////////////////////////////////////////

function jnstrumentVisitor({ types: t }) {
  ///////////////////////////////////////////////////////////////////////////////
  function createEnterEvent(ids) {
    const params = [
      ids.functionId, 
      ids.parent
    ];
    return t.variableDeclaration('const', [
      t.variableDeclarator(
        ids.currentScopeId, 
        t.callExpression(
          t.memberExpression(ids.event, t.identifier('in')), 
          params
        )
      )
    ]);
  }
  ///////////////////////////////////////////////////////////////////////////////
  function createExitEvent(ids, returns) {
    const params = [
      returns || t.identifier('undefined'), 
      ids.functionId, 
      ids.currentScopeId
    ];
    return t.callExpression(
      t.memberExpression(ids.event, t.identifier('out')), 
      params
    );
  }
  ///////////////////////////////////////////////////////////////////////////////
  function createStartNamespace(ids, namespaces) {
    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(ids.event, t.identifier('startNamespace')), 
        namespaces
      )
    );
  }    
  ///////////////////////////////////////////////////////////////////////////////
  function createEndNamespace(ids, namespaces) {
    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(ids.event, t.identifier('endNamespace')), 
        namespaces
      )
    );
  }
  ///////////////////////////////////////////////////////////////////////////////
  function createCallEvent(path, ids, returns) {
    const returnsVariable = path.scope.generateUidIdentifier('returns')
    return t.callExpression(
      t.arrowFunctionExpression([], t.blockStatement([
        t.expressionStatement(t.callExpression(
          t.memberExpression(ids.event, t.identifier("call")), 
          [
            t.stringLiteral("in"),
            ids.functionId,
            ids.currentScopeId,
            ids.id,
          ]
        )),
        t.variableDeclaration('const', [
          t.variableDeclarator(
            returnsVariable, 
            returns
          )
        ]),
        t.expressionStatement(t.callExpression(
          t.memberExpression(ids.event, t.identifier("call")), 
          [
            t.stringLiteral("out"),
            ids.functionId,
            ids.currentScopeId,
            ids.id,
          ]
        )),
        t.returnStatement(returnsVariable)
      ])),
      []
    );
  }
  ///////////////////////////////////////////////////////////////////////////////
  const ProgramVisitor = {
    Statement(path){
      const addNamespaces=[];
      path.node.leadingComments &&path.node.leadingComments.forEach((comment)=>{
        const match = comment.value.match(startNamespaceRegex);
        if(match) {
          const statements = match[1]
            .split(".")
            .map((nameSpace)=>t.stringLiteral(nameSpace));
          addNamespaces.push(...statements);
        }
      });  
      const removeNamespaces=[];
      path.node.trailingComments && path.node.trailingComments.forEach((comment)=>{
        const match = comment.value.match(endNamespaceRegex);
        if(match) {
          const statements = match[1]
            .split(".")
            .map((nameSpace)=>t.stringLiteral(nameSpace));
          removeNamespaces.push(...statements);
        }
      });
      
      if(addNamespaces.length > 0) {
        path.insertBefore(createStartNamespace(this.ids, addNamespaces));
      }
      if(removeNamespaces.length > 0) {
        path.insertAfter(createEndNamespace(this.ids, removeNamespaces));  
      }      
    },
  ///////////////////////////////////////////////////////////////////////////////
    Program(path) {
      // create unique event identifier
      const ids = {
        event: path.scope.generateUidIdentifier('jnstrument'),
        parent: t.numericLiteral(0),
        currentScopeId: path.scope.generateUidIdentifier('scope'),
        functionId: t.stringLiteral(this.file.opts.filename)
      };
      
      // create & add jnstrument event module
      const requireStatement = t.variableDeclaration('const', [
        t.variableDeclarator(ids.event, t.callExpression(t.identifier('require'), [t.stringLiteral('jnstrument/events')]))
      ]);

      path.node.body.unshift(createEnterEvent(ids));
      path.node.body.unshift(requireStatement);
      path.node.body.push(t.expressionStatement(createExitEvent(ids)));

      // Stop program body from being processed
      path.skip();
      // kick of processing of program body with new context.
      path.traverse(ProgramVisitor, {
        ids: { 
          event: ids.event, 
          parent: ids.currentScopeId, 
          parentFunctionId: ids.functionId 
        } 
      });
    },
///////////////////////////////////////////////////////////////////////////////
    ArrowFunctionExpression(path) {
      // Create function body if arrow function insta-returns.
      if (path.node.body.type !== 'BlockStatement') {
        path.node.body = t.blockStatement([
          t.returnStatement(path.node.body)
        ]);
      }
    },
///////////////////////////////////////////////////////////////////////////////
    Function(path) {
      const body = path.node.body.body;
      const name = path.node.key && path.node.key.name ||
        path.node.id && path.node.id.name || 'f';
      
      this.ids.currentScopeId = path.scope.generateUidIdentifier('scope');
      this.ids.functionId = t.stringLiteral(name+'_'+Math.random().toString(36).substr(2, 4));

      // jnstrument function body
      body.unshift(createEnterEvent(this.ids));
      body.push(t.expressionStatement(createExitEvent(this.ids)));

      // stop function body from being processed 
      path.skip();
      // kick of processing of function body with new context.
      path.traverse(ProgramVisitor,  { 
        ids: { 
          event: this.ids.event, 
          parentFunctionId: this.ids.functionId, 
          parent: this.ids.currentScopeId 
        } 
      });
    },
///////////////////////////////////////////////////////////////////////////////
    ReturnStatement(path) {
      // wrap return statements
      path.node.argument = createExitEvent({ 
        event: this.ids.event, 
        functionId: this.ids.parentFunctionId, 
        currentScopeId: this.ids.parent 
      }, path.node.argument);
    },
///////////////////////////////////////////////////////////////////////////////
    CallExpression: {
      exit(path) {
        if(
          // Is not a call to an jnstrument functions
          (
            path.node.callee.type === "MemberExpression" &&
            path.node.callee.object === this.ids.event 
          ) 
          // Is not the initial jnstrument/events require statement
          || ( 
            path.parentPath.node.type === "VariableDeclarator" &&
            path.parentPath.parentPath.node.type === "VariableDeclaration" &&
            path.parentPath.parentPath.node.declarations.length === 1 &&
            path.parentPath.node.id === this.ids.event
          )
        ) return;
                
        path.replaceWith(createCallEvent( path, { 
          id: t.stringLiteral(`"${generate(path.node.callee).code}"`),
          event: this.ids.event, 
          functionId: this.ids.parentFunctionId, 
          currentScopeId: this.ids.parent
        }, path.node));
        
        // Stop newly inserted CallEvent arrow-function from being processed
        path.skip();
      }
    },
///////////////////////////////////////////////////////////////////////////////
    ClassBody(path) {
      // Return if constructor already exists return
      if (path.node.body.find((node, i) => node.kind === 'constructor')) return;

      // Add constructor with super call to class body.
      const superCall = t.expressionStatement(
        t.callExpression(t.memberExpression(t.identifier('super'), t.identifier('apply')), [t.nullLiteral(), t.identifier('arguments')])
      );
      const constructor = t.classMethod('constructor', t.identifier('constructor'), [], t.blockStatement([superCall]));
      path.node.body.unshift(constructor);
    },
  };

  return {
    name: 'jnstrument', // not required
    visitor: ProgramVisitor
  };
}

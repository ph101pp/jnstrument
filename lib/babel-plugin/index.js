// http://astexplorer.net/#/gist/4bdbaedabd939ef702b7036d87b2bba1/e1374b619c559bf2d0c6f84bcfac2483d366bd94

module.exports = jnstrumentVisitor;

///////////////////////////////////////////////////////////////////////////////

function jnstrumentVisitor(babel) {
  const { types: t } = babel;

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
  
  function createCallEvent(path, ids, returns) {
    const returnsVariable = path.scope.generateUidIdentifier('returns')
    return t.callExpression(
      t.arrowFunctionExpression([], t.blockStatement([
        t.expressionStatement(t.callExpression(
          t.memberExpression(ids.event, t.identifier("call")), 
          [
            t.stringLiteral("in"),
            ids.functionId,
            ids.currentScopeId
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
            ids.currentScopeId
          ]
        )),
        t.returnStatement(returnsVariable)
      ])),
      []
    );
  }
  
  function isJnstrumentCallExpression(node, event){
    return (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.type === "MemberExpression" &&
      node.expression.callee.object === event &&
      node.expression.callee.property.name === "call"
    ); 
  }

  const ProgramVisitor = {
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
      
      // if not an jnstrument call-wrapper
      if(
        body.length > 0 && 
        isJnstrumentCallExpression(body[0], this.ids.event )
      ) return;
        
      const name = path.node.key && path.node.key.name ||
        path.node.id && path.node.id.name ||
        'f';
      
      // attach function name to function so it wont get regenerated (probably not necessary)
      if (path.node.id === null) {
        path.node.id = t.identifier(name);
      };
      
      this.ids.currentScopeId = path.scope.generateUidIdentifier('scope');
      this.ids.functionId = t.stringLiteral(name+'_'+Math.random().toString(36).substr(2, 4));

      // jnstrument function body
      body.unshift(createEnterEvent(this.ids));

      // set exit event handler if no return statement is found
      if(!body.find(node => node.type === 'ReturnStatement'))
        body.push(t.expressionStatement(createExitEvent(this.ids)));


      // stop function body from being processed 
      path.skip();
      // kick of processing of function body with new context.
      path.traverse(ProgramVisitor, 
        { 
          ids: { 
            event: this.ids.event, 
            parentFunctionId: this.ids.functionId, 
            parent: this.ids.currentScopeId 
          } 
        }
      );
    },
///////////////////////////////////////////////////////////////////////////////
    ReturnStatement(path) {
      // if not in the jnstrument call-wrapper
      if(
        path.parentPath.node.type === "BlockStatement" &&
        isJnstrumentCallExpression(path.parentPath.node.body[0], this.ids.event )
      ) return;
        
      // wrap return statements
      path.node.argument = createExitEvent({ 
        event: this.ids.event, 
        functionId: this.ids.parentFunctionId, 
        currentScopeId: this.ids.parent 
      }, path.node.argument);
    },
///////////////////////////////////////////////////////////////////////////////
    CallExpression(path){
      if(
        // Is not a call to jnstrument functions
        (
          path.node.callee.type === "MemberExpression" &&
          path.node.callee.object === this.ids.event 
        ) 
        // Is not a wrapper arrow function call (()=>{})()
        || (
          path.node.callee.type === "ArrowFunctionExpression" &&
          path.node.callee.body.body.length > 0 &&
          isJnstrumentCallExpression(path.node.callee.body.body[0], this.ids.event )
        ) 
        // Isn't already wrapped
        || ( 
          path.parentPath.node.type === "VariableDeclarator" &&
          path.parentPath.parentPath.node.type === "VariableDeclaration" &&
          path.parentPath.parentPath.parentPath.node.type === "BlockStatement" &&
          isJnstrumentCallExpression(path.parentPath.parentPath.parentPath.node.body[0], this.ids.event )
        )
        // Isn't the jnstrument/events require statement
        || ( 
          path.parentPath.node.type === "VariableDeclarator" &&
          path.parentPath.parentPath.node.type === "VariableDeclaration" &&
          path.parentPath.parentPath.node.declarations.length === 1 &&
          path.parentPath.node.id === this.ids.event
        )
      ) return;
      
      path.replaceWith(createCallEvent( path, { 
        event: this.ids.event, 
        functionId: this.ids.parentFunctionId, 
        currentScopeId: this.ids.parent 
      }, path.node));
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
    visitor: {
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

        // kick off ProgramVisitor to instrument the file
        path.traverse(ProgramVisitor, {
          ids: { 
            event: ids.event, 
            parent: ids.currentScopeId, 
            parentFunctionId: ids.functionId 
          } 
        });
      }
    }
  };
}

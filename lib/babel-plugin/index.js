// http://astexplorer.net/#/gist/4bdbaedabd939ef702b7036d87b2bba1/e1374b619c559bf2d0c6f84bcfac2483d366bd94

module.exports = jnstrumentVisitor;

///////////////////////////////////////////////////////////////////////////////

function jnstrumentVisitor(babel) {
  const { types: t } = babel;

  function createEnterEvent(ids) {
    const params = [ ids.functionId, ids.parent ];
    return t.variableDeclaration('const', [
      t.variableDeclarator(ids.currentScopeId, t.callExpression(t.memberExpression(ids.event, t.identifier('i')), params))
    ]);
  }
  
  function createExitEvent(ids, returns) {
    const params = [returns || t.identifier('undefined'), ids.functionId];
    return t.callExpression(t.memberExpression(ids.event, t.identifier('o')), params);
  }
  
  const ProgramVisitor = {
    Function(path) {
      // Create function body if arrow function with insta-return.
      if (path.node.body.type !== 'BlockStatement') {
        path.node.body = t.blockStatement([t.returnStatement(path.node.body)]);
      }
      
      this.ids.currentScopeId = path.scope.generateUidIdentifier('s');
      this.ids.functionId = t.stringLiteral(Math.random().toString(36).substr(2, 8));

      // jnstrument function body
      const body = path.node.body.body;
      body.unshift(createEnterEvent(this.ids));

      // set exit event handler if no return statement is found
      !body.find((node)=>node.type === 'ReturnStatement') && body.push(t.expressionStatement(createExitEvent(this.ids)));
      
      path.skip();
      path.traverse(ProgramVisitor, { ids: { event: this.ids.event, parentFunctionId: this.ids.functionId, parent: this.ids.currentScopeId } });
    },
    ReturnStatement(path) {
      // wrap return statements
      path.node.argument = createExitEvent( { event: this.ids.event, functionId: this.ids.parentFunctionId, currentScopeId: this.ids.parent }, path.node.argument);
    }
  };

  return {
    name: 'jnstrument', // not required
    visitor: {
      Program(path) {
        // create unique event identifier
        const ids = {
          event: path.scope.generateUidIdentifier('j'),
          parent: t.numericLiteral(0),
          currentScopeId: path.scope.generateUidIdentifier('s'),
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
        path.traverse(ProgramVisitor, { ids: { event: ids.event, parent: ids.currentScopeId, parentFunctionId: ids.functionId } });
      },
      ClassBody(path) {
        // Return if constructor already exists return
        if (path.node.body.find((node, i) => node.kind === 'constructor')) return;
  
        // Add constructor with super call to class body.
        const superCall = t.expressionStatement(
          t.callExpression(t.memberExpression(t.identifier('super'), t.identifier('apply')), [t.nullExpression(), t.identifier('arguments')])
        );
        const constructor = t.classMethod('constructor', t.identifier('constructor'), [], t.blockStatement([superCall]));
        path.node.body.unshift(constructor);
      }
    }
  };
}

// http://astexplorer.net/#/gist/4bdbaedabd939ef702b7036d87b2bba1/e1374b619c559bf2d0c6f84bcfac2483d366bd94

module.exports = jnstrumentVisitor;

///////////////////////////////////////////////////////////////////////////////

function jnstrumentVisitor(babel) {
  const { types: t } = babel;

  function createJnstrumentation(id, name, ...otherParams) {
    return t.callExpression(id, [t.stringLiteral(name), ...otherParams]);
  }

  const ProgramVisitor = {
    Function(path) {
      // Create function body if arrow function with insta-return.
      if (path.node.body.type !== "BlockStatement") {
        path.node.body = t.blockStatement([t.returnStatement(path.node.body)]);
      }

      // jnstrument function body
      const body = path.get("body");
      body.unshiftContainer("body", t.expressionStatement(createJnstrumentation(this.eventIdentifier, "start")));
      body.pushContainer("body", t.expressionStatement(createJnstrumentation(this.eventIdentifier, "end")));
    },
    ClassBody(path) {
      // Return if constructor already exists return
      if (path.node.body.find((node, i) => node.kind === "constructor")) return;

      // Add constructor with super call to class body.
      const superCall = t.expressionStatement(
        t.callExpression(t.memberExpression(t.identifier("super"), t.identifier("apply")), [t.thisExpression(), t.identifier("arguments")])
      );
      const constructor = t.classMethod("constructor", t.identifier("constructor"), [], t.blockStatement([superCall]));
      path.node.body.unshift(constructor);
    },
    ReturnStatement(path) {
      // wrap return statements
      path.node.argument = createJnstrumentation(this.eventIdentifier, "return", path.node.argument);
    }
  };

  return {
    name: "jnstrument", // not required
    visitor: {
      Program(path) {
        // create unique event identifier
        const identifier = path.scope.generateUidIdentifier("jnstrument");
        
        // create & add jnstrument event module
        const requireStatement = t.variableDeclaration("const", [
          t.variableDeclarator(identifier, t.callExpression(t.identifier("require"), [t.stringLiteral("jnstrument/babel-plugin/event")]))
        ]);
        path.node.body.unshift(requireStatement);

        // kick off ProgramVisitor to instrument the file
        path.traverse(ProgramVisitor, { eventIdentifier: identifier });
      }
    }
  };
}

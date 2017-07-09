module.exports = jnstrumentVisitor;

///////////////////////////////////////////////////////////////////////////////

function jnstrumentVisitor(babel) {
  const { types: t } = babel;

  function createJnstrumentation(name, ...otherParams) {
    return t.callExpression(t.identifier("jnstrument"), [t.stringLiteral(name), ...otherParams]);
  }

  return {
    name: "jnstrument", // not required
    visitor: {
      Function(path) {
        // Create function body if arrow function with insta-return.
        if (path.node.body.type !== "BlockStatement") {
          path.node.body = t.blockStatement([t.returnStatement(path.node.body)]);
        }

        // jnstrument function body
        const body = path.get("body");
        body.unshiftContainer("body", t.expressionStatement(createJnstrumentation("start")));
        body.pushContainer("body", t.expressionStatement(createJnstrumentation("end")));
      },
      ClassBody(path) {
        // Return if constructor already exists return
        if (path.node.body.find((node, i) => node.kind === "constructor")) return;

        // Add constructor with super call to class body.
        const superCall = t.expressionStatement(
          t.callExpression(t.memberExpression(t.identifier("super"), t.identifier("apply")), [
            t.thisExpression(),
            t.identifier("arguments")
          ])
        );
        const constructor = t.classMethod("constructor", t.identifier("constructor"), [], t.blockStatement([superCall]));
        path.node.body.unshift(constructor);
      },
      ReturnStatement(path) {
        // wrap return statements
        path.node.argument = createJnstrumentation("return", path.node.argument);
      }
    }
  };
}
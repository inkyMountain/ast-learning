const parseFile = require('../util/parseFile.js');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generate = require('@babel/generator').default;
const { promises: fs } = require('fs');

parseFile('src/source/source2.js')
  .then((ast) => {
    traverse(ast, {
      enter(astPath) {
        if (types.isObjectExpression(astPath)) {
          const properties = astPath.node.properties;
          properties.forEach((property, index, array) => {
            if (!types.isObjectProperty(property)) return;

            const {
              value: { params, body },
              key: { name },
            } = property;
            const method = types.objectMethod(
              'method',
              types.identifier(name),
              params,
              body
            );
            array[index] = method;
          });
          astPath.node.properties = properties;
        }
      },
    });

    const output = generate(ast).code;
    return fs.writeFile('./src/output/practice2-output.ts', output);
  })
  .then((error) => {
    console.log('error', error);
  });

const parseFile = require('../util/parseFile.js');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generate = require('@babel/generator').default;
const { promises: fs } = require('fs');

parseFile('src/source/source1.js')
  .then((ast) => {
    traverse(ast, {
      enter(astPath) {
        if (types.isVariableDeclaration(astPath)) {
          astPath.node.kind = 'const';
          astPath.node.declarations.forEach((declaration) => {
            declaration.id.typeAnnotation = types.typeAnnotation({
              type: 'StringTypeAnnotation',
            });
            declarationkind = 'const';
          });
        }
      },
    });

    const output = generate(ast).code;
    return fs.writeFile('./src/output/practice1-output.ts', output);
  })
  .then((isSuccess) => {
    console.log('isSuccess', isSuccess);
  });

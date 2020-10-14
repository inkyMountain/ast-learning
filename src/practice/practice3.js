const parseFile = require('../util/parseFile.js');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generate = require('@babel/generator').default;
const { promises: fs } = require('fs');
const prettier = require('prettier');

parseFile('src/source/source3.js')
  .then((ast) => {
    traverse(ast, {
      enter(astPath) {
        if (types.isFunctionDeclaration(astPath)) {
          const functionDeclaration = astPath.node;
          const { params } = functionDeclaration;
          params.typeAnnotation = types.typeAnnotation({
            type: 'ObjectTypeAnnotation',
            properties: [
              types.objectTypeProperty(types.identifier(''))
            ]
          })
        }
      },
    });

    const output = generate(ast).code;
    const formatedOutput = prettier.format(output, {
      parser: 'babel',
      semi: false,
      singleQuote: true,
    });
    return fs.writeFile('./src/output/practice1-output.ts', formatedOutput);
  })
  .then((isSuccess) => {
    console.log('isSuccess', isSuccess);
  });

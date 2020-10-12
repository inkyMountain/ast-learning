const parser = require('@babel/parser');
const { promises: fs } = require('fs');

const programEntry = async () => {
  const buffer = await fs.readFile('src/source.js');
  const jsContent = buffer.toString();
  const ast = parser.parse(jsContent, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'asyncGenerators',
      'decorators-legacy',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'objectRestSpread',
      'classProperties',
    ],
  });
  console.log('ast', ast);
};

programEntry();

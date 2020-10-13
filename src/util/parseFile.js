const { promises: fs } = require('fs');
const parser = require('@babel/parser');

const parseFile = async (path) => {
  const buffer = await fs.readFile(path);
  const fileContent = buffer.toString();
  return parser.parse(fileContent, {
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
};

module.exports = parseFile;

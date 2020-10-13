const { parse } = require('@babel/parser');
const { promises: fs } = require('fs');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const programEntry = async () => {
  const buffer = await fs.readFile('src/source.js');
  const jsContent = buffer.toString();
  const ast = parse(jsContent, {
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

  const contentCache = {
    importDeclaration: '',
    components: '',
    data: '',
    methods: '',
    lifeCycles: '',
  };

  traverse(ast, {
    enter(astPath) {
      // 外层import部分语句
      if (types.isImportDeclaration(astPath)) {
        // 外层变量处理
        contentCache.importDeclaration += generate(astPath.node).code;
      } else if (types.isVariableDeclaration(astPath)) {
        // 判断如果是类属性
      } else if (types.isClassProperty(astPath)) {
        // 判断如果是类方法
      } else if (types.isClassMethod(astPath)) {
      }
    },
  });
  console.log('contentCache', contentCache);
};

programEntry();

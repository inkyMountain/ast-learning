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
    methods: types.objectExpression([]),
    lifeCycles: [],
  };

  const lifeCycleNames = ['onLoad', 'onShow', 'onHide'];

  traverse(ast, {
    enter(astPath) {
      // 外层import部分语句
      if (types.isImportDeclaration(astPath)) {
        contentCache.importDeclaration += generate(astPath.node).code;
      } else if (types.isVariableDeclaration(astPath)) {
      } else if (types.isClassProperty(astPath)) {
        const propertyName = astPath.node.key.name;
        switch (propertyName) {
          case 'components':
          case 'data':
            contentCache[propertyName] = astPath.node.value;
            break;
          // 由于需要将 events 和 methods 中的方法，
          // 最终输出到 Vue 组件对象的 methods 属性中，
          // 所以将 events 和 methods 中的方法，
          // 合并入 contentCache 的 methods 中。
          case 'events':
            contentCache.methods.properties = [
              ...contentCache.methods.properties,
              ...astPath.node.value.properties,
            ];
            break;
          case 'methods':
            const originalProperties = contentCache.methods.properties;
            contentCache.methods = astPath.node.value;
            contentCache.methods.properties = [
              ...originalProperties,
              ...astPath.node.value.properties,
            ];
            break;
          default:
            break;
        }
      } else if (types.isClassMethod(astPath)) {
        const node = astPath.node;
        const methodName = node.key.name;
        const isLifeCycle = lifeCycleNames.includes(methodName);
        isLifeCycle
          ? contentCache.lifeCycles.push(node)
          : contentCache.methods.properties.push(node);
      }
    },
  });
  // console.log('contentCache', contentCache);

  const result = cacheToOutput(contentCache);
  await fs.writeFile('./output.js', result);
};

const cacheToOutput = (cache) => {
  let output = cache.importDeclaration;
  delete cache.importDeclaration;
  delete cache.lifeCycles;

  return Object.keys(cache).reduce((result, key) => {
    const astNode = cache[key];
    const generated = generate(astNode);
    return result + generated.code;
  }, output);
};

programEntry();

import { parse } from '@babel/parser';
import { promises as fs } from 'fs';
import * as types from '@babel/types';
import traverse from '@babel/traverse';

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

  traverse(ast, {
    enter(astPath) {
      // 外层import部分语句
      if (types.isImportDeclaration(astPath)) {
        console.log('astPath', astPath, '\n\n\n\n\n\n\n\n\n');
        // 外层变量处理
      } else if (types.isVariableDeclaration(astPath)) {
        // 判断如果是类属性
      } else if (types.isClassProperty(astPath)) {
        // 判断如果是类方法
      } else if (types.isClassMethod(astPath)) {
      }
    },
  });
};

programEntry();

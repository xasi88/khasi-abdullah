import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const cssImport = /^@import\s+url\(['"](.+?)['"]\)\s+layer\((\w+)\);$/;
const jsImport = /^import\s*\{([^}]*)\}\s*from\s*['"](.+?)['"];?[ \t\r]*$/gm;
const jsExport = /^export\s+((?:async\s+)?function\*?\s+|const\s+|let\s+|class\s+)(\w+)/gm;

// Склеивает main.css и его @import в один текст: браузер не ждёт каждый файл стилей отдельно.
export async function bundleCss(entryPath) {
  const folder = dirname(entryPath);
  const parts = [];

  for (const line of (await readFile(entryPath, 'utf8')).split(/\r?\n/)) {
    const rule = line.trim().match(cssImport);

    if (!rule) {
      if (line.trim().startsWith('@import')) throw new Error(`Не удалось разобрать строку в main.css: ${line}`);
      parts.push(line);
      continue;
    }

    const css = (await readFile(resolve(folder, rule[1]), 'utf8')).trim();

    if (/@import|url\((?!["']?(?:data:|#|%23))/.test(css)) {
      throw new Error(`${rule[1]}: вложенный @import и url() на файлы не поддерживаются — стили встраиваются в index.html.`);
    }

    parts.push(`@layer ${rule[2]} {\n${css}\n}`);
  }

  return parts.join('\n').trim();
}

// Склеивает ES-модули в один сценарий. Каждый модуль остаётся в своей области видимости.
export async function bundleJs(entryPath) {
  const chunks = new Map();
  const visiting = new Set();

  async function add(filePath) {
    if (chunks.has(filePath)) return chunks.get(filePath).id;
    if (visiting.has(filePath)) throw new Error(`Циклический import: ${filePath}`);
    visiting.add(filePath);

    const source = await readFile(filePath, 'utf8');
    const exported = [...source.matchAll(jsExport)].map((match) => match[2]);
    let code = source.replace(jsExport, '$1$2');

    for (const [statement, names, specifier] of source.matchAll(jsImport)) {
      const dependency = await add(resolve(dirname(filePath), specifier));
      code = code.replace(statement, () => `const {${names}} = ${dependency};`);
    }

    if (/^\s*(?:import|export)\b/m.test(code)) {
      throw new Error(`${filePath}: сборка понимает только «import { имя } from './файл.js'» и «export function|const|let|class».`);
    }

    const id = `module${chunks.size}`;
    chunks.set(filePath, { id, code: `const ${id} = (() => {\n${code.trim()}\nreturn { ${exported.join(', ')} };\n})();` });
    visiting.delete(filePath);
    return id;
  }

  await add(entryPath);
  const bundle = [...chunks.values()].map((chunk) => chunk.code).join('\n\n');

  try {
    new Function(`'use strict';\n${bundle}`);
  } catch (error) {
    throw new Error(`Собранный сценарий не разбирается: ${error.message}`);
  }

  return bundle;
}

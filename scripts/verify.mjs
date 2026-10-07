import { access, readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { projectRoot as root, renderPage } from './render.mjs';

const MAX_LINES = 150;
const EARLY_NOTICE_BUDGET = 2048;
const requiredFiles = [
  'index.html',
  'src/styles/main.css',
  'src/js/main.js',
  'assets/images/community.webp',
  'assets/images/valerik-documentary.jpg',
  'docs/DOCUMENTATION-INDEX.md',
  'PROJECT-STATUS.md'
];

const listFiles = async (dir) => (await readdir(resolve(root, dir), { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => relative(root, resolve(entry.parentPath, entry.name)).replaceAll('\\', '/'));

for (const file of requiredFiles) {
  await access(resolve(root, file));
}

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
const localAnchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
const missingAnchors = localAnchors.filter((anchor) => !ids.has(anchor));

if (missingAnchors.length) {
  throw new Error(`Якоря без цели: ${missingAnchors.join(', ')}`);
}

if (html.includes('href="#"')) {
  throw new Error('Найдена пустая ссылка href="#". Используйте настоящую цель или уберите ссылку.');
}

// Git на Windows может заменить переводы строк при checkout — сравниваем без учёта этого.
const sameLineEndings = (text) => text.replaceAll('\r\n', '\n');

if (sameLineEndings(html) !== sameLineEndings(await renderPage())) {
  throw new Error('index.html отстал от исходников в src/ — запустите npm run build.');
}

if (/<link[^>]+rel="stylesheet"|<script[^>]+\ssrc=/.test(html)) {
  throw new Error('Стили и сценарии встраиваются в index.html: <link rel="stylesheet"> и <script src> не используйте.');
}

// Предупреждение о сети должно дойти до посетителя раньше всего остального, даже если загрузка оборвётся.
const noticeStart = html.indexOf('data-network-notice');
const noticeEnd = html.indexOf('</script>', noticeStart) + '</script>'.length;
const earlyBytes = gzipSync(html.slice(0, noticeEnd)).length;

if (noticeStart < 0 || noticeEnd > html.indexOf('@layer tokens')) {
  throw new Error('Предупреждение о сети должно стоять в начале body, до общих стилей.');
}

if (earlyBytes > EARLY_NOTICE_BUDGET) {
  throw new Error(`Начало страницы вместе с предупреждением о сети — ${earlyBytes} байт в сжатом виде при пределе ${EARLY_NOTICE_BUDGET}. Сократите head или блок предупреждения.`);
}

const template = await readFile(resolve(root, 'src/templates/page.html'), 'utf8');
const mainCss = await readFile(resolve(root, 'src/styles/main.css'), 'utf8');
const mainJs = await readFile(resolve(root, 'src/js/main.js'), 'utf8');

const unusedFragments = (await listFiles('src/content/sections')).filter((file) => !template.includes(file.replace('src/content/', '../content/')));
const unimportedStyles = (await listFiles('src/styles'))
  .filter((file) => file !== 'src/styles/main.css')
  .filter((file) => !mainCss.includes(`./${file.replace('src/styles/', '')}`));
const unimportedModules = (await listFiles('src/js/modules')).filter((file) => !mainJs.includes(`./${file.replace('src/js/', '')}`));
const orphans = [...unusedFragments, ...unimportedStyles, ...unimportedModules];

if (orphans.length) {
  throw new Error(`Файлы не подключены (шаблон, main.css или main.js): ${orphans.join(', ')}`);
}

const oversized = [];
for (const file of [...await listFiles('src'), ...await listFiles('scripts')]) {
  const lineCount = (await readFile(resolve(root, file), 'utf8')).split('\n').length;
  if (lineCount > MAX_LINES) oversized.push(`${file} (${lineCount})`);
}

if (oversized.length) {
  throw new Error(`Файлы длиннее ${MAX_LINES} строк — разделите по смыслу: ${oversized.join(', ')}`);
}

console.log(`Checks passed: ${requiredFiles.length} files, ${localAnchors.length} internal links, page is up to date, network notice takes ${earlyBytes} of ${EARLY_NOTICE_BUDGET} early bytes, no orphan or oversized source files.`);

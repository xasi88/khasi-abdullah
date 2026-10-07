import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Проверка предупреждения о сети. Файл стилей tokens.css приходит с задержкой 15 секунд —
// так выглядит медленная или прерванная загрузка. Предупреждение должно появиться на восьмой секунде.
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT) || 4174;
const delayMs = 15000;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg'
};

createServer(async (request, response) => {
  const { pathname, searchParams } = new URL(request.url, 'http://localhost');
  const filePath = resolve(root, `.${pathname === '/' ? '/index.html' : decodeURIComponent(pathname)}`);

  if (!filePath.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }

  try {
    let body = await readFile(filePath);
    const isSlow = filePath.endsWith('tokens.css');

    // Адрес /?probe: на десятой секунде заголовок вкладки покажет, когда браузер впервые нарисовал страницу.
    if (searchParams.has('probe') && extname(filePath) === '.html') {
      const probe = "<script>setTimeout(() => { document.title = 'PAINT ' + performance.getEntriesByType('paint').map((entry) => entry.name + '@' + Math.round(entry.startTime)).join(' '); }, 10000);</script>";
      body = body.toString('utf8').replace('<head>', `<head>${probe}`);
    }

    setTimeout(() => {
      response.writeHead(200, { 'Content-Type': types[extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': isSlow || extname(filePath) === '.html' ? 'no-store' : 'max-age=600' });
      response.end(body);
    }, isSlow ? delayMs : 0);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`Stalled preview: http://localhost:${port}/ (tokens.css is ${delayMs} ms late)`));

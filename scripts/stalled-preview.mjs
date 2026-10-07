import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { projectRoot } from './render.mjs';

// Проверка предупреждения о сети. Сервер отдаёт начало страницы вместе с предупреждением,
// затем молчит 15 секунд — так выглядит обрыв загрузки при блокировке. Другая пауза: /?stall=40000.
const port = Number(process.env.PORT) || 4174;
const defaultStallMs = 15000;
const types = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg' };

createServer(async (request, response) => {
  const { pathname, searchParams } = new URL(request.url, 'http://localhost');
  const stallMs = Number(searchParams.get('stall')) || defaultStallMs;
  const filePath = resolve(projectRoot, `.${pathname === '/' ? '/index.html' : decodeURIComponent(pathname)}`);

  if (!filePath.startsWith(projectRoot + sep)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });

    if (extname(filePath) !== '.html') {
      response.end(body);
      return;
    }

    const noticeEnd = body.indexOf('</script>', body.indexOf('data-network-notice')) + '</script>'.length;
    response.write(body.subarray(0, noticeEnd));
    setTimeout(() => response.end(body.subarray(noticeEnd)), stallMs);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`Stalled preview: http://localhost:${port}/ (pause ${defaultStallMs} ms)`));

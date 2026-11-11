/* Local preview server for the templates and the editor UI.
   Serves the repository root, so /v8/?template=... and /admin/ behave like the deployed
   static assets (the publish API is not available here — use onlyevent.cn for that).
   Usage: node cloud/scripts/preview-server.mjs [port] */
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {extname, join, normalize, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const port = Number(process.argv[2] || 4321);
const types = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.svg':'image/svg+xml', '.webp':'image/webp',
  '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf', '.mp4':'video/mp4',
  '.webm':'video/webm', '.map':'application/json; charset=utf-8'
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end('forbidden'); }
    let info = await stat(file).catch(() => null);
    if (info && info.isDirectory()) { file = join(file, 'index.html'); info = await stat(file).catch(() => null); }
    if (!info) { res.writeHead(404, {'content-type': 'text/plain; charset=utf-8'}); return res.end('not found: ' + url.pathname); }
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': types[extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*'
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, {'content-type': 'text/plain; charset=utf-8'});
    res.end(String(error && error.message || error));
  }
}).listen(port, '127.0.0.1', () => {
  console.log('OnlyEvent preview:');
  console.log('  editor   http://127.0.0.1:' + port + '/v8/?template=03-creator-market');
  console.log('  templates 01..08: replace template=03-creator-market');
  console.log('  admin UI http://127.0.0.1:' + port + '/admin/');
  console.log('  root     ' + root);
});

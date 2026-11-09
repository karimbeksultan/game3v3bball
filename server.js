const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3456;
const HOST = '0.0.0.0';
const baseDir = path.resolve(__dirname);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  const relative = pathname.replace(/^[/\\]+/, '') || 'index.html';
  const filePath = path.resolve(baseDir, relative);
  const insideProject = path.relative(baseDir, filePath);
  if (insideProject.startsWith('..') || path.isAbsolute(insideProject)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.code === 'ENOENT' ? '404 Not Found' : 'Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Game ready on port ${PORT}`);
  for (const [name, addresses] of Object.entries(os.networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) console.log(`${name}: http://${address.address}:${PORT}/`);
    }
  }
});

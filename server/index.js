'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { validateCPF } = require('../src/cpf/validator');
const { generateTestCPF } = require('../src/cpf/generator');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PORT = Number(process.env.PORT) || 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  const rawPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = rawPath === '/' ? '/index.html' : rawPath;
  const filePath = path.resolve(PUBLIC_DIR, '.' + requested);

  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== path.join(PUBLIC_DIR, 'index.html')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJSON(res, 200, { ok: true, service: 'cpf-toolkit' });
  }

  if (req.method === 'POST' && url.pathname === '/api/cpf/validate') {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2048) req.destroy();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        if (typeof parsed.cpf !== 'string' && typeof parsed.cpf !== 'number') {
          return sendJSON(res, 400, { error: 'Informe um CPF em texto.' });
        }
        return sendJSON(res, 200, validateCPF(parsed.cpf));
      } catch {
        return sendJSON(res, 400, { error: 'JSON inválido.' });
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/cpf/generate') {
    return sendJSON(res, 200, generateTestCPF());
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD, POST' });
    return res.end('Method not allowed');
  }

  return serveStatic(req, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('CPF Toolkit disponível em http://localhost:' + PORT);
});

module.exports = { server };

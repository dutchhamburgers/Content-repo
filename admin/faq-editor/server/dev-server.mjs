import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { createServer as createViteServer } from 'vite';

const require = createRequire(import.meta.url);
const { ALLOWED_VISIBLE_ON, readFaqFile, writeFaqFile } = require('./faq-store');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');
const configFile = path.join(frontendRoot, 'vite.config.mjs');
const port = Number(process.env.PORT || 4173);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(`${JSON.stringify(payload)}\n`);
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

const vite = await createViteServer({
  configFile,
  server: {
    middlewareMode: true,
  },
  appType: 'spa',
});

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);

    if (url.pathname === '/api/faq' && request.method === 'GET') {
      const faq = readFaqFile();
      sendJson(response, 200, { faq, allowedVisibleOn: ALLOWED_VISIBLE_ON });
      return;
    }

    if (url.pathname === '/api/faq' && request.method === 'POST') {
      const rawBody = await readRequestBody(request);
      let payload;

      try {
        payload = JSON.parse(rawBody);
      } catch (error) {
        sendJson(response, 400, { errors: [`Invalid JSON payload: ${error.message}`] });
        return;
      }

      try {
        const faq = writeFaqFile(payload);
        sendJson(response, 200, { faq, allowedVisibleOn: ALLOWED_VISIBLE_ON });
      } catch (error) {
        sendJson(response, 400, { errors: error.validationErrors ?? [error.message] });
      }
      return;
    }

    vite.middlewares(request, response, () => {
      response.statusCode = 404;
      response.end('Not found');
    });
  } catch (error) {
    sendJson(response, 500, { errors: [error.message] });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`FAQ editor running at http://127.0.0.1:${port}`);
});

const shutdown = async () => {
  await vite.close();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

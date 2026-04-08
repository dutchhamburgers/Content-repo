'use strict';

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { detectPaywall, validateArticle } = require('./validate-news');

// ---------------------------------------------------------------------------
// Minimal mock HTTP server for testing URL validation scenarios
// ---------------------------------------------------------------------------

let server;
let port;
const openSockets = new Set();

before(
  () =>
    new Promise((resolve) => {
      server = http.createServer((req, res) => {
        openSockets.add(res.socket);
        res.socket.on('close', () => openSockets.delete(res.socket));
        switch (req.url) {
          case '/ok':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Article</h1><p>Normal content.</p></body></html>');
            break;

          case '/not-found':
            res.writeHead(404);
            res.end('Not Found');
            break;

          case '/server-error':
            res.writeHead(500);
            res.end('Internal Server Error');
            break;

          case '/redirect':
            res.writeHead(301, { Location: '/ok' });
            res.end();
            break;

          case '/paywall':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(
              '<html><body>' +
                '<div class="paywall-container">Subscribe to read premium content.</div>' +
                '</body></html>',
            );
            break;

          case '/login-redirect':
            res.writeHead(302, { Location: `http://127.0.0.1:${port}/login?next=/article` });
            res.end();
            break;

          // /login?... – served after the login redirect
          default:
            if (req.url && req.url.startsWith('/login')) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end('<html><body><form>Login required</form></body></html>');
            }
            // /slow – intentionally never responds to trigger a timeout
            break;
        }
      });

      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    }),
);

after(
  () =>
    new Promise((resolve) => {
      // Destroy any open sockets so server.close() doesn't hang (e.g. /slow endpoint)
      for (const sock of openSockets) sock.destroy();
      server.close(resolve);
    }),
);

// ---------------------------------------------------------------------------
// detectPaywall unit tests
// ---------------------------------------------------------------------------

describe('detectPaywall', () => {
  test('returns false for normal content', () => {
    const result = detectPaywall(
      '<html><body>Normal article content here.</body></html>',
      'https://example.com/article',
    );
    assert.equal(result.paywallSuspected, false);
    assert.equal(result.loginRequiredSuspected, false);
  });

  test('detects paywall-container class in body', () => {
    const result = detectPaywall(
      '<div class="paywall-container">Please subscribe.</div>',
      'https://example.com/article',
    );
    assert.equal(result.paywallSuspected, true);
  });

  test('detects "subscribe to read" phrase in body', () => {
    const result = detectPaywall(
      'Subscribe to read this full article.',
      'https://example.com/article',
    );
    assert.equal(result.paywallSuspected, true);
  });

  test('detects login URL pattern in finalUrl', () => {
    const result = detectPaywall(
      '<html><body>Login page</body></html>',
      'https://example.com/login?redirect=/article',
    );
    assert.equal(result.loginRequiredSuspected, true);
    assert.equal(result.paywallSuspected, true);
  });

  test('detects "subscriber only" in body', () => {
    const result = detectPaywall(
      'This article is subscriber-only content.',
      'https://example.com/article',
    );
    assert.equal(result.paywallSuspected, true);
  });
});

// ---------------------------------------------------------------------------
// validateArticle integration tests (using the mock HTTP server)
// ---------------------------------------------------------------------------

describe('validateArticle', () => {
  test('working URL → isReachable=true, validationStatus=ok', async () => {
    const result = await validateArticle(
      { slug: 'test-ok', originalUrl: `http://127.0.0.1:${port}/ok` },
      { timeoutMs: 3000 },
    );
    assert.equal(result.isReachable, true);
    assert.equal(result.httpStatus, 200);
    assert.equal(result.validationStatus, 'ok');
  });

  test('404 URL → validationStatus=invalid', async () => {
    const result = await validateArticle(
      { slug: 'test-404', originalUrl: `http://127.0.0.1:${port}/not-found` },
      { timeoutMs: 3000 },
    );
    assert.equal(result.isReachable, false);
    assert.equal(result.httpStatus, 404);
    assert.equal(result.validationStatus, 'invalid');
  });

  test('500 URL → validationStatus=invalid', async () => {
    const result = await validateArticle(
      { slug: 'test-500', originalUrl: `http://127.0.0.1:${port}/server-error` },
      { timeoutMs: 3000 },
    );
    assert.equal(result.httpStatus, 500);
    assert.equal(result.validationStatus, 'invalid');
  });

  test('redirect URL → finalUrl differs from originalUrl', async () => {
    const originalUrl = `http://127.0.0.1:${port}/redirect`;
    const result = await validateArticle(
      { slug: 'test-redirect', originalUrl },
      { timeoutMs: 3000 },
    );
    assert.notEqual(result.finalUrl, result.originalUrl);
    assert.equal(result.isReachable, true);
    assert.ok(result.validationNotes.includes('Redirected'));
  });

  test('paywall page → paywallSuspected=true, validationStatus=warning', async () => {
    const result = await validateArticle(
      { slug: 'test-paywall', originalUrl: `http://127.0.0.1:${port}/paywall` },
      { timeoutMs: 3000 },
    );
    assert.equal(result.paywallSuspected, true);
    assert.equal(result.validationStatus, 'warning');
  });

  test('login redirect → loginRequiredSuspected=true, validationStatus=warning', async () => {
    const result = await validateArticle(
      { slug: 'test-login', originalUrl: `http://127.0.0.1:${port}/login-redirect` },
      { timeoutMs: 3000 },
    );
    assert.equal(result.loginRequiredSuspected, true);
    assert.equal(result.validationStatus, 'warning');
  });

  test('timeout → graceful error handling, validationStatus=invalid', async () => {
    const result = await validateArticle(
      { slug: 'test-timeout', originalUrl: `http://127.0.0.1:${port}/slow` },
      { timeoutMs: 200 },
    );
    assert.equal(result.isReachable, false);
    assert.equal(result.validationStatus, 'invalid');
    assert.ok(
      result.validationNotes.includes('timed out') || result.validationNotes.startsWith('Error:'),
    );
  });

  test('result always contains required metadata fields', async () => {
    const result = await validateArticle(
      { slug: 'test-fields', originalUrl: `http://127.0.0.1:${port}/ok` },
      { timeoutMs: 3000 },
    );
    for (const field of [
      'slug',
      'originalUrl',
      'lastCheckedAt',
      'httpStatus',
      'finalUrl',
      'isReachable',
      'paywallSuspected',
      'loginRequiredSuspected',
      'validationStatus',
      'validationNotes',
    ]) {
      assert.ok(field in result, `Missing field: ${field}`);
    }
  });
});

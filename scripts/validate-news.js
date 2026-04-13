'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 10;
const MAX_BODY_BYTES = 50000;

const PAYWALL_PATTERNS = [
  /paywall/i,
  /subscribe\s+to\s+(read|access|continue)/i,
  /premium\s+content/i,
  /\bpremium\s+member/i,
  /subscriber.only/i,
  /create\s+a\s+free\s+account/i,
  /sign\s+up\s+to\s+(read|access|continue)/i,
  /abonnement\s+nodig/i,
  /\babonneer\b/i,
  /only\s+available\s+to\s+subscribers/i,
  /metered-paywall/i,
  /paywall-container/i,
];

const LOGIN_URL_PATTERNS = [
  /\/login[/?#]/i,
  /\/signin[/?#]/i,
  /\/sign-in[/?#]/i,
  /\/auth[/?#]/i,
  /\/sso[/?#]/i,
  /\/account\/login/i,
  /\/inloggen/i,
  /\/mijn-account/i,
];

/**
 * Fetch a URL, following redirects, and return the final response info.
 * @param {string} url
 * @param {object} [options]
 * @param {number} [options.timeoutMs]
 * @param {number} [options.maxRedirects]
 * @param {number} [redirectCount]
 * @returns {Promise<{statusCode: number, finalUrl: string, body: string, headers: object}>}
 */
function fetchUrl(url, options = {}, redirectCount = 0) {
  const timeoutMs = options.timeoutMs != null ? options.timeoutMs : TIMEOUT_MS;
  const maxRedirects = options.maxRedirects != null ? options.maxRedirects : MAX_REDIRECTS;

  return new Promise((resolve, reject) => {
    if (redirectCount > maxRedirects) {
      return reject(new Error(`Too many redirects (max: ${maxRedirects})`));
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return reject(new Error(`Invalid URL: ${url}`));
    }

    const lib = parsedUrl.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || undefined,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PseudoAI-Validator/1.0; +https://pseudoai.nl)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nl,en;q=0.5',
      },
    };

    let settled = false;
    const timer = setTimeout(() => {
      req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const req = lib.request(reqOptions, (res) => {
      const { statusCode, headers } = res;
      const location = headers['location'];

      if ([301, 302, 303, 307, 308].includes(statusCode) && location) {
        clearTimeout(timer);
        settled = true;
        res.resume();
        let redirectUrl;
        try {
          redirectUrl = new URL(location, url).href;
        } catch {
          return reject(new Error(`Invalid redirect URL: ${location}`));
        }
        return fetchUrl(redirectUrl, options, redirectCount + 1)
          .then(resolve)
          .catch(reject);
      }

      let body = '';
      let bodySize = 0;

      res.on('data', (chunk) => {
        bodySize += chunk.length;
        if (bodySize <= MAX_BODY_BYTES) {
          body += chunk.toString('utf8');
        } else if (!res.destroyed) {
          res.destroy();
        }
      });

      res.on('end', () => {
        if (!settled) {
          clearTimeout(timer);
          settled = true;
          resolve({ statusCode, finalUrl: url, body, headers });
        }
      });

      res.on('error', (err) => {
        if (!settled) {
          clearTimeout(timer);
          settled = true;
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      if (!settled) {
        clearTimeout(timer);
        settled = true;
        reject(err);
      }
    });

    req.end();
  });
}

/**
 * Detect signs of paywall or login requirement from the response body and final URL.
 * @param {string} body - Response body (partial or full)
 * @param {string} finalUrl - Final URL after redirects
 * @returns {{ paywallSuspected: boolean, loginRequiredSuspected: boolean }}
 */
function detectPaywall(body, finalUrl) {
  const loginRequiredSuspected = LOGIN_URL_PATTERNS.some((p) => p.test(finalUrl));

  if (loginRequiredSuspected) {
    return { paywallSuspected: true, loginRequiredSuspected: true };
  }

  const paywallSuspected = PAYWALL_PATTERNS.some((p) => p.test(body));
  return { paywallSuspected, loginRequiredSuspected: false };
}

/**
 * Validate a single article's URL.
 * @param {object} article - Article object with at least `slug` and `originalUrl`
 * @param {object} [options] - Options forwarded to fetchUrl
 * @returns {Promise<object>} Validation result with metadata fields
 */
async function validateArticle(article, options = {}) {
  const { slug, originalUrl } = article;

  const result = {
    slug,
    originalUrl,
    lastCheckedAt: new Date().toISOString(),
    httpStatus: null,
    finalUrl: originalUrl,
    isReachable: false,
    paywallSuspected: false,
    loginRequiredSuspected: false,
    validationStatus: 'invalid',
    validationNotes: '',
  };

  try {
    const response = await fetchUrl(originalUrl, options);
    result.httpStatus = response.statusCode;
    result.finalUrl = response.finalUrl;

    const notes = [];

    if (result.finalUrl !== originalUrl) {
      notes.push(`Redirected to ${result.finalUrl}`);
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      result.isReachable = true;

      const { paywallSuspected, loginRequiredSuspected } = detectPaywall(
        response.body,
        result.finalUrl,
      );
      result.paywallSuspected = paywallSuspected;
      result.loginRequiredSuspected = loginRequiredSuspected;

      if (paywallSuspected || loginRequiredSuspected) {
        result.validationStatus = 'warning';
        notes.push(loginRequiredSuspected ? 'Login required detected' : 'Paywall suspected');
      } else {
        result.validationStatus = 'ok';
      }
    } else if (response.statusCode === 429) {
      result.isReachable = true;
      result.validationStatus = 'warning';
      notes.push('Rate limited (HTTP 429)');
    } else if (response.statusCode >= 400) {
      result.validationStatus = 'invalid';
      notes.push(`HTTP error ${response.statusCode}`);
    } else {
      result.validationStatus = 'warning';
      notes.push(`Unexpected status ${response.statusCode}`);
    }

    result.validationNotes = notes.join('; ');
  } catch (err) {
    result.validationStatus = 'invalid';
    result.validationNotes = `Error: ${err.message}`;
  }

  return result;
}

async function main() {
  console.log('=== PseudoAI News URL Validator ===');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  const newsFile = path.join(__dirname, '..', 'news.json');
  const reportFile = path.join(__dirname, '..', 'validation-report.json');

  const articles = JSON.parse(fs.readFileSync(newsFile, 'utf-8'));
  console.log(`Validating ${articles.length} articles...\n`);

  const results = [];

  for (const article of articles) {
    console.log(`[→] ${article.slug}`);
    console.log(`    URL: ${article.originalUrl}`);

    const result = await validateArticle(article);
    results.push(result);

    const icon =
      result.validationStatus === 'ok'
        ? '✅'
        : result.validationStatus === 'warning'
          ? '⚠️'
          : '❌';
    const statusDisplay = result.httpStatus != null ? result.httpStatus : 'N/A';
    console.log(
      `    ${icon} Status: HTTP ${statusDisplay} | ${result.validationStatus.toUpperCase()}`,
    );
    if (result.validationNotes) {
      console.log(`    📝 ${result.validationNotes}`);
    }
    console.log();
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totalArticles: results.length,
    ok: results.filter((r) => r.validationStatus === 'ok').length,
    warnings: results.filter((r) => r.validationStatus === 'warning').length,
    invalid: results.filter((r) => r.validationStatus === 'invalid').length,
    results,
  };

  fs.writeFileSync(reportFile, JSON.stringify(summary, null, 2));

  console.log('=== Summary ===');
  console.log(`Total:      ${summary.totalArticles}`);
  console.log(`✅ OK:      ${summary.ok}`);
  console.log(`⚠️  Warnings: ${summary.warnings}`);
  console.log(`❌ Invalid:  ${summary.invalid}`);
  console.log(`\nReport saved to: ${reportFile}`);

  if (summary.invalid > 0) {
    console.log('\n❌ Validation failed: some articles have broken or unreachable URLs.');
    process.exitCode = 1;
  } else if (summary.warnings > 0) {
    console.log('\n⚠️  Validation completed with warnings.');
  } else {
    console.log('\n✅ All articles passed validation.');
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { fetchUrl, detectPaywall, validateArticle };

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('node:assert/strict');
const { describe, test } = require('node:test');

const { ALLOWED_VISIBLE_ON, readFaqFile, validateFaqPayload, writeFaqFile } = require('./faq-store');

function validPayload(overrides = {}) {
  return {
    version: 1,
    updatedAt: '2026-05-14T00:00:00Z',
    items: [
      {
        id: 'faq-test-1',
        category: 'Test',
        question: 'Wat doet deze test?',
        answer: 'Deze test controleert het lezen en schrijven van FAQ-data.',
        visibleOn: ['sales'],
        order: 2,
        isActive: true,
      },
      {
        id: 'faq-test-2',
        category: 'Test',
        question: 'Wat is nog meer belangrijk?',
        answer: 'Validatie moet dubbele ids en ongeldige zichtbaarheid tegenhouden.',
        visibleOn: ['webapp'],
        order: 1,
        isActive: false,
      },
    ],
    ...overrides,
  };
}

describe('validateFaqPayload', () => {
  test('accepts a valid payload', () => {
    assert.deepEqual(validateFaqPayload(validPayload()), []);
  });

  test('rejects duplicate ids', () => {
    const payload = validPayload();
    payload.items[1].id = payload.items[0].id;
    assert.ok(validateFaqPayload(payload).some((error) => error.includes('Duplicate FAQ id')));
  });

  test('rejects invalid visibleOn values', () => {
    const payload = validPayload();
    payload.items[0].visibleOn = ['sales', 'unknown-target'];
    assert.ok(validateFaqPayload(payload).some((error) => error.includes('invalid value')));
  });

  test('rejects empty required strings', () => {
    const payload = validPayload();
    payload.items[0].question = '   ';
    assert.ok(validateFaqPayload(payload).some((error) => error.includes('question')));
  });
});

describe('readFaqFile / writeFaqFile', () => {
  test('writes normalized FAQ JSON sorted by order', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faq-store-'));
    const filePath = path.join(tempDir, 'faq.json');
    const saved = writeFaqFile(validPayload(), filePath, '2026-05-14T12:00:00.000Z');

    assert.equal(saved.updatedAt, '2026-05-14T12:00:00.000Z');
    assert.deepEqual(saved.items.map((item) => item.id), ['faq-test-2', 'faq-test-1']);

    const reread = readFaqFile(filePath);
    assert.deepEqual(reread.items.map((item) => item.id), ['faq-test-2', 'faq-test-1']);

    const raw = fs.readFileSync(filePath, 'utf8');
    assert.ok(raw.indexOf('"order": 1') < raw.indexOf('"isActive": false'));
  });

  test('exports the supported visibleOn values', () => {
    assert.deepEqual(ALLOWED_VISIBLE_ON, ['sales', 'webapp']);
  });
});

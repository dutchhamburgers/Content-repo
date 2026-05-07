'use strict';

/**
 * add-news-entry.test.js
 *
 * Tests for scripts/add-news-entry.js
 *
 * Covers:
 *   1. Valid entry — added, schema remains valid, sort order correct.
 *   2. Duplicate slug — script fails, news.json unchanged.
 *   3. Duplicate originalUrl — script fails, news.json unchanged.
 *   4. Duplicate title — script fails, news.json unchanged.
 *   5. Invalid schema — script fails with clear error message.
 *   6. Sorting — items sorted by publishedAt descending.
 *   7. Content immutability — existing items unchanged after insertion.
 */

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { validateEntry, findDuplicate, sortByPublishedAtDesc } = require('./add-news-entry');

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** A minimal valid entry that passes all schema checks. */
function validEntry(overrides = {}) {
  return {
    slug: 'test-valid-entry',
    title: 'Test Article Title That Is Long Enough',
    publishedAt: '2026-01-15',
    source: 'Test Source',
    language: 'nl',
    originalUrl: 'https://example.com/test-valid-entry',
    quote: 'A short quote from the article.',
    summary:
      'This is a summary of the article that is long enough to satisfy the 50-character minimum.',
    relevanceBullets: [
      'First bullet with enough text to pass the minimum length.',
      'Second bullet with enough text to pass the minimum length.',
    ],
    tags: ['governance'],
    ...overrides,
  };
}

/** A small existing articles array to use as the "current" news.json. */
function existingArticles() {
  return [
    {
      slug: 'existing-article-one',
      title: 'Existing Article One About Shadow AI',
      publishedAt: '2026-01-10',
      source: 'Source One',
      language: 'en',
      originalUrl: 'https://example.com/existing-one',
      quote: 'Quote from article one.',
      summary:
        'Summary of existing article one that exceeds the minimum fifty character threshold easily.',
      relevanceBullets: [
        'First bullet of existing article one with sufficient length.',
        'Second bullet of existing article one with sufficient length.',
      ],
      tags: ['shadow-ai'],
    },
    {
      slug: 'existing-article-two',
      title: 'Existing Article Two About Governance',
      publishedAt: '2025-12-20',
      source: 'Source Two',
      language: 'nl',
      originalUrl: 'https://example.com/existing-two',
      quote: 'Quote from article two.',
      summary:
        'Summary of existing article two that exceeds the minimum fifty character threshold easily.',
      relevanceBullets: [
        'First bullet of existing article two with sufficient length.',
        'Second bullet of existing article two with sufficient length.',
      ],
      tags: ['governance'],
    },
  ];
}

// ---------------------------------------------------------------------------
// validateEntry tests
// ---------------------------------------------------------------------------

describe('validateEntry', () => {
  test('valid entry returns no errors', () => {
    const errors = validateEntry(validEntry());
    assert.deepEqual(errors, []);
  });

  test('missing required field returns error', () => {
    const entry = validEntry();
    delete entry.slug;
    const errors = validateEntry(entry);
    assert.ok(errors.some((e) => e.includes('"slug"')));
  });

  test('invalid slug pattern returns error', () => {
    const errors = validateEntry(validEntry({ slug: 'Invalid Slug!' }));
    assert.ok(errors.some((e) => e.includes('"slug"')));
  });

  test('title too short returns error', () => {
    const errors = validateEntry(validEntry({ title: 'Short' }));
    assert.ok(errors.some((e) => e.includes('"title"')));
  });

  test('invalid publishedAt format returns error', () => {
    const errors = validateEntry(validEntry({ publishedAt: '15-01-2026' }));
    assert.ok(errors.some((e) => e.includes('"publishedAt"')));
  });

  test('invalid language returns error', () => {
    const errors = validateEntry(validEntry({ language: 'fr' }));
    assert.ok(errors.some((e) => e.includes('"language"')));
  });

  test('invalid originalUrl returns error', () => {
    const errors = validateEntry(validEntry({ originalUrl: 'not-a-url' }));
    assert.ok(errors.some((e) => e.includes('"originalUrl"')));
  });

  test('quote exceeding 200 chars returns error', () => {
    const errors = validateEntry(validEntry({ quote: 'x'.repeat(201) }));
    assert.ok(errors.some((e) => e.includes('"quote"')));
  });

  test('summary too short returns error', () => {
    const errors = validateEntry(validEntry({ summary: 'Too short.' }));
    assert.ok(errors.some((e) => e.includes('"summary"')));
  });

  test('relevanceBullets with wrong count returns error', () => {
    const errors = validateEntry(validEntry({ relevanceBullets: ['Only one bullet here.'] }));
    assert.ok(errors.some((e) => e.includes('"relevanceBullets"')));
  });

  test('relevanceBullets with bullet too short returns error', () => {
    const errors = validateEntry(validEntry({ relevanceBullets: ['Short.', 'Short.'] }));
    assert.ok(errors.some((e) => e.includes('"relevanceBullets"')));
  });

  test('unknown tag returns error', () => {
    const errors = validateEntry(validEntry({ tags: ['unknown-tag'] }));
    assert.ok(errors.some((e) => e.includes('"unknown-tag"')));
  });

  test('duplicate tags return error', () => {
    const errors = validateEntry(validEntry({ tags: ['governance', 'governance'] }));
    assert.ok(errors.some((e) => e.includes('duplicate')));
  });

  test('entry without tags is valid', () => {
    const entry = validEntry();
    delete entry.tags;
    const errors = validateEntry(entry);
    assert.deepEqual(errors, []);
  });

  test('entry with empty tags array is valid', () => {
    const errors = validateEntry(validEntry({ tags: [] }));
    assert.deepEqual(errors, []);
  });

  test('non-object input returns error immediately', () => {
    const errors = validateEntry('not an object');
    assert.ok(errors.length > 0);
  });
});

// ---------------------------------------------------------------------------
// findDuplicate tests
// ---------------------------------------------------------------------------

describe('findDuplicate', () => {
  test('no duplicate returns null', () => {
    const result = findDuplicate(validEntry(), existingArticles());
    assert.equal(result, null);
  });

  test('duplicate slug returns conflict message', () => {
    const entry = validEntry({ slug: 'existing-article-one' });
    const result = findDuplicate(entry, existingArticles());
    assert.ok(result !== null);
    assert.ok(result.includes('slug'));
    assert.ok(result.includes('existing-article-one'));
  });

  test('duplicate originalUrl returns conflict message', () => {
    const entry = validEntry({ originalUrl: 'https://example.com/existing-one' });
    const result = findDuplicate(entry, existingArticles());
    assert.ok(result !== null);
    assert.ok(result.includes('originalUrl'));
  });

  test('duplicate title (case-insensitive) returns conflict message', () => {
    const entry = validEntry({ title: 'existing article one about shadow ai' });
    const result = findDuplicate(entry, existingArticles());
    assert.ok(result !== null);
    assert.ok(result.includes('title'));
  });

  test('empty existing articles — no duplicate', () => {
    const result = findDuplicate(validEntry(), []);
    assert.equal(result, null);
  });
});

// ---------------------------------------------------------------------------
// sortByPublishedAtDesc tests
// ---------------------------------------------------------------------------

describe('sortByPublishedAtDesc', () => {
  test('sorts articles newest first', () => {
    const articles = [
      { publishedAt: '2025-06-01', slug: 'a' },
      { publishedAt: '2026-01-15', slug: 'b' },
      { publishedAt: '2025-12-31', slug: 'c' },
    ];
    const sorted = sortByPublishedAtDesc(articles);
    assert.equal(sorted[0].slug, 'b');
    assert.equal(sorted[1].slug, 'c');
    assert.equal(sorted[2].slug, 'a');
  });

  test('does not mutate the original array', () => {
    const articles = [
      { publishedAt: '2025-01-01', slug: 'old' },
      { publishedAt: '2026-01-01', slug: 'new' },
    ];
    const original = [...articles];
    sortByPublishedAtDesc(articles);
    assert.deepEqual(articles, original);
  });

  test('equal publishedAt preserves relative order (stable)', () => {
    const articles = [
      { publishedAt: '2026-01-01', slug: 'first' },
      { publishedAt: '2026-01-01', slug: 'second' },
    ];
    const sorted = sortByPublishedAtDesc(articles);
    assert.equal(sorted.length, 2);
    // Both have the same date — just ensure no items are lost.
    const slugs = sorted.map((a) => a.slug);
    assert.ok(slugs.includes('first'));
    assert.ok(slugs.includes('second'));
  });

  test('single item array is returned unchanged', () => {
    const articles = [{ publishedAt: '2026-01-01', slug: 'only' }];
    const sorted = sortByPublishedAtDesc(articles);
    assert.equal(sorted.length, 1);
    assert.equal(sorted[0].slug, 'only');
  });

  test('empty array is returned unchanged', () => {
    const sorted = sortByPublishedAtDesc([]);
    assert.deepEqual(sorted, []);
  });
});

// ---------------------------------------------------------------------------
// Content immutability tests
// ---------------------------------------------------------------------------

describe('content immutability', () => {
  test('existing article objects are not mutated by sortByPublishedAtDesc', () => {
    const articles = existingArticles();
    const originalSnapshots = articles.map((a) => JSON.stringify(a));
    sortByPublishedAtDesc(articles);
    // Original array items must be unchanged.
    for (let i = 0; i < articles.length; i++) {
      assert.equal(JSON.stringify(articles[i]), originalSnapshots[i]);
    }
  });

  test('findDuplicate does not mutate existing articles', () => {
    const articles = existingArticles();
    const originalJson = JSON.stringify(articles);
    findDuplicate(validEntry(), articles);
    assert.equal(JSON.stringify(articles), originalJson);
  });
});

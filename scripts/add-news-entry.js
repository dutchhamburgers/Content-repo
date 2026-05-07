'use strict';

/**
 * add-news-entry.js
 *
 * CLI helper for the strict JSON-driven news workflow.
 *
 * Usage:
 *   node scripts/add-news-entry.js <path-to-entry.json>
 *
 * The script:
 *   1. Reads and parses the provided JSON entry.
 *   2. Validates it against news.schema.json.
 *   3. Checks for duplicates in the existing news.json.
 *   4. Appends the entry to news.json.
 *   5. Sorts news.json by publishedAt descending.
 *
 * Exits with code 1 (and does NOT modify news.json) on any error.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NEWS_FILE = path.join(ROOT, 'news.json');
const SCHEMA_FILE = path.join(ROOT, 'news.schema.json');

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Validate a single entry object against news.schema.json.
 * Returns an array of error messages (empty = valid).
 *
 * Uses manual checks so the script has no external runtime dependencies.
 * The authoritative schema validation is still performed by the GitHub Action
 * (ajv-cli) on the full news.json after insertion.
 *
 * @param {object} entry
 * @returns {string[]}
 */
function validateEntry(entry) {
  const errors = [];

  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    errors.push('Entry must be a JSON object.');
    return errors;
  }

  const required = [
    'slug',
    'title',
    'publishedAt',
    'source',
    'language',
    'originalUrl',
    'quote',
    'summary',
    'relevanceBullets',
  ];

  for (const field of required) {
    if (!(field in entry)) {
      errors.push(`Missing required field: "${field}".`);
    }
  }

  if (errors.length > 0) return errors;

  if (typeof entry.slug !== 'string' || !/^[a-z0-9-]+$/.test(entry.slug)) {
    errors.push('Field "slug" must be a lowercase kebab-case string (a-z, 0-9, -).');
  }

  if (typeof entry.title !== 'string' || entry.title.length < 10) {
    errors.push('Field "title" must be a string with at least 10 characters.');
  }

  if (typeof entry.publishedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.publishedAt)) {
    errors.push('Field "publishedAt" must be a date string in YYYY-MM-DD format.');
  }

  if (typeof entry.source !== 'string' || entry.source.length < 2) {
    errors.push('Field "source" must be a string with at least 2 characters.');
  }

  if (entry.language !== 'nl' && entry.language !== 'en') {
    errors.push('Field "language" must be "nl" or "en".');
  }

  if (typeof entry.originalUrl !== 'string' || !/^https?:\/\/.+/.test(entry.originalUrl)) {
    errors.push('Field "originalUrl" must be a valid http/https URI.');
  }

  if (typeof entry.quote !== 'string' || entry.quote.length > 200) {
    errors.push('Field "quote" must be a string with at most 200 characters.');
  }

  if (typeof entry.summary !== 'string' || entry.summary.length < 50) {
    errors.push('Field "summary" must be a string with at least 50 characters.');
  }

  if (
    !Array.isArray(entry.relevanceBullets) ||
    entry.relevanceBullets.length !== 2 ||
    entry.relevanceBullets.some((b) => typeof b !== 'string' || b.length < 20)
  ) {
    errors.push(
      'Field "relevanceBullets" must be an array of exactly 2 strings, each at least 20 characters.',
    );
  }

  const allowedTags = [
    'shadow-ai',
    'governance',
    'security',
    'privacy',
    'compliance',
    'data-leakage',
    'byoai',
    'attack-surface',
    'shadow-it',
  ];

  if (entry.tags !== undefined) {
    if (!Array.isArray(entry.tags)) {
      errors.push('Field "tags" must be an array when present.');
    } else {
      for (const tag of entry.tags) {
        if (!allowedTags.includes(tag)) {
          errors.push(`Tag "${tag}" is not in the allowed taxonomy: ${allowedTags.join(', ')}.`);
        }
      }

      const uniqueTags = new Set(entry.tags);
      if (uniqueTags.size !== entry.tags.length) {
        errors.push('Field "tags" must not contain duplicate values.');
      }
    }
  }

  return errors;
}

/**
 * Check for duplicates between `entry` and the existing `articles` array.
 * Returns a description of the conflict if found, or null if no duplicate.
 *
 * @param {object} entry
 * @param {object[]} articles
 * @returns {string|null}
 */
function findDuplicate(entry, articles) {
  for (const existing of articles) {
    if (existing.slug === entry.slug) {
      return `Duplicate slug "${entry.slug}" found in existing news.json (title: "${existing.title}").`;
    }
    if (existing.originalUrl === entry.originalUrl) {
      return `Duplicate originalUrl "${entry.originalUrl}" found in existing news.json (slug: "${existing.slug}").`;
    }
    if (existing.title.trim().toLowerCase() === entry.title.trim().toLowerCase()) {
      return `Duplicate title "${entry.title}" found in existing news.json (slug: "${existing.slug}").`;
    }
  }
  return null;
}

/**
 * Sort an array of articles by publishedAt descending (newest first).
 * Does not mutate article objects — only reorders the array.
 *
 * @param {object[]} articles
 * @returns {object[]}
 */
function sortByPublishedAtDesc(articles) {
  return [...articles].sort((a, b) => {
    if (a.publishedAt > b.publishedAt) return -1;
    if (a.publishedAt < b.publishedAt) return 1;
    return 0;
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const [, , entryFilePath] = process.argv;

  if (!entryFilePath) {
    console.error('Usage: node scripts/add-news-entry.js <path-to-entry.json>');
    process.exit(1);
  }

  // 1. Read and parse the provided entry file.
  let rawEntry;
  try {
    rawEntry = fs.readFileSync(entryFilePath, 'utf-8');
  } catch (err) {
    console.error(`❌ Cannot read entry file "${entryFilePath}": ${err.message}`);
    process.exit(1);
  }

  let entry;
  try {
    entry = JSON.parse(rawEntry);
  } catch (err) {
    console.error(`❌ Invalid JSON in entry file: ${err.message}`);
    console.error('Stop: news.json has not been modified.');
    process.exit(1);
  }

  // 2. Validate the entry.
  const validationErrors = validateEntry(entry);
  if (validationErrors.length > 0) {
    console.error('❌ Entry validation failed:');
    for (const e of validationErrors) {
      console.error(`   • ${e}`);
    }
    console.error('Stop: news.json has not been modified.');
    process.exit(1);
  }

  // 3. Read existing news.json.
  let existingArticles;
  try {
    const raw = fs.readFileSync(NEWS_FILE, 'utf-8');
    existingArticles = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Cannot read or parse news.json: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(existingArticles)) {
    console.error('❌ news.json must be a JSON array.');
    process.exit(1);
  }

  // 4. Check for duplicates.
  const duplicateMessage = findDuplicate(entry, existingArticles);
  if (duplicateMessage) {
    console.error(`❌ Duplicate detected: ${duplicateMessage}`);
    console.error('Stop: news.json has not been modified.');
    process.exit(1);
  }

  // 5. Append entry and sort.
  const updated = sortByPublishedAtDesc([...existingArticles, entry]);

  // 6. Write updated news.json.
  try {
    fs.writeFileSync(NEWS_FILE, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
  } catch (err) {
    console.error(`❌ Cannot write news.json: ${err.message}`);
    process.exit(1);
  }

  console.log(`✅ Entry "${entry.slug}" added to news.json.`);
  console.log(`✅ news.json sorted by publishedAt descending (${updated.length} items).`);
  console.log('Run schema validation to confirm:');
  console.log(
    '  npx -p ajv-cli -p ajv-formats ajv validate --spec=draft2020 -c ajv-formats -s news.schema.json -d news.json --all-errors',
  );
}

if (require.main === module) {
  main();
}

module.exports = { validateEntry, findDuplicate, sortByPublishedAtDesc };

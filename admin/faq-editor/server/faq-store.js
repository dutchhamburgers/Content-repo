'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const FAQ_FILE = path.join(REPO_ROOT, 'faq', 'faq.json');
const ALLOWED_VISIBLE_ON = ['sales', 'webapp'];

function readFaqFile(filePath = FAQ_FILE) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const payload = JSON.parse(raw);
  const errors = validateFaqPayload(payload);

  if (errors.length > 0) {
    const error = new Error('Invalid FAQ payload.');
    error.validationErrors = errors;
    throw error;
  }

  return payload;
}

function validateFaqPayload(payload) {
  const errors = [];

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return ['FAQ payload must be a JSON object.'];
  }

  if (!Number.isInteger(payload.version) || payload.version < 1) {
    errors.push('Field "version" must be a positive integer.');
  }

  if (!Array.isArray(payload.items)) {
    errors.push('Field "items" must be an array.');
    return errors;
  }

  const seenIds = new Set();

  payload.items.forEach((item, index) => {
    const label = `items[${index}]`;

    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      errors.push(`${label} must be an object.`);
      return;
    }

    for (const field of ['id', 'category', 'question', 'answer']) {
      if (typeof item[field] !== 'string' || item[field].trim() === '') {
        errors.push(`${label}.${field} must be a non-empty string.`);
      }
    }

    if (!Array.isArray(item.visibleOn) || item.visibleOn.length === 0) {
      errors.push(`${label}.visibleOn must be a non-empty array.`);
    } else {
      const uniqueVisibleOn = new Set(item.visibleOn);

      if (uniqueVisibleOn.size !== item.visibleOn.length) {
        errors.push(`${label}.visibleOn must not contain duplicate values.`);
      }

      for (const target of item.visibleOn) {
        if (!ALLOWED_VISIBLE_ON.includes(target)) {
          errors.push(
            `${label}.visibleOn contains invalid value "${target}". Allowed values: ${ALLOWED_VISIBLE_ON.join(', ')}.`,
          );
        }
      }
    }

    if (!Number.isInteger(item.order)) {
      errors.push(`${label}.order must be an integer.`);
    }

    if (typeof item.isActive !== 'boolean') {
      errors.push(`${label}.isActive must be a boolean.`);
    }

    if (typeof item.id === 'string' && item.id.trim() !== '') {
      if (seenIds.has(item.id)) {
        errors.push(`Duplicate FAQ id "${item.id}" found.`);
      } else {
        seenIds.add(item.id);
      }
    }
  });

  return errors;
}

function normalizeFaqPayload(payload, now = new Date().toISOString()) {
  return {
    version: payload.version,
    updatedAt: now,
    items: [...payload.items].sort((left, right) => left.order - right.order).map((item) => ({
      id: item.id,
      category: item.category,
      question: item.question,
      answer: item.answer,
      visibleOn: item.visibleOn,
      order: item.order,
      isActive: item.isActive,
    })),
  };
}

function writeFaqFile(payload, filePath = FAQ_FILE, now = new Date().toISOString()) {
  const errors = validateFaqPayload(payload);

  if (errors.length > 0) {
    const error = new Error('FAQ validation failed.');
    error.validationErrors = errors;
    throw error;
  }

  const normalized = normalizeFaqPayload(payload, now);
  fs.writeFileSync(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

module.exports = {
  ALLOWED_VISIBLE_ON,
  FAQ_FILE,
  normalizeFaqPayload,
  readFaqFile,
  validateFaqPayload,
  writeFaqFile,
};

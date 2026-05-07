---
name: ➕ Insert provided news.json entry
about: Insert a user-provided news article entry into news.json without editorial changes
title: "Insert news entry: "
labels: ["news"]
assignees: []
---

## Description

Insert the user-provided JSON entry into `news.json`.

Copilot must treat the JSON below as the **only source of truth**.

Copilot must **NOT** search, select, replace, rewrite, enrich, or generate news content.

---

## ⚠️ Critical instruction for Copilot

Use **ONLY** the JSON provided in this issue.

**Copilot MAY:**
- validate the provided JSON against `news.schema.json`
- insert the provided JSON entry into `news.json`
- sort `news.json` by `publishedAt` descending after inserting
- fix JSON formatting only when this does not change content

**Copilot MUST NOT:**
- search for news articles
- select alternative articles
- replace the provided article with another
- add extra articles beyond what is provided
- invent or fill in missing fields
- rewrite `title`, `source`, `originalUrl`, `quote`, `summary`, `relevanceBullets`, or `tags`
- generate fallback content
- modify existing article content

**If the provided JSON is invalid, incomplete, duplicate, or schema-invalid:**
- **stop immediately**
- report the validation error
- do **not** modify `news.json`
- do **not** add alternative content

---

## Provided JSON entry

Paste the **exact** JSON object below. Do not modify it.

```json
{
  "slug": "",
  "title": "",
  "publishedAt": "YYYY-MM-DD",
  "source": "",
  "language": "nl",
  "originalUrl": "",
  "quote": "",
  "summary": "",
  "relevanceBullets": [
    "",
    ""
  ],
  "tags": []
}
```

---

## Required Workflow

Copilot must follow these steps **in order**:

### 1️⃣ Validate the provided JSON

- Parse the JSON object above.
- If the JSON is not valid or is missing required fields: **stop and report the error**.

### 2️⃣ Validate against `news.schema.json`

- Run schema validation on the provided entry.
- If validation fails: **stop and report the schema errors**.

### 3️⃣ Check for duplicates in existing `news.json`

Check all of the following:
- same `slug`
- same `originalUrl`
- same `title`
- same underlying article / event / report / narrative

If a duplicate is found: **stop and report the duplicate**. Do not add the entry.

### 4️⃣ Create branch

Create a new branch from `main`:

```
news/add-<slug>
```

### 5️⃣ Insert entry into `news.json`

- Append the provided JSON entry to the array.
- Do **not** modify any existing items.
- Ensure valid JSON (no trailing commas).

### 6️⃣ Sort `news.json` by `publishedAt` descending

- Sort all items so the newest article is first.
- Do **not** change the content of any item.

### 7️⃣ Run schema validation

- Confirm `news.schema.json` validation passes on the updated `news.json`.
- If it fails: **stop, revert, and report the error**.

### 8️⃣ Open Pull Request

Create PR to `main` with:

**Title:** `Insert news entry: <slug>`

**Description:**
- Confirmation that the provided JSON was used as-is
- Confirmation that schema validation passed
- Confirmation that no duplicates were found
- Confirmation that `news.json` is sorted by `publishedAt` descending

---

## Acceptance Criteria

- [ ] Only the provided JSON entry is used — no alternative articles
- [ ] No content is rewritten or enriched
- [ ] No extra articles are added
- [ ] Duplicate checks performed (slug, originalUrl, title, narrative)
- [ ] `news.json` is sorted by `publishedAt` descending
- [ ] Schema validation passes (GitHub Action green)
- [ ] Branch name follows `news/add-<slug>`
- [ ] PR opened to `main`
- [ ] PR contains no unrelated changes

---

## Definition of Done

- Article successfully merged into `main`
- GitHub Action validation passed
- Article visible via:
  https://raw.githubusercontent.com/dutchhamburgers/Content-repo/main/news.json

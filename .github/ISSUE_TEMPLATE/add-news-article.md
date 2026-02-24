---
name: Add News Article
about: Add a new curated news article to news.json
title: "Add news article: "
labels: ''
assignees: ''
---

## Description

Add a new curated news article to `news.json` in the Content-repo.

This must follow the official JSON schema (`news.schema.json`) and editorial guidelines.

---

## Goal

Add a new news item that:

- Validates successfully against `news.schema.json`
- Follows editorial standards
- Includes exactly 2 relevance bullets
- Uses proper kebab-case slug
- Does NOT include copyrighted full text

---

## Article Information

Please provide the following:

- **Title:**
- **Source:**
- **Original URL:**
- **Publication Date (YYYY-MM-DD):**
- **Short Quote (max ~200 chars):**
- **Summary (2–4 sentences, neutral, own words):**
- **Relevance Bullet 1:**
- **Relevance Bullet 2:**
- **Tags (optional, from allowed list):**

---

## Required Workflow

Copilot must follow these steps:

### 1️⃣ Create Branch

Create a new branch from `main`:


news/add-<slug>


Slug must:
- be lowercase
- use kebab-case
- contain only `a-z`, `0-9`, `-`
- be unique

---

### 2️⃣ Update news.json

- Add the new item to `news.json`
- Ensure valid JSON (no trailing commas)
- Keep array structure intact
- Do NOT modify existing items

---

### 3️⃣ Validate Against Schema

Ensure that:

- `news.schema.json` validation passes
- GitHub Action “Validate news.json” succeeds
- Exactly 2 `relevanceBullets`
- No additional properties are added

---

### 4️⃣ Open Pull Request

Create PR to `main` with:

Title:

Add news article: <Article Title>


Description:
- Short explanation of why this article is relevant for pseudoAI
- Confirmation that schema validation passed

---

## Acceptance Criteria

- [ ] Branch name follows `news/add-<slug>`
- [ ] `news.json` updated correctly
- [ ] Schema validation passes (GitHub Action green)
- [ ] PR opened to `main`
- [ ] No unrelated changes included

---

## Definition of Done

- Article successfully merged into `main`
- GitHub Action validation passed
- Article visible via:
  https://raw.githubusercontent.com/dutchhamburgers/Content-repo/main/news.json

---
name: 🗑 Remove outdated news article
about: Remove an article from news.json
title: "Remove news article: "
labels: ["news"]
assignees: []
---

## Description

Remove an outdated or no-longer-relevant article from `news.json`.

Removal may be required due to:
- Outdated information
- Broken or removed source article
- Relevance no longer aligned with pseudoAI
- Duplicate content

---

## Goal

Keep the news feed:

- Relevant
- Credible
- Focused on shadow AI, governance, compliance, and data risks
- Free from broken or outdated links

---

## Article Identification

- **Slug of article to remove:**
- **Reason for removal:**
  - [ ] Outdated
  - [ ] Broken link
  - [ ] Duplicate
  - [ ] No longer relevant
  - [ ] Other:

---

## Required Workflow

Copilot must follow these steps:

### 1️⃣ Create Branch

Create branch:


news/remove-<slug>


---

### 2️⃣ Remove Only Target Article

- Delete only the specified article object
- Maintain valid JSON array structure
- Ensure no trailing commas

---

### 3️⃣ Validate Against Schema

Ensure:
- JSON remains valid
- GitHub Action validation passes

---

### 4️⃣ Open Pull Request

Title:

Remove news article: <slug>


PR description:
- Reason for removal
- Confirmation schema validation passed

---

## Acceptance Criteria

- [ ] Correct article removed
- [ ] JSON structure remains valid
- [ ] Schema validation passed
- [ ] PR created to `main`

---

## Definition of Done

- Article removed from `main`
- No schema validation errors
- Feed reflects updated list immediately

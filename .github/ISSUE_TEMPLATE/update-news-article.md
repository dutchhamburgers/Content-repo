## Description

Update an existing news article in `news.json`.

This may include corrections to:
- Summary
- Relevance bullets
- Tags
- Quote
- Publication date (if incorrect)
- Source URL (if canonical URL changed)

This must comply with `news.schema.json`.

---

## Goal

Ensure the article remains:

- Factually accurate
- Editorially consistent
- Schema-valid
- Aligned with pseudoAI positioning

---

## Article Identification

- **Slug of article to update:**
- **Reason for update:**
  - [ ] Editorial improvement
  - [ ] Correction
  - [ ] Broken URL
  - [ ] Update relevance
  - [ ] Other:

---

## Fields to Update

Indicate which fields should be modified:

- [ ] Title
- [ ] PublishedAt
- [ ] Source
- [ ] Original URL
- [ ] Quote
- [ ] Summary
- [ ] Relevance Bullets
- [ ] Tags

Provide updated content below:

---

## Required Workflow

Copilot must follow these steps:

### 1️⃣ Create Branch

Create branch:


news/update-<slug>


---

### 2️⃣ Update Only Target Article

- Modify only the specified article
- Do NOT change other items
- Keep array structure intact

---

### 3️⃣ Validate Against Schema

Ensure:
- `news.schema.json` validation passes
- Exactly 2 `relevanceBullets`
- No additional properties added

---

### 4️⃣ Open Pull Request

Title:

Update news article: <slug>


PR description:
- What was changed
- Why it was changed
- Confirmation schema validation passed

---

## Acceptance Criteria

- [ ] Correct article updated
- [ ] No unintended changes
- [ ] Schema validation passed
- [ ] PR created to `main`

---

## Definition of Done

- Changes merged
- Article visible in updated form via GitHub Raw URL

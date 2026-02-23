# PseudoAI – News Content Repository

This repository contains the curated news feed used on the PseudoAI Sales website.

It is a **content-only repository**.  
No application code, no build system, no runtime logic.

The Sales website fetches `news.json` directly via CDN.

---

## 📂 Structure


/news.json
/README.md


`news.json` is the single source of truth for the “In het nieuws” section.

---

## 🌍 How It Is Used

The Sales website fetches this file from:


https://cdn.jsdelivr.net/gh/dutchhamburgers/Content-repo/news.json


Requirements:
- Repository must be **public**
- `news.json` must be valid JSON
- Items must follow the schema below

---

## 🧾 JSON Schema

Each item must follow this structure:

```json
{
  "slug": "unique-slug",
  "title": "Article title",
  "publishedAt": "YYYY-MM-DD",
  "sourceName": "Source name",
  "sourceUrl": "https://original-article-url",
  "quote": "Short quote (max ~180 characters).",
  "summary": "2–4 sentence summary in our own words.",
  "relevance": [
    "Relevance bullet 1 (why this matters for pseudoAI).",
    "Relevance bullet 2 (concrete risk or implication)."
  ],
  "tags": ["shadow-ai", "governance"]
}
✍ Editorial Guidelines

To ensure consistency and legal safety:

Quote

Keep short (max ~180 characters)

Do NOT copy full paragraphs

Avoid copyrighted large excerpts

Summary

2–4 sentences

Neutral tone

Written in our own words

No marketing language

Relevance

Exactly 2 bullet points

Concrete

Directly linked to:

Shadow AI

Data leakage risks

Governance gaps

Compliance

Need for controlled AI usage

Tags

Use consistent taxonomy:

shadow-ai

governance

security

privacy

compliance

data-leakage

byoai

attack-surface

🔄 Update Process
Manual update

Edit news.json

Add new item at correct date

Commit to main

Automatic update (optional future phase)

A scheduled workflow can:

Discover new relevant articles

Generate summary + relevance

Open a PR for review

⚠ Important

This repository must NOT contain:

Full article texts

Sensitive data

API keys

Secrets

Backend code

This is strictly a curated metadata feed.

🧠 Purpose

This feed strengthens the credibility of PseudoAI by showing:

That Shadow AI is a real and growing problem

That unmanaged AI use creates compliance and data risks

That organizations need a controlled AI workflow

Maintained by: PseudoAI

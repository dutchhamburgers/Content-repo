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

# Canvas: Ontwerp voor Weekly Article Selection

---

## 🎯 Strategisch Doel

Voor de pseudoAI sales website bouwen we een wekelijkse, gecureerde selectie van maximaal **3 recente persartikelen (≤ 3 maanden oud)** die aantonen waarom gecontroleerde AI noodzakelijk is.

Focus:
- Shadow AI (medewerkers omzeilen IT)
- Data leakage via ongecontroleerde AI-tools
- Governance gaps
- Compliance risico’s
- Security blind spots

Kwaliteit boven kwantiteit.

---

## 🧠 Thematic Clusters

Artikelen moeten aantoonbaar binnen één of meer van deze clusters vallen:

### 1) Shadow AI & IT Bypass
- Employees bypassing IT
- Unauthorized AI tools
- BYOAI
- Rogue AI adoption

### 2) Data Leakage & Security
- Confidential data exposure via AI
- AI expanding attack surfaces
- Security blind spots

### 3) Governance & Compliance Gap
- AI governance failures
- Missing AI policy
- Regulatory exposure
- Uncontrolled AI adoption

---

## 📋 Selectieproces (3-Fasen Model)

### Fase 1 — Brede Discovery
- Identificeer 10–20 artikelen ≤ 3 maanden oud
- Gebruik meerdere betrouwbare bronnen
- Filter op organisatorisch risico (geen productlanceringen of investeringsnieuws)

### Fase 2 — Interne Scoring (niet zichtbaar in output)
Elk artikel wordt intern beoordeeld op:
- Governance urgency
- Concrete data risk
- Organizational impact
- Sales narrative strength

### Fase 3 — Diversiteitsfilter
- Maximaal 1 artikel per bron
- Voorkeur voor spreiding over clusters
- Selecteer de beste 3 op totaalscore

---

## 📦 Output Contract (Schema Conform)

De wekelijkse output bevat maximaal 3 artikelen in dit exacte JSON-schema:

{
  "slug": "...",
  "title": "...",
  "publishedAt": "YYYY-MM-DD",
  "source": "...",
  "originalUrl": "...",
  "quote": "...",
  "summary": "...",
  "relevanceBullets": [
    "...",
    "..."
  ],
  "tags": ["shadow-ai", "..."]
}

Regels:
- Slug in kebab-case
- Quote max 200 karakters
- Summary 2–4 zinnen, neutraal
- Exact 2 relevanceBullets
- Geen extra velden
- Alleen geldige JSON-array als output

---

## 🔁 Definitieve Weekly Prompt (met language support)

You are acting as a strategic analyst for pseudoAI.

Your task is NOT to return the first 3 recent articles.

Your task is to:

1. Identify 10–20 recent press articles (≤ 3 months old) that discuss:
   - Shadow AI
   - Employees bypassing IT
   - Unmanaged AI adoption
   - Data leakage from AI tools
   - AI governance failures
   - Compliance or regulatory exposure

2. Only consider articles written in:
   - Dutch (nl)
   - English (en)

   Explicitly exclude:
   - French
   - Spanish
   - German
   - Czech
   - Any other language

3. Score each candidate internally (do NOT show scoring in output) on:
   - Governance urgency
   - Concrete data risk
   - Organizational impact
   - Sales narrative strength

4. Select the BEST 3 articles based on:
   - Highest total score
   - Different sources (no more than one per publication)
   - Prefer diversity across thematic clusters
   - Prefer not repeating the same source used last week (if alternatives exist)

5. Return ONLY the final 3 articles as a JSON array.

Each article must strictly follow this schema:

{
  "slug": "...",
  "title": "...",
  "publishedAt": "YYYY-MM-DD",
  "source": "...",
  "language": "nl" or "en",
  "originalUrl": "...",
  "quote": "...",
  "summary": "...",
  "relevanceBullets": [
    "...",
    "..."
  ],
  "tags": ["shadow-ai", "..."]
}

Rules:

- Maximum 3 articles
- Exactly 2 relevanceBullets
- Quote max 200 characters
- Summary 2–4 sentences
- Slug must be kebab-case
- language must be either "nl" or "en"
- Sources must not be identical
- No explanations
- No markdown
- Return only valid JSON array

---

## 🚀 Strategisch Resultaat

Dit systeem bouwt geen nieuwsfeed, maar een doorlopend bewijsdossier dat:
- Shadow AI structureel is
- Governance achterloopt
- Data leakage risico reëel is
- Organisaties gecontroleerde AI nodig hebben

Dit versterkt sales messaging, homepage positioning en thought leadership op lange termijn.

---

## 📅 Toekomstige Automatisering (Optioneel)

- Wekelijkse scheduled run
- PR-only voorstel naar content-repo
- Schema-validatie via GitHub Action
- Brondiversiteit per week bewaken

---

---

## 📤 Weekly Output Afspraken (Definitief)

Vanaf nu levert iedere wekelijkse run altijd twee onderdelen, in vaste volgorde:

```
=== news.json ===
<Schema-valide JSON array>

=== news-preview.html ===
<Eenvoudige leesbare HTML preview>
```

### 1️⃣ news.json
- Is de enige ‘source of truth’
- 100% conform `news.schema.json`
- Bevat verplicht veld: `language` ("nl" of "en")
- Maximaal 3 artikelen
- Exact 2 `relevanceBullets`
- Alleen geldige JSON array (geen uitleg, geen markdown)

### 2️⃣ news-preview.html
- Bevat exact dezelfde inhoud als de JSON
- Geen styling of design complexiteit
- Alleen:
  - Titel
  - Taalindicatie (NL / EN)
  - Datum
  - Bron
  - Quote
  - Samenvatting
  - 2 relevance bullets
  - Klikbare link naar originele bron
- Link opent in nieuw tabblad
- Indien `language = "en"`:
  - Linktekst: “Lees het originele artikel (Engels)”
- Indien `language = "nl"`:
  - Linktekst: “Lees het originele artikel”

Doel van HTML-preview:
- Snel leesbaar
- Intern reviewbaar
- Direct deelbaar
- Geen afhankelijkheid van JSON-weergave

---

## 🌍 Taalbeleid

- Alleen artikelen in Nederlands (nl) of Engels (en)
- Andere talen worden uitgesloten
- `language` is verplicht veld in schema
- Sales-website toont taalbadge op basis van dit veld

---

## 🏁 Kwaliteitsprincipes

Iedere week gelden de volgende vaste regels:

- Maximaal 3 artikelen
- Niet de eerste 3, maar de BESTE 3
- Interne scoring (niet zichtbaar in output)
- Maximaal 1 artikel per bron
- Voorkeur voor thematische spreiding
- Geen herhaling van dezelfde bron als alternatieven beschikbaar zijn
- Alleen pers / redactionele bronnen
- Geen productlanceringen of investeringsnieuws

---

## 🎯 Strategische Positionering

De nieuwssectie is geen algemene AI-nieuwsfeed.

Het is een structureel bewijsdossier dat aantoont:

- Shadow AI is reëel
- Governance loopt achter
- Data leakage risico is concreet
- Compliance exposure neemt toe
- Organisaties gecontroleerde AI nodig hebben

Dit ondersteunt:
- Salesgesprekken
- Homepage messaging
- Thought leadership
- Positionering van pseudoAI

---

Einde Canvas.



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



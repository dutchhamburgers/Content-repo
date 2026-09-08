# PseudoAI legal documents

This directory is the canonical public content location for definitive PseudoAI legal documents.

`doc/legal/nl` contains the Dutch public documents. `doc/legal/en` contains the English public documents. PseudoAI-Sales uses these files as an external content source.

## Markdown is the source, PDF is build output

Each document exists twice under the same basename:

- `<name>.md` — the source of truth. Edit this file.
- `<name>.pdf` — generated from the Markdown. Never edit by hand.

PseudoAI-Sales fetches the `.md` to render the document inline on the website, and links to the `.pdf` for download. Because both are addressed by the same basename, existing raw GitHub URLs to the PDFs stay valid.

The site reads these files from `main` in this repository, so a change here must be merged **before** any PseudoAI-Sales change that depends on it. A `.md` that is not on `main` yet leaves the website showing its "Documenttekst niet beschikbaar" fallback.

Earlier versions of these PDFs were Word exports. They used Bodoni MT Black for bold text and Symbol-font bullets from the Unicode private use area, which rendered as a display font and as empty squares outside Word. Regenerating from Markdown avoids both.

## Rebuilding the PDFs

After editing any `.md`, regenerate the PDFs and commit both files together:

```
npm run build:legal                              # all documents
node scripts/build-legal-pdfs.mjs nl/pseudoai-privacyverklaring   # one document
```

The build renders the Markdown through a print stylesheet in `scripts/legal-html.mjs` and prints it with headless Chromium. It needs a Chromium-based browser: Playwright's own download if present, otherwise an installed Edge or Chrome.

## Supported Markdown

The documents use a deliberately small subset, matched by both the PDF builder and the website renderer:

- `---` front matter with `title`, `language` and optional `effectiveDate` / `effectiveDateLabel`
- ATX headings (`#` … `######`)
- paragraphs, where consecutive lines stay on separate lines so address blocks keep their shape
- `**bold**` spans
- `-` unordered lists
- pipe tables with a header row

Anything outside this subset renders as plain text. Extend `scripts/legal-markdown.mjs` and the site's `legalMarkdown.ts` together if a document needs more.

## Document index

Do not duplicate personal data, administrative information, addresses, or company details in this README or related configuration; keep those details only inside the legal documents themselves where applicable.

`doc/priv_addendum` is a legacy location for the earlier Dutch privacy and data processing addendum. Keep it available for backwards compatibility unless all downstream references have been migrated.

| Document | Nederlands | Engels |
| --- | --- | --- |
| Privacy Policy | `doc/legal/nl/pseudoai-privacyverklaring` | `doc/legal/en/pseudoai-privacy-policy` |
| Terms of Service | `doc/legal/nl/pseudoai-gebruiksvoorwaarden` | `doc/legal/en/pseudoai-terms-of-service` |
| Privacy and Data Processing Addendum | `doc/legal/nl/pseudoai-privacy-en-gegevensverwerkingsaddendum` | `doc/legal/en/pseudoai-privacy-and-data-processing-addendum` |

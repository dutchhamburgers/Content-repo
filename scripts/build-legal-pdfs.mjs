// Renders every doc/legal/<lang>/*.md source to the PDF of the same name.
//
// The Markdown files are the source of truth; the PDFs are build output kept at
// stable paths so published raw GitHub URLs keep working. Run with:
//   node scripts/build-legal-pdfs.mjs            (all documents)
//   node scripts/build-legal-pdfs.mjs nl/pseudoai-privacyverklaring

import { chromium } from 'playwright-core'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { parseFrontMatter, parseBlocks } from './legal-markdown.mjs'
import { documentHtml } from './legal-html.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const legalRoot = path.join(repoRoot, 'doc', 'legal')

async function launchBrowser() {
  // Prefer Playwright's own build; fall back to an installed Chromium-based
  // browser so the script also runs where browsers were not downloaded.
  const attempts = [undefined, 'chromium', 'msedge', 'chrome']
  let lastError
  for (const channel of attempts) {
    try {
      return await chromium.launch(channel ? { channel } : {})
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`No Chromium-based browser available for PDF rendering.\n${lastError?.message ?? ''}`)
}

async function collectSources(filter) {
  const sources = []
  for (const lang of await readdir(legalRoot, { withFileTypes: true })) {
    if (!lang.isDirectory()) continue
    for (const entry of await readdir(path.join(legalRoot, lang.name))) {
      if (!entry.endsWith('.md')) continue
      const id = `${lang.name}/${entry.replace(/\.md$/, '')}`
      if (!filter.length || filter.some(f => id.includes(f))) sources.push(id)
    }
  }
  return sources.sort()
}

const sources = await collectSources(process.argv.slice(2))
if (!sources.length) {
  console.error('No matching legal Markdown sources found.')
  process.exit(1)
}

const browser = await launchBrowser()
const page = await browser.newPage()

for (const id of sources) {
  const source = await readFile(path.join(legalRoot, `${id}.md`), 'utf8')
  const { meta, body } = parseFrontMatter(source)
  await page.setContent(documentHtml(meta, parseBlocks(body)), { waitUntil: 'load' })
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '25mm', bottom: '25mm', left: '25mm', right: '25mm' },
  })
  await writeFile(path.join(legalRoot, `${id}.pdf`), pdf)
  console.log(`${id}.pdf  (${(pdf.length / 1024).toFixed(0)} kB)`)
}

await browser.close()

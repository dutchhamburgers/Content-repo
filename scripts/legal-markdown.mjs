// Minimal Markdown reader for the legal documents in doc/legal.
//
// The legal sources deliberately use a small subset of Markdown: front matter,
// ATX headings, paragraphs, bold spans, unordered lists and pipe tables. Parsing
// only that subset keeps the PDF build free of third-party dependencies and
// keeps it aligned with the renderer the sales site uses for the same files.

/** Split `---` front matter off the top of a document. */
export function parseFrontMatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: source }

  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!field) continue
    meta[field[1]] = field[2].trim().replace(/^"(.*)"$/, '$1')
  }
  return { meta, body: source.slice(match[0].length) }
}

const splitRow = line =>
  line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map(cell => cell.trim())

const isTableRow = line => /^\s*\|.*\|\s*$/.test(line)
const isDivider = line => /^\s*\|?[\s:-]*-[\s|:-]*$/.test(line) && line.includes('-')

/**
 * Parse a document body into blocks:
 *   {type:'heading', level, text} | {type:'paragraph', lines:[]}
 *   {type:'list', items:[]}       | {type:'table', head:[], rows:[[]]}
 */
export function parseBlocks(body) {
  const lines = body.split(/\r?\n/)
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i += 1
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() })
      i += 1
      continue
    }

    if (isTableRow(line) && isDivider(lines[i + 1] ?? '')) {
      const head = splitRow(line)
      const rows = []
      i += 2
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]))
        i += 1
      }
      blocks.push({ type: 'table', head, rows })
      continue
    }

    if (/^\s*-\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, '').trim())
        i += 1
      }
      blocks.push({ type: 'list', items })
      continue
    }

    // A paragraph runs until a blank line or the start of another block. Its
    // lines are kept separate so address blocks stay on their own lines.
    const paragraph = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*-\s+/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'paragraph', lines: paragraph })
  }

  return blocks
}

/** Split inline text into plain and bold segments. */
export function parseInline(text) {
  const segments = []
  const pattern = /\*\*(.+?)\*\*/g
  let cursor = 0
  let match

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) segments.push({ bold: false, text: text.slice(cursor, match.index) })
    segments.push({ bold: true, text: match[1] })
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) segments.push({ bold: false, text: text.slice(cursor) })

  return segments.map(s => ({ ...s, text: s.text.replace(/\\([*_`[\]])/g, '$1') }))
}

// Turns parsed legal-document blocks into the print HTML the PDFs render from.
//
// The palette and type sizes are taken from the original Word exports so the
// documents keep their familiar look. What changed is the bold face: those
// exports used Bodoni MT Black, a display font that renders badly outside Word,
// so bold spans now use the real bold weight of the body family.

import { parseInline } from './legal-markdown.mjs'

const INK = '#000000'
const HEADING = '#0F4761'
const TABLE_BORDER = '#B8C7D1'
const TABLE_STRIPE = '#EAF1F5'

const escapeHtml = value =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const renderInline = text =>
  parseInline(text)
    .map(seg => (seg.bold ? `<strong>${escapeHtml(seg.text)}</strong>` : escapeHtml(seg.text)))
    .join('')

function renderBlocks(blocks) {
  return blocks
    .map(block => {
      switch (block.type) {
        case 'heading':
          return `<h${block.level}>${renderInline(block.text)}</h${block.level}>`
        case 'list':
          return `<ul>${block.items.map(item => `<li>${renderInline(item)}</li>`).join('')}</ul>`
        case 'table': {
          const head = block.head.map(cell => `<th>${renderInline(cell)}</th>`).join('')
          const rows = block.rows
            .map(row => `<tr>${row.map(cell => `<td>${renderInline(cell)}</td>`).join('')}</tr>`)
            .join('')
          return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`
        }
        default:
          return `<p>${block.lines.map(renderInline).join('<br>')}</p>`
      }
    })
    .join('\n')
}

export const documentHtml = (meta, blocks) => `<!doctype html>
<html lang="${escapeHtml(meta.language || 'nl')}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(meta.title || 'PseudoAI')}</title>
<style>
  /* Liberation Serif is metric-compatible with Times New Roman, so the same
     page breaks appear whether the build runs on Windows or on Linux CI. */
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    font-family: "Liberation Serif", "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.32;
    color: ${INK};
  }
  h1, h2, h3, h4 { color: ${HEADING}; font-weight: normal; line-height: 1.2; break-after: avoid; }
  h1 { font-size: 20pt; margin: 0 0 14pt; }
  h2 { font-size: 16pt; margin: 20pt 0 8pt; }
  h3 { font-size: 14pt; margin: 16pt 0 6pt; }
  h1 + p, h2 + p, h3 + p { margin-top: 0; }
  p { margin: 0 0 10pt; orphans: 2; widows: 2; }
  strong { font-weight: bold; }
  ul { margin: 0 0 10pt; padding-left: 22pt; }
  li { margin-bottom: 3pt; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 12pt;
    font-family: "Liberation Sans", Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.28;
  }
  th, td { border: 1px solid ${TABLE_BORDER}; padding: 5pt 6pt; text-align: left; vertical-align: top; }
  thead th { background: ${HEADING}; color: #FFFFFF; font-weight: bold; }
  thead { display: table-header-group; }
  tbody tr:nth-child(even) { background: ${TABLE_STRIPE}; }
  tr { break-inside: avoid; }
</style>
</head>
<body>
${renderBlocks(blocks)}
</body>
</html>`

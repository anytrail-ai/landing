// Reads a PDF's text in the browser, so a catalogue too big to send whole
// (Bedrock's document limit is 4.5 MB; product photos push most real
// catalogues past it) can still be parsed from its text alone. Scanned PDFs
// have no text layer and come back empty.

// Items whose baselines are this close (PDF units, ~points) share a row.
const ROW_TOLERANCE = 3

/**
 * pdf.js text items → one string per visual row, top to bottom, left to right.
 * getTextContent() returns items in content-stream order, which for tables is
 * often column by column; a price list read that way loses which price belongs
 * to which product, so rows are rebuilt from each item's position.
 */
export function itemsToLines(items) {
  const rows = []
  for (const it of items) {
    if (!it?.transform || typeof it.str !== 'string' || !it.str.trim()) continue
    const x = it.transform[4]
    const y = it.transform[5]
    let row = rows.find((r) => Math.abs(r.y - y) <= ROW_TOLERANCE)
    if (!row) {
      row = { y, cells: [] }
      rows.push(row)
    }
    row.cells.push({ x, str: it.str.trim() })
  }
  return rows
    .sort((a, b) => b.y - a.y)
    .map((r) => r.cells.sort((a, b) => a.x - b.x).map((c) => c.str).join(' '))
}

/**
 * Extracts up to `maxChars` of text from a PDF File, page by page.
 * pdf.js is loaded on demand: it is large, and only this path needs it.
 */
export async function extractPdfText(file, { maxChars, onProgress = () => {} }) {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  try {
    let text = ''
    for (let n = 1; n <= doc.numPages && text.length < maxChars; n++) {
      onProgress(n, doc.numPages)
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      const lines = itemsToLines(content.items)
      if (lines.length) text += `${lines.join('\n')}\n\n`
      page.cleanup()
    }
    const truncated = text.length > maxChars
    return { text: text.slice(0, maxChars).trim(), truncated }
  } finally {
    await doc.destroy()
  }
}

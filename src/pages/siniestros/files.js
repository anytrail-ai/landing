// Byte-level file builders for the demo, dependency-free: a store-only ZIP
// writer (photos are already compressed, deflate would buy nothing) and a
// one-page text PDF for the seeded pólizas, reportes and cotizaciones.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

export function crc32(bytes) {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function dosDateTime(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, day }
}

// entries: [{ name: 'carpeta/archivo.jpg', data: Uint8Array, date?: Date }]
export function buildZip(entries) {
  const enc = new TextEncoder()
  const locals = []
  const centrals = []
  let offset = 0
  for (const entry of entries) {
    const name = enc.encode(entry.name)
    const data = entry.data
    const crc = crc32(data)
    const { time, day } = dosDateTime(entry.date ?? new Date())

    const local = new DataView(new ArrayBuffer(30))
    local.setUint32(0, 0x04034b50, true)
    local.setUint16(4, 20, true)
    local.setUint16(6, 0x0800, true) // UTF-8 names (acentos, ñ)
    local.setUint16(8, 0, true) // stored
    local.setUint16(10, time, true)
    local.setUint16(12, day, true)
    local.setUint32(14, crc, true)
    local.setUint32(18, data.length, true)
    local.setUint32(22, data.length, true)
    local.setUint16(26, name.length, true)
    local.setUint16(28, 0, true)
    locals.push(new Uint8Array(local.buffer), name, data)

    const central = new DataView(new ArrayBuffer(46))
    central.setUint32(0, 0x02014b50, true)
    central.setUint16(4, 20, true)
    central.setUint16(6, 20, true)
    central.setUint16(8, 0x0800, true)
    central.setUint16(10, 0, true)
    central.setUint16(12, time, true)
    central.setUint16(14, day, true)
    central.setUint32(16, crc, true)
    central.setUint32(20, data.length, true)
    central.setUint32(24, data.length, true)
    central.setUint16(28, name.length, true)
    central.setUint32(42, offset, true)
    centrals.push(new Uint8Array(central.buffer), name)

    offset += 30 + name.length + data.length
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(8, entries.length, true)
  end.setUint16(10, entries.length, true)
  end.setUint32(12, centralSize, true)
  end.setUint32(16, offset, true)
  return concat([...locals, ...centrals, new Uint8Array(end.buffer)])
}

function concat(parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let at = 0
  for (const p of parts) {
    out.set(p, at)
    at += p.length
  }
  return out
}

// PDF string literal in WinAnsi: Latin-1 covers every Spanish letter, and
// anything outside it (curly quotes, emoji) degrades to "?".
function pdfText(s) {
  let out = ''
  for (const ch of String(s)) {
    const code = ch.codePointAt(0)
    if (ch === '(' || ch === ')' || ch === '\\') out += `\\${ch}`
    else if (code < 128) out += ch
    else if (code < 256) out += `\\${code.toString(8).padStart(3, '0')}`
    else out += '?'
  }
  return `(${out})`
}

// doc: { header, title, subtitle, rows: [[label, value]], notes: [string] }
export function buildPdf(doc) {
  const ops = []
  const text = (x, y, size, font, s) => ops.push(`BT /${font} ${size} Tf ${x} ${y} Td ${pdfText(s)} Tj ET`)
  // Letterhead band
  ops.push('0.184 0.435 0.310 rg 0 772 612 20 re f')
  text(40, 778, 9, 'F2', doc.header ?? '')
  ops.push('0 0 0 rg')
  text(40, 730, 18, 'F2', doc.title)
  if (doc.subtitle) text(40, 710, 10, 'F1', doc.subtitle)
  ops.push('0.85 0.85 0.85 RG 0.8 w 40 695 m 572 695 l S')
  let y = 670
  for (const [label, value] of doc.rows ?? []) {
    text(40, y, 10, 'F2', label)
    text(210, y, 10, 'F1', value)
    y -= 20
  }
  y -= 10
  for (const note of doc.notes ?? []) {
    text(40, y, 9, 'F1', note)
    y -= 14
  }
  ops.push('0.85 0.85 0.85 RG 40 60 m 572 60 l S')
  text(40, 44, 8, 'F1', 'Documento generado para la demostración. Datos ficticios.')
  const stream = ops.join('\n')

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  // Every char in the body is ASCII (escapes above), so string length is the
  // byte offset the xref table needs.
  let body = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((obj, i) => {
    offsets.push(body.length)
    body += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const xrefAt = body.length
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const off of offsets) body += `${String(off).padStart(10, '0')} 00000 n \n`
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`
  return new TextEncoder().encode(body)
}

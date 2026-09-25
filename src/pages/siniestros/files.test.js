import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildPdf, buildZip, crc32 } from './files'
import { localClassify } from './localClassify'

const unzipAvailable = (() => {
  try {
    execFileSync('unzip', ['-v'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
})()

describe('crc32', () => {
  it('matches the reference value', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926)
  })
})

describe('buildZip', () => {
  it.skipIf(!unzipAvailable)('produces an archive unzip accepts, accented names included', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sin-zip-'))
    const file = join(dir, 'x.zip')
    const zip = buildZip([
      { name: 'Siniestro_1/fotos/IMG-1.jpg', data: new Uint8Array([1, 2, 3]) },
      { name: 'Siniestro_1/resumen.txt', data: new TextEncoder().encode('Póliza') },
    ])
    writeFileSync(file, zip)
    const out = execFileSync('unzip', ['-t', file]).toString()
    expect(out).toContain('No errors detected')
    expect(execFileSync('unzip', ['-p', file, 'Siniestro_1/resumen.txt']).toString()).toBe('Póliza')
  })
})

describe('buildPdf', () => {
  it('writes a PDF whose xref offsets point at each object', () => {
    const bytes = buildPdf({ title: 'Póliza (amplia)', rows: [['Placas', 'PXL-452-C']] })
    const text = new TextDecoder('latin1').decode(bytes)
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    const xrefAt = Number(text.match(/startxref\n(\d+)/)[1])
    expect(text.slice(xrefAt, xrefAt + 4)).toBe('xref')
    const offsets = [...text.slice(xrefAt).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]))
    offsets.forEach((off, i) => expect(text.slice(off, off + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`))
    // Accents are octal-escaped, parentheses escaped.
    expect(text).toContain('(P\\363liza \\(amplia\\)) Tj')
  })
})

describe('localClassify', () => {
  it('reads identifiers out of a caption', () => {
    const c = localClassify({ text: 'Siniestro 04-2291834, póliza 5100-448120-03, placas PXL-452-C de Qualitas' })
    expect(c.identifiers).toEqual({ numero: '04-2291834', poliza: '5100-448120-03', placas: 'PXL-452-C' })
    expect(c.fields.aseguradora).toBe('Qualitas')
    expect(c.relevant).toBe(true)
  })

  it('guesses document kind from the file name and treats greetings as noise', () => {
    expect(localClassify({ attachment: { name: 'COT-1192 Versa.pdf', mime: 'application/pdf' } }).kind).toBe('cotizacion')
    expect(localClassify({ attachment: { name: 'x.jpg', mime: 'image/jpeg' } }).kind).toBe('foto')
    expect(localClassify({ text: 'Buen día equipo' }).relevant).toBe(false)
  })

  it('matches a known expediente by placas', () => {
    const c = localClassify({ text: 'las del RKT-318-B', context: { expedientes: [{ id: 'exp-3', placas: 'RKT318B' }] } })
    expect(c.matchId).toBe('exp-3')
  })
})

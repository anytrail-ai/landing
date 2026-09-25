// Stylised "phone photos" of damaged cars for the seeded conversation, drawn
// as SVG so the demo ships no stock imagery. Photos a presenter uploads live
// are real files and never go through here.

const W = 1200
const H = 900

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  const r = c(n >> 16)
  const g = c((n >> 8) & 0xff)
  const b = c(n & 0xff)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function scene(setting) {
  if (setting === 'calle') {
    return `
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      <rect y="360" width="${W}" height="120" fill="#b9b3a6"/>
      <rect x="80" y="250" width="260" height="230" fill="#d8cfbf"/><rect x="380" y="200" width="300" height="280" fill="#cbbfab"/>
      <rect x="720" y="270" width="420" height="210" fill="#ddd5c6"/>
      <rect y="480" width="${W}" height="${H - 480}" fill="url(#road)"/>
      <rect x="0" y="690" width="${W}" height="10" fill="#e9e3cf" opacity=".6"/>`
  }
  return `
    <rect width="${W}" height="${H}" fill="url(#wall)"/>
    <rect y="470" width="${W}" height="${H - 470}" fill="url(#floor)"/>
    <rect x="120" y="470" width="10" height="${H - 470}" fill="#e8e1c8" opacity=".5" transform="skewX(-18)"/>
    <rect x="980" y="470" width="10" height="${H - 470}" fill="#e8e1c8" opacity=".5" transform="skewX(18)"/>`
}

function wheel(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1c1c1c"/><circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="#9aa0a6"/><circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="#5f6368"/>`
}

function sideBody(body, color) {
  const dark = shade(color, -0.18)
  const glass = '#3b4a55'
  if (body === 'pickup') {
    return `
      <path d="M150 600 L150 520 Q160 480 220 470 L420 460 L500 360 Q520 340 560 340 L700 340 Q740 342 760 380 L800 460 L1060 460 Q1080 462 1080 490 L1080 600 Z" fill="${color}"/>
      <path d="M520 370 L560 350 L690 350 L740 450 L500 455 Z" fill="${glass}"/>
      <rect x="800" y="440" width="270" height="22" fill="${dark}"/>
      <rect x="150" y="585" width="930" height="26" fill="${dark}"/>
      ${wheel(300, 610, 72)}${wheel(930, 610, 72)}`
  }
  if (body === 'suv') {
    return `
      <path d="M160 600 L160 500 Q170 460 240 450 L380 440 L460 330 Q480 310 520 310 L900 310 Q950 312 980 360 L1040 450 Q1060 470 1060 510 L1060 600 Z" fill="${color}"/>
      <path d="M480 340 L520 322 L690 322 L690 440 L420 445 Z" fill="${glass}"/><path d="M705 322 L890 322 Q920 325 940 360 L990 440 L705 440 Z" fill="${glass}"/>
      <rect x="160" y="585" width="900" height="26" fill="${dark}"/>
      ${wheel(310, 610, 68)}${wheel(900, 610, 68)}`
  }
  return `
    <path d="M140 600 L140 520 Q150 480 230 470 L400 455 L500 370 Q530 350 580 350 L790 350 Q840 352 880 400 L940 455 L1040 470 Q1070 480 1070 520 L1070 600 Z" fill="${color}"/>
    <path d="M520 380 L580 362 L700 362 L700 450 L430 455 Z" fill="${glass}"/><path d="M715 362 L790 362 Q825 365 850 395 L900 450 L715 450 Z" fill="${glass}"/>
    <rect x="140" y="585" width="930" height="24" fill="${dark}"/>
    ${wheel(300, 610, 64)}${wheel(910, 610, 64)}`
}

function endBody(body, color, rear) {
  const dark = shade(color, -0.2)
  const light = rear ? '#b3261e' : '#f3f0e0'
  const top = body === 'sedan' ? 330 : 290
  return `
    <path d="M250 640 L250 500 Q260 450 330 440 L420 ${top} Q440 ${top - 20} 480 ${top - 20} L720 ${top - 20} Q760 ${top - 20} 780 ${top} L870 440 Q940 450 950 500 L950 640 Z" fill="${color}"/>
    <path d="M440 ${top + 10} Q455 ${top - 5} 485 ${top - 5} L715 ${top - 5} Q745 ${top - 5} 760 ${top + 10} L830 435 L370 435 Z" fill="#3b4a55"/>
    <rect x="270" y="470" width="120" height="40" rx="10" fill="${light}"/><rect x="810" y="470" width="120" height="40" rx="10" fill="${light}"/>
    ${rear ? `<rect x="480" y="520" width="240" height="60" rx="6" fill="${dark}"/><rect x="540" y="535" width="120" height="30" fill="#f1efe6"/>` : `<rect x="440" y="480" width="320" height="70" rx="10" fill="${dark}"/><rect x="540" y="580" width="120" height="30" fill="#f1efe6"/>`}
    <rect x="250" y="600" width="700" height="40" fill="${dark}"/>
    <rect x="270" y="640" width="90" height="70" rx="10" fill="#1c1c1c"/><rect x="840" y="640" width="90" height="70" rx="10" fill="#1c1c1c"/>`
}

function detailBody(color) {
  return `
    <rect width="${W}" height="${H}" fill="url(#panel)"/>
    <path d="M0 610 Q600 560 ${W} 620" stroke="${shade(color, -0.25)}" stroke-width="6" fill="none"/>
    <circle cx="930" cy="760" r="210" fill="#1c1c1c"/><circle cx="930" cy="760" r="120" fill="#9aa0a6"/>`
}

// Damage marks: a dent (dark radial smudge), scratch lines exposing primer,
// and for "cristal" a cracked-glass star.
function damage({ x, y, size = 1, type = 'golpe' }) {
  const s = size
  const scratches = Array.from({ length: 6 }, (_, i) => {
    const y0 = y - 40 * s + i * 14 * s
    return `<path d="M${x - 140 * s} ${y0} l${60 * s} ${6 * s} l${50 * s} ${-8 * s} l${70 * s} ${10 * s} l${60 * s} ${-4 * s}" stroke="#ece6d6" stroke-width="${2 + (i % 2)}" fill="none" opacity=".85"/>`
  }).join('')
  if (type === 'cristal') {
    const rays = Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2
      return `<path d="M${x} ${y} l${Math.cos(a) * 90 * s} ${Math.sin(a) * 90 * s} l${Math.cos(a + 0.3) * 40 * s} ${Math.sin(a + 0.3) * 40 * s}" stroke="#f8f8f4" stroke-width="2" fill="none"/>`
    }).join('')
    return `<g>${rays}<circle cx="${x}" cy="${y}" r="${10 * s}" fill="#f8f8f4"/></g>`
  }
  return `<g><ellipse cx="${x}" cy="${y}" rx="${150 * s}" ry="${80 * s}" fill="url(#dent)"/>${scratches}</g>`
}

export function carPhotoSvg({ view = 'side', body = 'sedan', color = '#8a8f98', setting = 'patio', damages = [], stamp = '' }) {
  let car
  if (view === 'front') car = endBody(body, color, false)
  else if (view === 'rear') car = endBody(body, color, true)
  else if (view === 'detail') car = detailBody(color)
  else car = sideBody(body, color)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ea"/><stop offset="1" stop-color="#eef2ee"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d4c7"/><stop offset="1" stop-color="#c5beae"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#77746c"/><stop offset="1" stop-color="#4c4a45"/></linearGradient>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d6c69"/><stop offset="1" stop-color="#3f3e3c"/></linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(color, 0.12)}"/><stop offset=".6" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -0.2)}"/></linearGradient>
    <radialGradient id="dent"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".7" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
  </defs>
  ${view === 'detail' ? '' : scene(setting)}
  ${view === 'detail' ? '' : `<ellipse cx="600" cy="${view === 'side' ? 680 : 710}" rx="${view === 'side' ? 520 : 400}" ry="40" fill="#000" opacity=".25"/>`}
  ${car}
  ${damages.map(damage).join('')}
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <text x="${W - 40}" y="${H - 36}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#fff" opacity=".9">${stamp}</text>
</svg>`
}

export const svgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

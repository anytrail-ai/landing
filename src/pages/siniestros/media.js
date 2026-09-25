import { carPhotoSvg, svgDataUrl } from './photos'

// Display URL for a photo attachment: the object URL of an uploaded file, or
// the seeded SVG, built once per file name (the same photo shows in the chat,
// the expediente grid and the lightbox).
const urls = new Map()

export function srcOf(att) {
  if (att.url) return att.url
  if (!att.photo) return ''
  if (!urls.has(att.name)) urls.set(att.name, svgDataUrl(carPhotoSvg(att.photo)))
  return urls.get(att.name)
}

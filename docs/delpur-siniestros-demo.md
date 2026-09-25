# Delpur: siniestros demo

`/es/siniestros_demo` (noindex, not linked). Full-window app: a simulated
WhatsApp Business phone on the left stands in for their number in coexistence,
and the Siniestros platform on the right files every photo, document and message
into its expediente.

## What it shows (maps to the proposal)

| Proposal | In the demo |
|---|---|
| 01 WhatsApp en coexistencia | Simulated phone: groups and private chats, same number. The note under the phone says production uses their real number. |
| 02 Clasificación por siniestro | Each message gets a tag in the chat (expediente number, `Procesando`, `Por revisar`) plus a toast. It matches by siniestro number, póliza or placas, and falls back to asegurado or vehículo, then to chat context. |
| 03 Datos extraídos | Datos del siniestro: every field shows which file and which person it came from. |
| 04 Fotos listas para descargar | Photo grid with a lightbox, one-by-one download, and "Descargar todas (ZIP)". |
| 05 Expediente en un solo lugar | Documents, photos, and an Actividad timeline (who, which chat, when). "Descargar expediente" builds a ZIP with fotos/, documentos/ and resumen.txt. |
| 06 Estatus y búsqueda | Derived status (Nuevo, En integración, Completo), plus manual Enviado and Cerrado. Pendientes checklist. Search by siniestro, póliza, placas or asegurado; filters for aseguradora, estatus and date range. |

## Running it in the meeting

1. The page opens with two older cases on file: a finished CR-V case (Qualitas) and a Mazda case still in progress (HDI).
2. **Reproducir mañana** plays 23 messages (about 45 s). **Siguiente** steps one message at a time, which is better when talking over it. **Seguir chat** makes the phone follow each incoming message.
3. Points worth pausing on:
   - Paola sends the siniestro number, then photos with no text: they are filed by context.
   - Jorge posts "Van las fotos del Versa" in the group: they are filed by vehicle, although nobody wrote a number.
   - Fernando writes before anyone has given him a claim number, then sends his AXA póliza. A case opens and takes in his earlier message. Later, Mariana posts the AXA number in the group, and it joins the same case.
   - Luis posts an unlabelled photo: it goes to **Por revisar**, and one click assigns it.
   - The Versa case ends with only "Póliza" pending.
4. **Live:** open any chat, choose "Enviar como", and type a message or attach a real photo or PDF from the paperclip. That message goes to `POST /demo/siniestros/classify` (Claude via Bedrock, multimodal, about 3–20 s). If the backend can't be reached, a pattern fallback files it, and the timeline marks it "reglas locales".
5. The reset button restores the starting state.

The scripted dates shift so the live morning is always "today". All names, pólizas and plates are invented. The seeded photos are drawn as SVG and download as real JPEGs; the seeded PDFs are generated in the browser.

## Backend

`demo-backend/src/api/siniestros.ts`, route in `handler.ts`, 300 calls per IP per day in its own rate-limit bucket. The endpoint is stateless: the browser sends the current expedientes and the last 8 messages of the chat with every call. The upload cap is about 3.4 MB of actual file. Photos are downscaled to 1600 px in the browser before upload; the original stays in the expediente.
Deploy: `cd demo-backend && npm run deploy` (after merge).

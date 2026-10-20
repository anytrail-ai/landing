# Guide PDFs

The PDFs under `public/guias/<folder>/` are the guide pages printed by headless
Chrome; the print styles at the end of `src/pages/WhatsappGuide.css` hide the
site chrome. To regenerate one after editing its copy in `src/i18n/copy.js`:

```sh
npm run build
npx vite preview --port 4173 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --no-pdf-header-footer --print-to-pdf=public/guias/anuncios-meta/Guia-conectar-anuncios-Meta.pdf \
  http://localhost:4173/es/guias/conectar-anuncios-meta
```

Then update the `pdf.note` (page count and size) in the guide's copy block.

`Guia-conectar-WhatsApp-coexistencia.pdf` predates this and was laid out
separately with reportlab; regenerating it this way changes its look.

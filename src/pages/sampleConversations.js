// Customer-side scripts keyed to the sample catalogue
// (demo-backend/src/quote/sample-catalog.json). Each plays through the REAL
// agent one turn at a time; only the customer's lines are scripted.
export const SAMPLE_CONVERSATIONS = [
  {
    id: 'priced',
    label: 'Todo en catálogo',
    hint: 'Autolavado, todos los productos tienen precio',
    lines: [
      'Hola, tengo un autolavado y busco una hidrolavadora',
      'Lavamos unos 40 autos al día y tenemos corriente de 220V',
      'Me interesa la hidrolavadora eléctrica de 2500 PSI 220V. Necesito 2, más 2 mangueras de alta presión de 15 m y 2 lanzas espumadoras',
      'Sí, mándame la cotización',
    ],
  },
  {
    id: 'unpriced',
    label: 'Precio faltante',
    hint: 'Taller con grasa pesada: la de agua caliente diésel no tiene precio',
    lines: [
      'Buenas tardes, tengo un taller mecánico y la grasa ya no sale con agua fría',
      'No tenemos 220V en el patio, preferimos diésel',
      'Va, quiero 1 hidrolavadora de agua caliente con quemador diésel y 1 manguera de alta temperatura de 15 m',
      'Perfecto, cotízame eso',
    ],
  },
  {
    id: 'no_match',
    label: 'Producto fuera de catálogo',
    hint: 'Pide un compresor que el catálogo no tiene',
    lines: [
      'Hola, estoy equipando una obra',
      'Necesito limpiar fachadas y no hay corriente en el sitio',
      'Dame 1 hidrolavadora a gasolina de 3200 PSI y también un compresor de aire de 50 litros',
      'Sí, cotízame las dos cosas',
    ],
  },
]

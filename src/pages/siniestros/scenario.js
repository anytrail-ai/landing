// The scripted morning at Delpur: two older cases already on file, then three
// new ones that arrive mixed together across groups and private chats. Every
// person, policy and plate here is invented. Each message carries the answer
// the classifier would give (`cls`), so the scripted run never depends on the
// network; only messages the presenter types or uploads go to the model.

export const OWN_NUMBER = '+52 81 8000 1200'

export const CHATS = [
  { id: 'g-ajustadores', name: 'Ajustadores Delpur', isGroup: true, members: 'Jorge, Mariana, Luis, tú' },
  { id: 'g-qualitas', name: 'Qualitas · Delpur Norte', isGroup: true, members: 'Brenda (Cabina), Jorge, tú' },
  { id: 'p-jorge', name: 'Jorge Treviño', subtitle: 'Ajustador' },
  { id: 'p-paola', name: 'Paola Garza', subtitle: '+52 81 1733 4410' },
  { id: 'p-fernando', name: 'Fernando Ríos', subtitle: '+52 81 2290 7815' },
  { id: 'p-autofix', name: 'Taller Autofix Cumbres', subtitle: 'Cuenta de empresa' },
  { id: 'p-ana', name: 'Ana Sofía Leal', subtitle: '+52 81 1450 6632' },
]

const cls = (kind, { numero = null, poliza = null, placas = null, ...fields } = {}, summary = '', extra = {}) => ({
  kind,
  identifiers: { numero, poliza, placas },
  fields: {
    aseguradora: null,
    fecha: null,
    ubicacion: null,
    ajustador: null,
    asegurado: null,
    vehiculo: null,
    monto: null,
    ...fields,
  },
  matchId: null,
  confidence: 'alta',
  summary,
  relevant: true,
  ...extra,
})

const noise = (summary) => cls('mensaje', {}, summary, { relevant: false })

const stampOf = (at) => {
  const d = at.slice(0, 10).split('-').reverse().join('/')
  return `${d} ${at.slice(11, 16)}`
}

let photoN = 100
const photo = (at, spec) => ({
  type: 'photo',
  name: `IMG-${at.slice(0, 10).replace(/-/g, '')}-WA0${photoN++}.jpg`,
  mime: 'image/jpeg',
  photo: { ...spec, stamp: stampOf(at) },
})

const doc = (name, pdf) => ({ type: 'doc', name, mime: 'application/pdf', pdf })

// Vehicles, so photos of one case look like the same car.
const CRV = { body: 'suv', color: '#7b1f24' }
const MAZDA = { body: 'sedan', color: '#9ea4ad' }
const VERSA = { body: 'sedan', color: '#e7e5df' }
const HILUX = { body: 'pickup', color: '#2c3440' }
const RIO = { body: 'sedan', color: '#2f5d8a' }

const at = (d, t) => `2026-09-${d}T${t}:00-06:00`

// ---- Already on file (processed instantly when the demo loads) -------------

const HISTORY = [
  {
    chatId: 'g-qualitas', sender: 'Brenda · Qualitas Cabina', at: at(19, '16:10'),
    text: 'Nuevo reporte: siniestro 04-2290115, asegurado Luis Ferrara, Honda CR-V 2019 placas SMR-771-A. Choque en Gonzalitos y Ruiz Cortines. Ajustador: Jorge Treviño.',
    cls: cls('mensaje', { numero: '04-2290115', placas: 'SMR-771-A', aseguradora: 'Qualitas', asegurado: 'Luis Ferrara', vehiculo: 'Honda CR-V 2019', ubicacion: 'Av. Gonzalitos y Ruiz Cortines, Monterrey', ajustador: 'Jorge Treviño', fecha: '2026-09-19' }, 'Qualitas reporta siniestro de Honda CR-V por choque en Gonzalitos'),
  },
  { chatId: 'g-ajustadores', sender: 'Jorge Treviño', at: at(19, '16:48'), text: 'Fotos del CR-V de Gonzalitos', cls: cls('mensaje', { vehiculo: 'Honda CR-V' }, 'Jorge anuncia fotos del CR-V') },
  ...['front', 'side', 'detail', 'rear'].map((view, i) => ({
    chatId: 'g-ajustadores', sender: 'Jorge Treviño', at: at(19, `16:4${9}`),
    attachment: photo(at(19, '16:49'), { ...CRV, view, setting: 'calle', damages: i === 3 ? [] : [{ x: view === 'front' ? 360 : 300, y: 520, size: 1.1 }] }),
    cls: cls('foto', {}, ['Frente dañado del CR-V', 'Costado izquierdo con golpe', 'Detalle de salpicadera', 'Vista trasera sin daño'][i]),
  })),
  {
    chatId: 'p-jorge', sender: 'Jorge Treviño', at: at(19, '18:02'), text: 'Reporte y póliza del 04-2290115',
    attachment: doc('Reporte_04-2290115.pdf', {
      header: 'DELPUR AJUSTADORES · REPORTE DE SINIESTRO', title: 'Reporte del ajustador', subtitle: 'Siniestro 04-2290115 · Qualitas',
      rows: [['Asegurado', 'Luis Ferrara'], ['Vehículo', 'Honda CR-V 2019'], ['Placas', 'SMR-771-A'], ['Fecha', '19/09/2026 15:35'], ['Ubicación', 'Av. Gonzalitos y Ruiz Cortines, Monterrey'], ['Ajustador', 'Jorge Treviño'], ['Tipo', 'Colisión, tercero responsable']],
      notes: ['Daño en frente y costado izquierdo. Unidad circula por su propio pie.'],
    }),
    cls: cls('reporte', { numero: '04-2290115', placas: 'SMR-771-A' }, 'Reporte del ajustador: colisión con tercero responsable'),
  },
  {
    chatId: 'p-jorge', sender: 'Jorge Treviño', at: at(19, '18:02'),
    attachment: doc('Poliza_Qualitas_5100-331207-01.pdf', {
      header: 'QUALITAS · CARÁTULA DE PÓLIZA', title: 'Póliza de automóviles', subtitle: 'Póliza 5100-331207-01 · Amplia',
      rows: [['Asegurado', 'Luis Ferrara'], ['Vehículo', 'Honda CR-V 2019'], ['Placas', 'SMR-771-A'], ['Vigencia', '01/03/2026 al 01/03/2027'], ['Deducible', '5% daños materiales']],
    }),
    cls: cls('poliza', { poliza: '5100-331207-01', placas: 'SMR-771-A' }, 'Póliza Qualitas amplia, vigente'),
  },
  {
    chatId: 'p-autofix', sender: 'Taller Autofix Cumbres', at: at(20, '10:15'), text: 'Cotización CR-V',
    attachment: doc('COT-1175_CRV_SMR771A.pdf', {
      header: 'TALLER AUTOFIX CUMBRES · COTIZACIÓN', title: 'Cotización COT-1175', subtitle: 'Honda CR-V 2019 · placas SMR-771-A',
      rows: [['Defensa delantera', '$9,800'], ['Faro izquierdo', '$6,250'], ['Salpicadera izquierda', '$7,900'], ['Pintura y mano de obra', '$14,500'], ['Total', '$38,450 MXN']],
    }),
    cls: cls('cotizacion', { placas: 'SMR-771-A', monto: '$38,450 MXN' }, 'Cotización de Autofix por $38,450'),
  },
  {
    chatId: 'g-ajustadores', sender: 'Mariana Cantú', at: at(21, '13:20'),
    text: 'Siniestro HDI 91-20260921-3384, Mazda 3 2022 placas RFD-209-E de Ana Sofía Leal. Carretera Nacional km 268, Santiago. Lo atiendo yo.',
    cls: cls('mensaje', { numero: '91-20260921-3384', placas: 'RFD-209-E', aseguradora: 'HDI', vehiculo: 'Mazda 3 2022', asegurado: 'Ana Sofía Leal', ubicacion: 'Carretera Nacional km 268, Santiago', ajustador: 'Mariana Cantú', fecha: '2026-09-21' }, 'Mariana toma el siniestro HDI del Mazda 3'),
  },
  ...['front', 'detail'].map((view) => ({
    chatId: 'p-ana', sender: 'Ana Sofía Leal', at: at(21, '13:41'),
    attachment: photo(at(21, '13:41'), { ...MAZDA, view, setting: 'calle', damages: [{ x: 600, y: view === 'front' ? 360 : 400, type: 'cristal', size: 1.3 }] }),
    cls: cls('foto', { placas: 'RFD-209-E' }, view === 'front' ? 'Parabrisas estrellado del Mazda 3' : 'Detalle del impacto en cristal'),
  })),
  {
    chatId: 'p-ana', sender: 'Ana Sofía Leal', at: at(21, '13:45'), text: 'Les dejo mi póliza',
    attachment: doc('poliza HDI.pdf', {
      header: 'HDI SEGUROS · PÓLIZA', title: 'Póliza de automóviles', subtitle: 'Póliza HDI-A-2203958',
      rows: [['Asegurada', 'Ana Sofía Leal'], ['Vehículo', 'Mazda 3 2022'], ['Placas', 'RFD-209-E'], ['Vigencia', '15/06/2026 al 15/06/2027']],
    }),
    cls: cls('poliza', { poliza: 'HDI-A-2203958', placas: 'RFD-209-E', asegurado: 'Ana Sofía Leal' }, 'Póliza HDI de Mazda 3, vigente'),
  },
]

// ---- This morning (played step by step) -------------------------------------

const LIVE = [
  {
    chatId: 'g-qualitas', sender: 'Brenda · Qualitas Cabina', at: at(24, '09:02'),
    text: 'Nuevo reporte: siniestro 04-2291834, asegurado Carlos Mendoza, Nissan Versa 2021 placas PXL-452-C. Colisión en Av. Constitución y Zaragoza. Asignado a Jorge Treviño.',
    cls: cls('mensaje', { numero: '04-2291834', placas: 'PXL-452-C', aseguradora: 'Qualitas', asegurado: 'Carlos Mendoza', vehiculo: 'Nissan Versa 2021', ubicacion: 'Av. Constitución y Zaragoza, Monterrey', ajustador: 'Jorge Treviño', fecha: '2026-09-24' }, 'Qualitas reporta colisión del Nissan Versa en Constitución'),
  },
  {
    chatId: 'p-paola', sender: 'Paola Garza', at: at(24, '09:05'),
    text: 'Buenos días, me dijeron que les mandara aquí las fotos de mi camioneta. El siniestro es el 26-0918-77412 de GNP',
    cls: cls('mensaje', { numero: '26-0918-77412', aseguradora: 'GNP', asegurado: 'Paola Garza', fecha: '2026-09-24' }, 'Asegurada de GNP abre el caso de su camioneta'),
  },
  {
    chatId: 'p-paola', sender: 'Paola Garza', at: at(24, '09:05'),
    attachment: photo(at(24, '09:05'), { ...HILUX, view: 'front', damages: [{ x: 360, y: 520, size: 1.2 }] }),
    cls: cls('foto', {}, 'Frente de pickup oscura con golpe en faro izquierdo'),
  },
  {
    chatId: 'p-paola', sender: 'Paola Garza', at: at(24, '09:06'),
    attachment: photo(at(24, '09:06'), { ...HILUX, view: 'side', damages: [{ x: 1000, y: 520, size: 1 }] }),
    cls: cls('foto', {}, 'Costado de la pickup con daño en caja'),
  },
  {
    chatId: 'p-paola', sender: 'Paola Garza', at: at(24, '09:06'),
    attachment: doc('Poliza GNP Paola Garza.pdf', {
      header: 'GNP SEGUROS · PÓLIZA DE AUTOS', title: 'Póliza de automóviles', subtitle: 'Póliza AUT-7730192 · Cobertura amplia',
      rows: [['Asegurada', 'Paola Garza Villarreal'], ['Vehículo', 'Toyota Hilux 2023'], ['Placas', 'RKT-318-B'], ['Serie', '8AJHA8CD7P2601187'], ['Vigencia', '10/01/2026 al 10/01/2027'], ['Deducible', '5% daños materiales']],
    }),
    cls: cls('poliza', { poliza: 'AUT-7730192', placas: 'RKT-318-B', vehiculo: 'Toyota Hilux 2023', aseguradora: 'GNP' }, 'Póliza GNP amplia de Toyota Hilux 2023, vigente'),
  },
  {
    chatId: 'p-paola', sender: 'Tú', outgoing: true, at: at(24, '09:07'),
    text: 'Recibido, Sra. Garza. Su ajustadora es Mariana Cantú, la contactará en breve.',
    cls: cls('mensaje', { ajustador: 'Mariana Cantú' }, 'Se informa la ajustadora asignada'),
  },
  {
    chatId: 'g-ajustadores', sender: 'Jorge Treviño', at: at(24, '09:31'), text: 'Van las fotos del Versa de Constitución',
    cls: cls('mensaje', { vehiculo: 'Nissan Versa' }, 'Jorge anuncia fotos del Versa', { confidence: 'media' }),
  },
  ...[
    ['front', [{ x: 700, y: 500, size: 1.1 }], 'Frente del Versa, golpe en defensa derecha'],
    ['side', [{ x: 950, y: 520, size: 1 }], 'Costado derecho con raspones'],
    ['rear', [], 'Parte trasera sin daño visible'],
    ['detail', [{ x: 520, y: 420, size: 1.6 }], 'Acercamiento del golpe en defensa'],
  ].map(([view, damages, summary], i) => ({
    chatId: 'g-ajustadores', sender: 'Jorge Treviño', at: at(24, `09:3${2 + (i > 1 ? 1 : 0)}`),
    attachment: photo(at(24, '09:32'), { ...VERSA, view, damages, setting: 'calle' }),
    cls: cls('foto', {}, summary),
  })),
  { chatId: 'g-ajustadores', sender: 'Mariana Cantú', at: at(24, '09:40'), text: 'Buen día equipo', cls: noise('Saludo') },
  {
    chatId: 'p-fernando', sender: 'Fernando Ríos', at: at(24, '09:52'),
    text: 'Buenas, tuve un choque hace una hora en Av. Lázaro Cárdenas, me dijeron que les mandara mi póliza',
    cls: cls('mensaje', { ubicacion: 'Av. Lázaro Cárdenas, San Pedro Garza García' }, 'Asegurado reporta choque en Lázaro Cárdenas, sin número de siniestro', { confidence: 'baja' }),
  },
  {
    chatId: 'p-fernando', sender: 'Fernando Ríos', at: at(24, '09:53'),
    attachment: doc('poliza_axa.pdf', {
      header: 'AXA SEGUROS · CARÁTULA', title: 'Póliza Auto', subtitle: 'Póliza 38-UJ-291845',
      rows: [['Asegurado', 'Fernando Ríos Treviño'], ['Vehículo', 'Kia Rio 2020'], ['Placas', 'SXT-118-D'], ['Vigencia', '02/05/2026 al 02/05/2027'], ['Cobertura', 'Amplia']],
    }),
    cls: cls('poliza', { poliza: '38-UJ-291845', placas: 'SXT-118-D', aseguradora: 'AXA', asegurado: 'Fernando Ríos', vehiculo: 'Kia Rio 2020', fecha: '2026-09-24' }, 'Póliza AXA amplia de Kia Rio 2020, vigente'),
  },
  {
    chatId: 'p-fernando', sender: 'Fernando Ríos', at: at(24, '09:54'),
    attachment: photo(at(24, '09:54'), { ...RIO, view: 'rear', damages: [{ x: 600, y: 540, size: 1.3 }], setting: 'calle' }),
    cls: cls('foto', {}, 'Parte trasera del Kia Rio con golpe en cajuela'),
  },
  {
    chatId: 'p-jorge', sender: 'Jorge Treviño', at: at(24, '10:10'),
    attachment: doc('Reporte_04-2291834.pdf', {
      header: 'DELPUR AJUSTADORES · REPORTE DE SINIESTRO', title: 'Reporte del ajustador', subtitle: 'Siniestro 04-2291834 · Qualitas',
      rows: [['Asegurado', 'Carlos Mendoza'], ['Póliza', '5100-448120-03'], ['Vehículo', 'Nissan Versa 2021'], ['Placas', 'PXL-452-C'], ['Fecha', '24/09/2026 08:40'], ['Ubicación', 'Av. Constitución y Zaragoza, Monterrey'], ['Ajustador', 'Jorge Treviño']],
      notes: ['Impacto frontal derecho. Asegurado responsable. Pendiente valuación en taller.'],
    }),
    cls: cls('reporte', { numero: '04-2291834', poliza: '5100-448120-03', placas: 'PXL-452-C' }, 'Reporte del ajustador del Versa, asegurado responsable'),
  },
  {
    chatId: 'p-autofix', sender: 'Taller Autofix Cumbres', at: at(24, '10:25'), text: 'Cotización de la Hilux de la Sra. Garza',
    attachment: doc('COT-1187 Hilux.pdf', {
      header: 'TALLER AUTOFIX CUMBRES · COTIZACIÓN', title: 'Cotización COT-1187', subtitle: 'Toyota Hilux 2023 · placas RKT-318-B',
      rows: [['Faro izquierdo LED', '$14,900'], ['Defensa delantera', '$11,200'], ['Costado de caja', '$9,780'], ['Pintura y mano de obra', '$16,500'], ['Total', '$52,380 MXN']],
    }),
    cls: cls('cotizacion', { placas: 'RKT-318-B', monto: '$52,380 MXN' }, 'Cotización de Autofix por $52,380 para la Hilux'),
  },
  {
    chatId: 'g-ajustadores', sender: 'Luis Ortega', at: at(24, '10:40'),
    attachment: photo(at(24, '10:40'), { ...VERSA, view: 'detail', damages: [{ x: 700, y: 380, size: 1.2 }] }),
    cls: cls('foto', {}, 'Acercamiento de pintura dañada, sin datos del vehículo', { confidence: 'baja' }),
  },
  {
    chatId: 'g-ajustadores', sender: 'Mariana Cantú', at: at(24, '10:48'),
    text: 'Reporte del Kia Rio de Fernando Ríos: siniestro AXA 7712-2026-004518, quedó en Av. Lázaro Cárdenas 2400, San Pedro. Yo lo llevo.',
    cls: cls('mensaje', { numero: '7712-2026-004518', asegurado: 'Fernando Ríos', vehiculo: 'Kia Rio', ajustador: 'Mariana Cantú', ubicacion: 'Av. Lázaro Cárdenas 2400, San Pedro Garza García' }, 'Mariana asigna número AXA al choque del Kia Rio'),
  },
  {
    chatId: 'g-ajustadores', sender: 'Mariana Cantú', at: at(24, '10:50'),
    attachment: doc('Reporte ajustador 7712-2026-004518.pdf', {
      header: 'DELPUR AJUSTADORES · REPORTE DE SINIESTRO', title: 'Reporte del ajustador', subtitle: 'Siniestro 7712-2026-004518 · AXA',
      rows: [['Asegurado', 'Fernando Ríos Treviño'], ['Vehículo', 'Kia Rio 2020'], ['Placas', 'SXT-118-D'], ['Fecha', '24/09/2026 08:55'], ['Ubicación', 'Av. Lázaro Cárdenas 2400, San Pedro'], ['Ajustador', 'Mariana Cantú']],
      notes: ['Alcance por tercero. Tercero con seguro vigente, se gestiona recuperación.'],
    }),
    cls: cls('reporte', { numero: '7712-2026-004518', placas: 'SXT-118-D' }, 'Reporte AXA: alcance por tercero asegurado'),
  },
  {
    chatId: 'g-qualitas', sender: 'Brenda · Qualitas Cabina', at: at(24, '11:05'), text: 'Jorge, ¿ya tienes la cotización del 04-2291834?',
    cls: cls('mensaje', { numero: '04-2291834' }, 'Qualitas pide la cotización del Versa'),
  },
  {
    chatId: 'p-autofix', sender: 'Taller Autofix Cumbres', at: at(24, '11:20'), text: 'Va la del Versa',
    attachment: doc('COT-1192 Versa PXL452C.pdf', {
      header: 'TALLER AUTOFIX CUMBRES · COTIZACIÓN', title: 'Cotización COT-1192', subtitle: 'Nissan Versa 2021 · placas PXL-452-C',
      rows: [['Defensa delantera', '$6,400'], ['Faro derecho', '$4,950'], ['Pintura y mano de obra', '$8,300'], ['Total', '$19,650 MXN']],
    }),
    cls: cls('cotizacion', { placas: 'PXL-452-C', monto: '$19,650 MXN' }, 'Cotización de Autofix por $19,650 para el Versa'),
  },
  { chatId: 'p-paola', sender: 'Paola Garza', at: at(24, '11:32'), text: 'Muchas gracias!', cls: noise('Agradecimiento') },
]

const withIds = (list, prefix) => list.map((m, i) => ({ id: `${prefix}-${i + 1}`, ...m }))

const BASE_DAY = Date.UTC(2026, 8, 24)

// The script is written for 24 Sept 2026. Shift every date in it (ISO
// timestamps, dd/mm/yyyy on the PDFs and photo stamps, yyyymmdd in file
// names) so the scripted morning is always "today" in the meeting.
export function scenarioFor(now = new Date()) {
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const delta = Math.round((todayUtc - BASE_DAY) / 86_400_000)
  const shifted = (d) => new Date(Date.UTC(2026, 8, Number(d) + delta))
  const p2 = (n) => String(n).padStart(2, '0')
  const parts = (d) => {
    const x = shifted(d)
    return [String(x.getUTCFullYear()), p2(x.getUTCMonth() + 1), p2(x.getUTCDate())]
  }
  const json = JSON.stringify({ history: withIds(HISTORY, 'h'), live: withIds(LIVE, 'm') })
    .replace(/2026-09-(\d{2})/g, (_, d) => parts(d).join('-'))
    .replace(/(\d{2})\/09\/2026/g, (_, d) => parts(d).reverse().join('/'))
    .replace(/202609(\d{2})/g, (_, d) => parts(d).join(''))
  return { ...JSON.parse(json), today: parts(24).join('-') }
}

// The first case is marked as already sent to the insurer, so the list shows
// a finished case next to the ones being built.
export const HISTORY_STATUS = [{ numero: '04-2290115', status: 'enviado' }]

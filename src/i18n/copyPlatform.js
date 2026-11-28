// Copy for the platform home page at / and /es: one page for the whole
// product, with the CRM (/crm) and AP + AR (/ar) sites behind it.
//
// Module `page` values are keys of ROUTES; a module without one has no
// "explore" link yet. `early: true` shows the early-access chip.
export const PLATFORM_COPY = {
  en: {
    meta: {
      title: 'Anytrail | The AI Platform for Distributors, From Quote to Cash',
      description:
        'Anytrail is one platform on top of your ERP for distributors and industrial suppliers: CRM, sourcing, inventory and accounts receivable, with AI agents doing the routine work.',
      ogLocale: 'en_US',
    },
    navCta: 'Book a call',
    // Section links for the navbar variants that carry them. `href` is the id
    // of a section on the home page.
    navLinksLabel: 'Sections',
    navLinks: [
      { href: '#modules', label: 'Platform' },
      { href: '#resources', label: 'Resources' },
    ],
    otherLanguage: 'Español',
    footerTagline: 'One platform for distributors, from the first quote to the paid invoice. © 2026 Anytrail',
    hero: {
      // The headline is `lead` plus one of `phrases`, which take turns.
      lead: 'For distributors, AI that',
      phrases: [
        'drafts orders and quotes',
        'forecasts demand',
        'finds sales opportunities',
        'gets you paid',
      ],
      subtitle:
        'Anytrail plugs into your ERP and the tools around it, and puts AI agents to work on the routine jobs in sales, operations and finance.',
      cta: 'Book a call',
      secondary: 'Explore the platform',
    },
    // The hero's product demonstration: the real app's shell and two of its
    // screens, redrawn from lead-crm/web (AppNav, PipelineCard, Inbox). The
    // company and people are the app's own fictional demo tenant.
    mockup: {
      ariaLabel:
        'The Anytrail app for an example wholesaler. Two screens: the opportunities pipeline, with leads in four stages and what each one needs next, and the inbox, where the agent has drafted a reply and a quote that wait for approval.',
      // The sidebar lists the modules (names come from modules.items). CRM
      // is the one drawn; its two screens sit under it. Any other module
      // opens `gate`, a floater that asks for the call. {module} is replaced
      // with the module's name.
      modulesLabel: 'Modules',
      nav: { pipeline: 'Opportunities', inbox: 'Inbox' },
      company: 'Voltara Wholesale',
      // The signed-in user at the foot of the sidebar. The photo is a stock
      // portrait (public/mockup-avatar.jpg, Unsplash photo 1494790108377 by
      // Michael Dam, Unsplash licence); the name is invented.
      userName: 'Lucy Morgan',
      gate: {
        title: 'Want to see {module}?',
        body: 'We will walk you through it on a 30-minute call, with your own business in mind.',
        cta: 'Book a call',
        back: 'Back to CRM',
      },
      pipeline: {
        title: 'Opportunities',
        subtitle: 'What each deal needs today, most urgent first.',
        tabs: ['Pipeline', 'After the sale · 6', 'Revive'],
        won: 'Won this month · 3 · $120,000.00',
        chips: ['Lost · 4', 'Rescheduled · 2'],
        health: 'To quote: median wait 3 h',
        columns: [
          {
            name: 'To qualify',
            count: 6,
            cards: [
              { name: 'Ryan Castillo', meta: 'Castillo Wireless · Hialeah', chip: 'In follow-up', tone: 'muted', line: 'Agent is asking: units per month', action: 'Open' },
              { name: 'Jordan Ellis', meta: 'Ellis Phone Repair · Sofia Navarro', chip: 'Call now', tone: 'red', line: 'Call at 4:30 p.m.', action: 'Qualify' },
            ],
          },
          {
            name: 'To quote',
            count: 6,
            cards: [
              { name: 'Andrew Tanner', meta: 'Phone Lab Miami · Derek Lawson', chip: 'Quote pending', tone: 'amber', line: 'Product: Nova A25 256 GB · 40 units', action: 'Quote' },
              { name: 'Laura Bennett', meta: 'Root Mobile · Derek Lawson', chip: 'Quote pending', tone: 'amber', line: 'Waiting for 1 h', action: 'Quote' },
            ],
          },
          {
            name: 'Follow-up',
            count: 7,
            cards: [
              { name: 'Rodney Galloway', meta: 'Connect South Group', chip: 'In follow-up', tone: 'muted', line: 'Quote #48211 · $45,600.00 · 3 d ago', note: 'Follow-up 2 of 4 · next: message tomorrow', action: 'Open' },
            ],
          },
          {
            name: 'Negotiating',
            count: 5,
            cards: [
              { name: 'Patricia Vance', meta: 'Wynwood Tech · Derek Lawson', chip: 'Reply to customer', tone: 'red', line: 'Customer: “Perfect, send me the payment details”', action: 'Reply' },
            ],
          },
        ],
      },
      inbox: {
        search: 'Search chats and messages',
        rows: [
          { name: 'Andrew Tanner', preview: 'Can you do 40 units of the A25?', unread: 2, intent: 86, active: true },
          { name: 'Patricia Vance', preview: 'Perfect, send me the payment details', unread: 1 },
          { name: 'Ryan Castillo', preview: 'Two stores in Hialeah' },
          { name: 'Laura Bennett', preview: 'You: Sending the quote in a moment', mail: true },
          { name: 'Rodney Galloway', preview: 'You: Did you get a chance to review it?' },
        ],
        thread: {
          name: 'Andrew Tanner',
          phone: '+1 (305) 555-0142',
          day: 'Today',
          messages: [
            { from: 'in', text: 'Hi, saw your ad for wholesale phones. Can you do 40 units of the A25?', time: '10:02' },
            { from: 'out', text: 'Hi Andrew! Yes, the Nova A25 256 GB is in stock. Is this for one store or several?', time: '10:02', by: 'Bot' },
            { from: 'in', text: 'One store in Miami. I need them by Friday.', time: '10:04' },
          ],
          recommendation: 'Bot recommendation awaiting approval',
          recommendationHint: 'The customer is waiting. Send it, edit it or dismiss it. · Prepared 2 min ago',
          draftLabel: 'Draft · pending approval',
          draft: '40 units of the Nova A25 256 GB come to $7,960.00, delivered Thursday. I have the quote ready as a PDF. Shall I send it?',
          approve: 'Approve & Send',
          regenerate: 'Regenerate',
          quote: 'Create quote',
        },
        panel: {
          intent: 'Buying intent',
          signals: ['Asked for a specific quantity', 'Has a deadline: Friday', 'Came from the wholesale phones ad'],
          status: 'Status',
          statusValue: 'To quote',
          quotes: 'Quotes',
          quoteRow: 'C-1042 · draft',
          quoteTotal: '$7,960.00',
        },
      },
    },
    modules: {
      label: 'Platform',
      // The heading is `titleLead` plus one of `titlePhrases`, taking turns.
      titleLead: 'One platform to',
      titlePhrases: ['win the next order', 'keep the right stock', 'get paid on time'],
      intro:
        'Bring your data together once, and agents can work across all of it. Begin with one module and add the rest when you need them.',
      early: 'Early access',
      explore: 'Explore',
      stepsLabel: 'Steps',
      // Each module's `scene` is the stepped demo on the right: three states
      // of a small product screen. A step has a `label` (its pill), an
      // optional `source` line above the panel (where the work came from),
      // the panel's `title` and `meta`, then any of: `rows` (name, optional
      // `sub`, `tag` with a `tone` of new | warn | bad | good, and `value`),
      // `levels` (a stock chart), a `note` in the agent's voice, a `stamp`.
      // A row may carry `img` (a product thumbnail) and a step `photo` (a
      // thumbnail beside its title). The four product photos in
      // public/products are from Unsplash (Unsplash licence): hose by
      // @tatiana19, bearing by @photosbyfrk, valve by @guilleb, gloves by
      // @slrncl.
      items: [
        {
          id: 'crm',
          name: 'CRM',
          title: 'A CRM that tells reps who to call, and why.',
          body: 'Every inquiry is answered and qualified as it lands, on WhatsApp and email. Reps open the day to a ranked list, a brief for each account and a drafted quote or follow-up.',
          page: 'crmHome',
          scene: {
            ariaLabel:
              'Three steps: a new WhatsApp inquiry arrives, the agent qualifies it, and it appears at the top of the rep’s day with a quote drafted.',
            steps: [
              {
                label: 'Inquiry arrives',
                source: 'WhatsApp · 10:02',
                title: 'Inbox',
                meta: '3 unread',
                rows: [
                  { name: 'Andrew Tanner', sub: 'Can you do 40 units of the A25?', tag: 'New', tone: 'new' },
                  { name: 'Patricia Vance', sub: 'Perfect, send me the payment details' },
                  { name: 'Ryan Castillo', sub: 'Two stores in Hialeah' },
                ],
              },
              {
                label: 'Agent qualifies',
                source: 'Andrew Tanner · Phone Lab Miami',
                title: 'What the agent found out',
                meta: 'Buying intent 86',
                rows: [
                  { name: 'Product', value: 'Nova A25 256 GB' },
                  { name: 'Quantity', value: '40 units' },
                  { name: 'Needed by', value: 'Friday' },
                ],
                note: 'Three questions asked, three answered. Ready to quote.',
              },
              {
                label: 'Rep’s next step',
                source: 'Derek Lawson · today',
                title: 'Work these first',
                meta: '$21,410 open',
                rows: [
                  { name: 'Andrew Tanner', tag: 'Quote pending', tone: 'warn', value: '$7,960' },
                  { name: 'Patricia Vance', tag: 'Reply to customer', tone: 'bad', value: '$9,350' },
                  { name: 'Rodney Galloway', tag: 'Follow-up 2 of 4', value: '$4,100' },
                ],
                stamp: 'Quote drafted for Andrew',
              },
            ],
          },
        },
        {
          id: 'sourcing',
          name: 'Sourcing',
          title: 'An answer for the item you do not carry.',
          body: 'When a customer asks for something outside your catalog, the agent checks your vendors and partners for a match, with price and lead time, before the customer asks someone else.',
          scene: {
            ariaLabel:
              'Three steps: a customer asks for a part that is not stocked, the agent collects three vendor options, and a priced answer is ready for the rep to approve.',
            steps: [
              {
                label: 'Not in your catalog',
                source: 'Email · Grupo Alba',
                title: 'Requested',
                meta: '1 line',
                rows: [
                  { name: 'Gear pump GP-7', sub: 'Quantity 4 · needed this month', tag: 'No match', tone: 'bad' },
                ],
              },
              {
                label: 'Vendors checked',
                source: '3 vendors answered',
                title: 'Options found',
                meta: 'Per unit',
                rows: [
                  { name: 'Vendor A', sub: '12 days', value: '$412' },
                  { name: 'Vendor B', sub: '5 days', tag: 'Best', tone: 'good', value: '$398' },
                  { name: 'Vendor C', sub: '3 days', value: '$430' },
                ],
              },
              {
                label: 'Answer ready',
                source: 'Reply to Grupo Alba',
                title: '4 × Gear pump GP-7',
                meta: 'Delivered in 5 days',
                rows: [
                  { name: 'Cost', value: '$1,592' },
                  { name: 'Your price', sub: '20% margin', value: '$1,990' },
                ],
                note: 'We can supply the four pumps for $1,990, delivered in five days.',
                stamp: 'Waiting for the rep to approve',
              },
            ],
          },
        },
        {
          id: 'inventory',
          name: 'Inventory',
          title: 'Reorder before the shelf is empty.',
          body: 'Demand is forecast per item and branch from your order history, and replenishment is proposed with the reasoning shown.',
          scene: {
            ariaLabel:
              'Three steps: four stocked items with photos, one of them about to run out; the forecast for that item; and a purchase order drafted for the two items that need it.',
            steps: [
              {
                label: 'What is running low',
                source: 'Monterrey branch · 1,240 items',
                title: 'Watch list',
                meta: '2 need action',
                rows: [
                  { img: '/products/hose.jpg', name: 'Hydraulic hose, 2 in', sub: '86 m on hand', tag: '9 days left', tone: 'bad' },
                  { img: '/products/bearing.jpg', name: 'Tapered bearing 30205', sub: '42 on hand', tag: '3 weeks left', tone: 'warn' },
                  { img: '/products/valve.jpg', name: 'Balancing valve, 1 in', sub: '18 on hand', tag: 'Covered', tone: 'good' },
                  { img: '/products/gloves.jpg', name: 'Leather work gloves, L', sub: '210 pairs on hand', tag: 'Covered', tone: 'good' },
                ],
              },
              {
                label: 'Why it runs out',
                source: 'Forecast from 14 months of orders',
                photo: '/products/hose.jpg',
                title: 'Hydraulic hose, 2 in',
                meta: 'Stock by week',
                levels: [100, 82, 61, 43, 24, 9],
                rows: [{ name: 'Expected demand, next 30 days', value: '310 m' }],
                note: 'At this pace the shelf is empty in about nine days. The vendor needs nine to deliver.',
              },
              {
                label: 'Reorder proposed',
                source: 'Purchase order draft',
                title: 'Order today',
                meta: 'Arrives the 12th',
                rows: [
                  { img: '/products/hose.jpg', name: 'Hydraulic hose, 2 in', sub: '240 m · Mangueras del Norte', value: '$4,416' },
                  { img: '/products/bearing.jpg', name: 'Tapered bearing 30205', sub: '60 units · Rodamientos MX', value: '$1,140' },
                  { name: 'Total', value: '$5,556' },
                ],
                stamp: 'Ready for your approval',
              },
            ],
          },
        },
        {
          id: 'ar',
          name: 'Accounts receivable',
          title: 'From shipped to paid, with nothing stuck in a portal.',
          body: 'Track customer AP portal requirements, rejected invoices, missing documents and payment dates, so every blocked invoice has an owner and a next step.',
          page: 'arHome',
          early: true,
          scene: {
            ariaLabel:
              'Three steps: three open invoices with one rejected, the agent finds the missing purchase order and resubmits, and the invoice is approved with a payment date.',
            steps: [
              {
                label: 'Invoices at risk',
                source: 'Receivables · this week',
                title: 'Open invoices',
                meta: '$20,120',
                rows: [
                  { name: 'INV-8812', sub: 'Norte Hydraulics', tag: 'Rejected', tone: 'bad', value: '$9,720' },
                  { name: 'INV-8774', sub: 'Grupo Alba', tag: '12 days late', tone: 'warn', value: '$6,300' },
                  { name: 'INV-8790', sub: 'Valle Process', tag: 'Approved', tone: 'good', value: '$4,100' },
                ],
              },
              {
                label: 'Blocker found',
                source: 'INV-8812 · customer portal',
                title: 'Why it was rejected',
                meta: 'Norte Hydraulics',
                rows: [
                  { name: 'Reason', value: 'PO number missing' },
                  { name: 'Found', value: 'PO 44817, in the order email' },
                  { name: 'Action', value: 'Resubmitted with the PO' },
                ],
                note: 'The PO was in the original order email. Resubmitted to the portal.',
              },
              {
                label: 'Payment date known',
                source: 'Receivables · updated',
                title: 'Open invoices',
                meta: '$20,120',
                rows: [
                  { name: 'INV-8812', sub: 'Pays on the 15th', tag: 'Approved', tone: 'good', value: '$9,720' },
                  { name: 'INV-8774', sub: 'Reminder sent today', tag: 'Chasing', tone: 'warn', value: '$6,300' },
                ],
                stamp: '1 blocker cleared',
              },
            ],
          },
        },
      ],
    },
  },

  es: {
    meta: {
      title: 'Anytrail | La Plataforma de IA para Distribuidores, de la Cotización al Cobro',
      description:
        'Anytrail es una sola plataforma sobre tu ERP para distribuidores y proveedores industriales: CRM, abastecimiento, inventario y cuentas por cobrar, con agentes de IA que hacen el trabajo rutinario.',
      ogLocale: 'es_ES',
    },
    navCta: 'Agenda una llamada',
    navLinksLabel: 'Secciones',
    navLinks: [
      { href: '#modules', label: 'Plataforma' },
      { href: '#resources', label: 'Recursos' },
    ],
    otherLanguage: 'English',
    footerTagline: 'Una plataforma para distribuidores, de la primera cotización a la factura cobrada. © 2026 Anytrail',
    hero: {
      lead: 'Para distribuidores, IA que',
      phrases: [
        'redacta pedidos y cotizaciones',
        'pronostica la demanda',
        'encuentra oportunidades de venta',
        'consigue que te paguen',
      ],
      subtitle:
        'Anytrail se conecta a tu ERP y a las herramientas que lo rodean, y pone agentes de IA a hacer el trabajo rutinario de ventas, operaciones y finanzas.',
      cta: 'Agenda una llamada',
      secondary: 'Explorar la plataforma',
    },
    mockup: {
      ariaLabel:
        'La aplicación de Anytrail para un mayorista de ejemplo. Dos pantallas: el pipeline de oportunidades, con los prospectos en cuatro etapas y lo que cada uno necesita, y la bandeja, donde el agente redactó una respuesta y una cotización que esperan aprobación.',
      modulesLabel: 'Módulos',
      nav: { pipeline: 'Oportunidades', inbox: 'Bandeja' },
      company: 'Voltara Mayoreo',
      userName: 'Lucía Herrera',
      gate: {
        title: '¿Quieres ver {module}?',
        body: 'Te lo mostramos en una llamada de 30 minutos, pensando en tu negocio.',
        cta: 'Agenda una llamada',
        back: 'Volver a CRM',
      },
      pipeline: {
        title: 'Oportunidades',
        subtitle: 'Lo que necesita cada negocio hoy, lo más urgente primero.',
        tabs: ['Pipeline', 'Después de la venta · 6', 'Reactivar'],
        won: 'Ganados este mes · 3 · $120,000.00',
        chips: ['Perdidos · 4', 'Reprogramados · 2'],
        health: 'Por cotizar: espera media 3 h',
        columns: [
          {
            name: 'Por calificar',
            count: 6,
            cards: [
              { name: 'Raúl Castillo', meta: 'Castillo Celulares · Guadalupe', chip: 'En seguimiento', tone: 'muted', line: 'El agente pregunta: piezas por mes', action: 'Abrir' },
              { name: 'Jorge Elizondo', meta: 'Elizondo Reparaciones · Sofía Treviño', chip: 'Llamar ahora', tone: 'red', line: 'Llamada a las 4:30 p.m.', action: 'Calificar' },
            ],
          },
          {
            name: 'Por cotizar',
            count: 6,
            cards: [
              { name: 'Andrés Tamez', meta: 'Phone Lab Monterrey · Diego Ramírez', chip: 'Cotización pendiente', tone: 'amber', line: 'Producto: Nova A25 256 GB · 40 piezas', action: 'Cotizar' },
              { name: 'Laura Benítez', meta: 'Raíz Móvil · Diego Ramírez', chip: 'Cotización pendiente', tone: 'amber', line: 'Esperando desde hace 1 h', action: 'Cotizar' },
            ],
          },
          {
            name: 'Seguimiento',
            count: 7,
            cards: [
              { name: 'Rodolfo Garza', meta: 'Grupo Conecta Sur', chip: 'En seguimiento', tone: 'muted', line: 'Cotización #48211 · $45,600.00 · hace 3 d', note: 'Seguimiento 2 de 4 · sigue: mensaje mañana', action: 'Abrir' },
            ],
          },
          {
            name: 'En negociación',
            count: 5,
            cards: [
              { name: 'Patricia Villarreal', meta: 'Barrio Tech · Diego Ramírez', chip: 'Responder al cliente', tone: 'red', line: 'Cliente: “Perfecto, mándame datos para el pago”', action: 'Responder' },
            ],
          },
        ],
      },
      inbox: {
        search: 'Buscar chats y mensajes',
        rows: [
          { name: 'Andrés Tamez', preview: '¿Me surten 40 piezas del A25?', unread: 2, intent: 86, active: true },
          { name: 'Patricia Villarreal', preview: 'Perfecto, mándame datos para el pago', unread: 1 },
          { name: 'Raúl Castillo', preview: 'Dos tiendas en Guadalupe' },
          { name: 'Laura Benítez', preview: 'Tú: Te mando la cotización en un momento', mail: true },
          { name: 'Rodolfo Garza', preview: 'Tú: ¿Pudiste revisarla?' },
        ],
        thread: {
          name: 'Andrés Tamez',
          phone: '+52 81 5550 0142',
          day: 'Hoy',
          messages: [
            { from: 'in', text: 'Hola, vi su anuncio de celulares al mayoreo. ¿Me surten 40 piezas del A25?', time: '10:02' },
            { from: 'out', text: '¡Hola, Andrés! Sí, tenemos el Nova A25 256 GB en existencia. ¿Es para una tienda o para varias?', time: '10:02', by: 'Bot' },
            { from: 'in', text: 'Una tienda en Monterrey. Los necesito para el viernes.', time: '10:04' },
          ],
          recommendation: 'Recomendación del bot por aprobar',
          recommendationHint: 'El cliente está esperando. Envíala, edítala o descártala. · Preparada hace 2 min',
          draftLabel: 'Borrador · pendiente de aprobar',
          draft: 'Las 40 piezas del Nova A25 256 GB quedan en $159,200.00, con entrega el jueves. Tengo la cotización lista en PDF. ¿Te la envío?',
          approve: 'Aprobar y enviar',
          regenerate: 'Regenerar',
          quote: 'Crear cotización',
        },
        panel: {
          intent: 'Intención de compra',
          signals: ['Pidió una cantidad específica', 'Tiene fecha límite: viernes', 'Llegó por el anuncio de celulares al mayoreo'],
          status: 'Estado',
          statusValue: 'Por cotizar',
          quotes: 'Cotizaciones',
          quoteRow: 'C-1042 · borrador',
          quoteTotal: '$159,200.00',
        },
      },
    },
    modules: {
      label: 'Plataforma',
      titleLead: 'Una plataforma para',
      titlePhrases: ['ganar el siguiente pedido', 'tener el inventario correcto', 'cobrar a tiempo'],
      intro:
        'Reúne tus datos una sola vez y los agentes pueden trabajar sobre todos. Empieza con un módulo y agrega los demás cuando los necesites.',
      early: 'Acceso anticipado',
      explore: 'Conocer',
      stepsLabel: 'Pasos',
      items: [
        {
          id: 'crm',
          name: 'CRM',
          title: 'Un CRM que le dice al vendedor a quién llamar y por qué.',
          body: 'Cada consulta se responde y se califica en cuanto llega, por WhatsApp y correo. El vendedor empieza el día con una lista ordenada, un resumen de cada cuenta y una cotización o un seguimiento ya redactado.',
          page: 'crmHome',
          scene: {
            ariaLabel:
              'Tres pasos: llega una consulta nueva por WhatsApp, el agente la califica y aparece al inicio del día del vendedor con una cotización en borrador.',
            steps: [
              {
                label: 'Llega la consulta',
                source: 'WhatsApp · 10:02',
                title: 'Bandeja',
                meta: '3 sin leer',
                rows: [
                  { name: 'Andrés Tamez', sub: '¿Me surten 40 piezas del A25?', tag: 'Nuevo', tone: 'new' },
                  { name: 'Patricia Villarreal', sub: 'Perfecto, mándame datos para el pago' },
                  { name: 'Raúl Castillo', sub: 'Dos tiendas en Guadalupe' },
                ],
              },
              {
                label: 'El agente califica',
                source: 'Andrés Tamez · Phone Lab Monterrey',
                title: 'Lo que averiguó el agente',
                meta: 'Intención de compra 86',
                rows: [
                  { name: 'Producto', value: 'Nova A25 256 GB' },
                  { name: 'Cantidad', value: '40 piezas' },
                  { name: 'Lo necesita', value: 'El viernes' },
                ],
                note: 'Tres preguntas hechas, tres respondidas. Listo para cotizar.',
              },
              {
                label: 'Siguiente paso',
                source: 'Diego Ramírez · hoy',
                title: 'Atiende estos primero',
                meta: '$428,200 abiertos',
                rows: [
                  { name: 'Andrés Tamez', tag: 'Cotización pendiente', tone: 'warn', value: '$159,200' },
                  { name: 'Patricia Villarreal', tag: 'Responder al cliente', tone: 'bad', value: '$187,000' },
                  { name: 'Rodolfo Garza', tag: 'Seguimiento 2 de 4', value: '$82,000' },
                ],
                stamp: 'Cotización en borrador para Andrés',
              },
            ],
          },
        },
        {
          id: 'sourcing',
          name: 'Abastecimiento',
          title: 'Una respuesta para lo que no manejas.',
          body: 'Cuando un cliente pide algo fuera de tu catálogo, el agente busca una opción con tus proveedores y aliados, con precio y tiempo de entrega, antes de que el cliente le pregunte a alguien más.',
          scene: {
            ariaLabel:
              'Tres pasos: un cliente pide una pieza que no se maneja, el agente reúne tres opciones de proveedor y deja una respuesta con precio lista para que el vendedor la apruebe.',
            steps: [
              {
                label: 'Fuera de catálogo',
                source: 'Correo · Grupo Alba',
                title: 'Lo que piden',
                meta: '1 partida',
                rows: [
                  { name: 'Bomba de engranes GP-7', sub: 'Cantidad 4 · para este mes', tag: 'Sin equivalente', tone: 'bad' },
                ],
              },
              {
                label: 'Proveedores consultados',
                source: 'Respondieron 3 proveedores',
                title: 'Opciones encontradas',
                meta: 'Por pieza',
                rows: [
                  { name: 'Proveedor A', sub: '12 días', value: '$8,240' },
                  { name: 'Proveedor B', sub: '5 días', tag: 'La mejor', tone: 'good', value: '$7,960' },
                  { name: 'Proveedor C', sub: '3 días', value: '$8,600' },
                ],
              },
              {
                label: 'Respuesta lista',
                source: 'Respuesta a Grupo Alba',
                title: '4 × Bomba de engranes GP-7',
                meta: 'Entrega en 5 días',
                rows: [
                  { name: 'Costo', value: '$31,840' },
                  { name: 'Tu precio', sub: '20% de margen', value: '$39,800' },
                ],
                note: 'Podemos surtir las cuatro bombas en $39,800, con entrega en cinco días.',
                stamp: 'Espera la aprobación del vendedor',
              },
            ],
          },
        },
        {
          id: 'inventory',
          name: 'Inventario',
          title: 'Resurte antes de que el anaquel se vacíe.',
          body: 'La demanda se pronostica por artículo y sucursal con tu historial de pedidos, y el resurtido se propone con su razón a la vista.',
          scene: {
            ariaLabel:
              'Tres pasos: cuatro artículos de inventario con foto, uno a punto de agotarse; el pronóstico de ese artículo; y una orden de compra en borrador para los dos que lo necesitan.',
            steps: [
              {
                label: 'Qué se está acabando',
                source: 'Sucursal Monterrey · 1,240 artículos',
                title: 'Lista de vigilancia',
                meta: '2 requieren acción',
                rows: [
                  { img: '/products/hose.jpg', name: 'Manguera hidráulica, 2 in', sub: '86 m en existencia', tag: 'Quedan 9 días', tone: 'bad' },
                  { img: '/products/bearing.jpg', name: 'Rodamiento cónico 30205', sub: '42 en existencia', tag: 'Quedan 3 semanas', tone: 'warn' },
                  { img: '/products/valve.jpg', name: 'Válvula de balanceo, 1 in', sub: '18 en existencia', tag: 'Cubierto', tone: 'good' },
                  { img: '/products/gloves.jpg', name: 'Guantes de carnaza, G', sub: '210 pares en existencia', tag: 'Cubierto', tone: 'good' },
                ],
              },
              {
                label: 'Por qué se agota',
                source: 'Pronóstico con 14 meses de pedidos',
                photo: '/products/hose.jpg',
                title: 'Manguera hidráulica, 2 in',
                meta: 'Existencia por semana',
                levels: [100, 82, 61, 43, 24, 9],
                rows: [{ name: 'Demanda esperada, próximos 30 días', value: '310 m' }],
                note: 'A este ritmo el anaquel se vacía en unos nueve días. El proveedor tarda nueve en entregar.',
              },
              {
                label: 'Resurtido propuesto',
                source: 'Orden de compra en borrador',
                title: 'Pedir hoy',
                meta: 'Llega el día 12',
                rows: [
                  { img: '/products/hose.jpg', name: 'Manguera hidráulica, 2 in', sub: '240 m · Mangueras del Norte', value: '$88,320' },
                  { img: '/products/bearing.jpg', name: 'Rodamiento cónico 30205', sub: '60 piezas · Rodamientos MX', value: '$22,800' },
                  { name: 'Total', value: '$111,120' },
                ],
                stamp: 'Lista para tu aprobación',
              },
            ],
          },
        },
        {
          id: 'ar',
          name: 'Cuentas por cobrar',
          title: 'De embarcado a cobrado, sin nada atorado en un portal.',
          body: 'Da seguimiento a los requisitos de los portales de tus clientes, las facturas rechazadas, los documentos faltantes y las fechas de pago, para que cada factura bloqueada tenga responsable y siguiente paso.',
          page: 'arHome',
          early: true,
          scene: {
            ariaLabel:
              'Tres pasos: tres facturas abiertas con una rechazada, el agente encuentra la orden de compra faltante y la reenvía, y la factura queda aprobada con fecha de pago.',
            steps: [
              {
                label: 'Facturas en riesgo',
                source: 'Cobranza · esta semana',
                title: 'Facturas abiertas',
                meta: '$402,400',
                rows: [
                  { name: 'INV-8812', sub: 'Norte Hydraulics', tag: 'Rechazada', tone: 'bad', value: '$194,400' },
                  { name: 'INV-8774', sub: 'Grupo Alba', tag: '12 días vencida', tone: 'warn', value: '$126,000' },
                  { name: 'INV-8790', sub: 'Valle Process', tag: 'Aprobada', tone: 'good', value: '$82,000' },
                ],
              },
              {
                label: 'Bloqueo encontrado',
                source: 'INV-8812 · portal del cliente',
                title: 'Por qué la rechazaron',
                meta: 'Norte Hydraulics',
                rows: [
                  { name: 'Motivo', value: 'Falta el número de OC' },
                  { name: 'Encontrado', value: 'OC 44817, en el correo del pedido' },
                  { name: 'Acción', value: 'Reenviada con la OC' },
                ],
                note: 'La OC estaba en el correo del pedido original. Reenviada al portal.',
              },
              {
                label: 'Fecha de pago',
                source: 'Cobranza · actualizado',
                title: 'Facturas abiertas',
                meta: '$402,400',
                rows: [
                  { name: 'INV-8812', sub: 'Se paga el día 15', tag: 'Aprobada', tone: 'good', value: '$194,400' },
                  { name: 'INV-8774', sub: 'Recordatorio enviado hoy', tag: 'En gestión', tone: 'warn', value: '$126,000' },
                ],
                stamp: '1 bloqueo resuelto',
              },
            ],
          },
        },
      ],
    },
  },
}

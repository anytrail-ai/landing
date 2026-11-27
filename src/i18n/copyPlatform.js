// Copy for the platform home page at / and /es: one page for the whole
// product, with the CRM (/crm) and AP + AR (/ar) sites behind it.
//
// Each module's `demo` is the small animated sequence in its cell: `in` is
// something arriving, `flag` the problem, `out` what the agent does about it,
// `stamp` the confirmed result, `bars` a stock level running down.
// Module `page` values are keys of ROUTES; a module without one has no
// "explore" link yet. `early: true` shows the early-access chip.
export const PLATFORM_COPY = {
  en: {
    meta: {
      title: 'Anytrail | The AI Platform for Distributors, From Quote to Cash',
      description:
        'Anytrail is one platform on top of your ERP for distributors and industrial suppliers: CRM, quote and order entry, product data, pricing, inventory, and accounts payable and receivable, with AI agents doing the routine work.',
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
      titlePhrases: ['grow your business', 'protect your margins', 'cut operating costs'],
      intro:
        'Bring your data together once, and agents can work across all of it. Begin with one module and add the rest when you need them.',
      early: 'Early access',
      replayDemo: "Replay",
      explore: 'Explore',
      items: [
        {
          id: 'crm',
          demo: {
            ariaLabel: "The agent ranks three accounts and marks which one to call first, with the reason.",
            lines: [
              {"kind": "in", "text": "Norte Hydraulics", "value": "9 wks"},
              {"kind": "in", "text": "Bajío Packaging", "value": "3 opens"},
              {"kind": "in", "text": "Valle Process", "value": "new stock"},
              {"kind": "out", "text": "Call Norte first: three weeks late on a six-week reorder."},
              {"kind": "stamp", "text": "Brief ready"},
            ],
          },
          name: 'CRM',
          title: 'A CRM that tells reps who to call, and why.',
          body: 'Accounts are ranked from real order history and open conversations. Reps get a brief before the call and a drafted follow-up after it, across WhatsApp, email and phone.',
          page: 'crmHome',
        },
        {
          id: 'quotes',
          demo: {
            ariaLabel: "An emailed RFQ with 14 lines becomes a drafted quote waiting for approval.",
            lines: [
              {"kind": "in", "text": "Email · RFQ_Alba.pdf", "value": "14 lines"},
              {"kind": "out", "text": "Read 14 lines, matched 13 to your catalog."},
              {"kind": "flag", "text": "Line 9: no match", "value": "2 alternatives"},
              {"kind": "stamp", "text": "Q-2291 drafted for approval"},
            ],
          },
          name: 'Quote and order entry',
          title: 'Emailed RFQs and POs become drafts, not typing.',
          body: 'The agent reads the attachment, matches each line to your catalog, and prepares the quote or order for a person to approve.',
          page: 'rfqAutomation',
        },
        {
          id: 'pim',
          demo: {
            ariaLabel: "A messy product entry becomes one clean record published to the ERP and the store.",
            lines: [
              {"kind": "flag", "text": "hose 2in blk 40m ??", "value": "no category"},
              {"kind": "out", "text": "Name: Hydraulic hose, 2 in, black"},
              {"kind": "out", "text": "Cross-ref: 3 vendor part numbers"},
              {"kind": "stamp", "text": "Published to ERP and store"},
            ],
          },
          name: 'Product data',
          title: 'One clean record per product.',
          body: 'Specs, cross-references, images and categories live in one place and publish to your ERP and your storefront.',
        },
        {
          id: 'ecommerce',
          demo: {
            ariaLabel: "An out-of-stock item in the cart is replaced with an in-stock alternative and a suggested add-on.",
            lines: [
              {"kind": "in", "text": "Cart · Seal kit SK-40", "value": "qty 6"},
              {"kind": "flag", "text": "Out of stock", "value": "3 weeks"},
              {"kind": "out", "text": "SK-42 fits the same pump. In stock today."},
              {"kind": "stamp", "text": "Often bought with: O-ring set"},
            ],
          },
          name: 'eCommerce',
          title: 'A storefront that knows what is in stock.',
          body: 'When an item is out, buyers see alternatives you can ship today, and the add-ons that usually go with what is in the cart.',
        },
        {
          id: 'orders',
          demo: {
            ariaLabel: "An order with three lines is split across the branches that can fill each one.",
            lines: [
              {"kind": "in", "text": "Order 5531", "value": "3 lines"},
              {"kind": "out", "text": "Line 1 → Monterrey", "value": "in stock"},
              {"kind": "out", "text": "Line 2 → Monterrey", "value": "in stock"},
              {"kind": "out", "text": "Line 3 → Querétaro", "value": "ships Thu"},
              {"kind": "stamp", "text": "Written to the ERP"},
            ],
          },
          name: 'Order management',
          title: 'Each line goes to the branch that can fill it.',
          body: 'Orders are split and routed by stock, location and promise date, then written back to the ERP.',
        },
        {
          id: 'sourcing',
          demo: {
            ariaLabel: "An item not in the catalog gets three vendor options and the best one is picked.",
            lines: [
              {"kind": "flag", "text": "Requested: gear pump GP-7", "value": "not stocked"},
              {"kind": "in", "text": "Vendor A", "value": "$412 · 12 days"},
              {"kind": "in", "text": "Vendor B", "value": "$398 · 5 days"},
              {"kind": "out", "text": "Vendor B: lower price, a week sooner."},
              {"kind": "stamp", "text": "Option sent to the rep"},
            ],
          },
          name: 'Sourcing',
          title: 'An answer for the item you do not carry.',
          body: 'The agent checks your vendors and partners for a match, with price and lead time, before the customer asks someone else.',
        },
        {
          id: 'pricing',
          demo: {
            ariaLabel: "A quote line priced below the margin floor is flagged and a price is recommended.",
            lines: [
              {"kind": "in", "text": "Q-2279 · line 2", "value": "$41.20"},
              {"kind": "flag", "text": "Below margin floor", "value": "−4%"},
              {"kind": "out", "text": "Recommended for this customer", "value": "$44.80"},
              {"kind": "stamp", "text": "Rule check passed"},
            ],
          },
          name: 'Pricing',
          title: 'A price for this customer and this part.',
          body: 'Recommendations come from contract terms, cost and past deals. Quotes that break a pricing rule are flagged before they are sent.',
        },
        {
          id: 'inventory',
          demo: {
            ariaLabel: "Stock for one item runs down week by week and a reorder is proposed before it runs out.",
            lines: [
              {"kind": "bars", "text": "Hose 2 in · Monterrey", "levels": [100, 82, 61, 43, 24, 9]},
              {"kind": "out", "text": "Runs out in about 9 days at this pace."},
              {"kind": "stamp", "text": "Reorder 240 m by the 12th"},
            ],
          },
          name: 'Inventory',
          title: 'Reorder before the shelf is empty.',
          body: 'Demand is forecast per item and branch, and replenishment is proposed with the reasoning shown.',
        },
        {
          id: 'ar',
          demo: {
            ariaLabel: "A rejected invoice is fixed and resubmitted, and its payment date is known.",
            lines: [
              {"kind": "in", "text": "INV-8812 submitted to portal", "value": "$9,720"},
              {"kind": "flag", "text": "Rejected: PO number missing"},
              {"kind": "out", "text": "Found the PO in the order email. Resubmitted."},
              {"kind": "stamp", "text": "Approved · pays on the 15th"},
            ],
          },
          name: 'AP + AR',
          title: 'From shipped to paid, with nothing stuck in a portal.',
          body: 'Track customer AP portal requirements, rejected invoices, missing documents and payment dates on the receivable side, and match and schedule supplier invoices on the payable side.',
          page: 'arHome',
          early: true,
        },
      ],
    },
  },

  es: {
    meta: {
      title: 'Anytrail | La Plataforma de IA para Distribuidores, de la Cotización al Cobro',
      description:
        'Anytrail es una sola plataforma sobre tu ERP para distribuidores y proveedores industriales: CRM, captura de cotizaciones y pedidos, datos de producto, precios, inventario y cuentas por pagar y por cobrar, con agentes de IA que hacen el trabajo rutinario.',
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
      titlePhrases: ['hacer crecer tu negocio', 'proteger tus márgenes', 'reducir costos de operación'],
      intro:
        'Reúne tus datos una sola vez y los agentes pueden trabajar sobre todos. Empieza con un módulo y agrega los demás cuando los necesites.',
      early: 'Acceso anticipado',
      replayDemo: "Repetir",
      explore: 'Conocer',
      items: [
        {
          id: 'crm',
          demo: {
            ariaLabel: "El agente ordena tres cuentas y marca a cuál llamar primero, con la razón.",
            lines: [
              {"kind": "in", "text": "Norte Hydraulics", "value": "9 sem"},
              {"kind": "in", "text": "Bajío Packaging", "value": "3 vistas"},
              {"kind": "in", "text": "Valle Process", "value": "ya hay stock"},
              {"kind": "out", "text": "Llama primero a Norte: tres semanas de retraso en una recompra de seis."},
              {"kind": "stamp", "text": "Resumen listo"},
            ],
          },
          name: 'CRM',
          title: 'Un CRM que le dice al vendedor a quién llamar y por qué.',
          body: 'Las cuentas se ordenan con el historial real de pedidos y las conversaciones abiertas. El vendedor recibe un resumen antes de la llamada y un seguimiento redactado después, en WhatsApp, correo y teléfono.',
          page: 'crmHome',
        },
        {
          id: 'quotes',
          demo: {
            ariaLabel: "Una solicitud de cotización por correo con 14 partidas se vuelve una cotización en borrador que espera aprobación.",
            lines: [
              {"kind": "in", "text": "Correo · RFQ_Alba.pdf", "value": "14 partidas"},
              {"kind": "out", "text": "Leí 14 partidas y empaté 13 con tu catálogo."},
              {"kind": "flag", "text": "Partida 9: sin equivalente", "value": "2 alternativas"},
              {"kind": "stamp", "text": "Q-2291 en borrador para aprobar"},
            ],
          },
          name: 'Cotizaciones y pedidos',
          title: 'Las solicitudes y órdenes de compra llegan como borrador, no como captura.',
          body: 'El agente lee el adjunto, empata cada partida con tu catálogo y deja la cotización o el pedido listo para que una persona lo apruebe.',
          page: 'rfqAutomation',
        },
        {
          id: 'pim',
          demo: {
            ariaLabel: "Un registro de producto desordenado se vuelve una ficha limpia publicada en el ERP y la tienda.",
            lines: [
              {"kind": "flag", "text": "manguera 2in neg 40m ??", "value": "sin categoría"},
              {"kind": "out", "text": "Nombre: Manguera hidráulica, 2 in, negra"},
              {"kind": "out", "text": "Equivalencias: 3 números de parte"},
              {"kind": "stamp", "text": "Publicado en ERP y tienda"},
            ],
          },
          name: 'Datos de producto',
          title: 'Una sola ficha limpia por producto.',
          body: 'Especificaciones, equivalencias, imágenes y categorías viven en un lugar y se publican a tu ERP y a tu tienda en línea.',
        },
        {
          id: 'ecommerce',
          demo: {
            ariaLabel: "Un artículo agotado en el carrito se sustituye por una alternativa en existencia y un complemento sugerido.",
            lines: [
              {"kind": "in", "text": "Carrito · Kit de sellos SK-40", "value": "cant. 6"},
              {"kind": "flag", "text": "Agotado", "value": "3 semanas"},
              {"kind": "out", "text": "El SK-42 sirve para la misma bomba. Hay existencia hoy."},
              {"kind": "stamp", "text": "Suele llevarse con: juego de O-rings"},
            ],
          },
          name: 'Comercio en línea',
          title: 'Una tienda que sabe qué hay en existencia.',
          body: 'Si un artículo está agotado, el comprador ve alternativas que puedes surtir hoy y los complementos que suelen ir con lo que lleva en el carrito.',
        },
        {
          id: 'orders',
          demo: {
            ariaLabel: "Un pedido de tres partidas se reparte entre las sucursales que pueden surtir cada una.",
            lines: [
              {"kind": "in", "text": "Pedido 5531", "value": "3 partidas"},
              {"kind": "out", "text": "Partida 1 → Monterrey", "value": "en existencia"},
              {"kind": "out", "text": "Partida 2 → Monterrey", "value": "en existencia"},
              {"kind": "out", "text": "Partida 3 → Querétaro", "value": "sale el jueves"},
              {"kind": "stamp", "text": "Registrado en el ERP"},
            ],
          },
          name: 'Gestión de pedidos',
          title: 'Cada partida va a la sucursal que puede surtirla.',
          body: 'Los pedidos se dividen y se asignan por existencia, ubicación y fecha promesa, y se registran de vuelta en el ERP.',
        },
        {
          id: 'sourcing',
          demo: {
            ariaLabel: "Un artículo fuera de catálogo recibe tres opciones de proveedor y se elige la mejor.",
            lines: [
              {"kind": "flag", "text": "Piden: bomba de engranes GP-7", "value": "no se maneja"},
              {"kind": "in", "text": "Proveedor A", "value": "$412 · 12 días"},
              {"kind": "in", "text": "Proveedor B", "value": "$398 · 5 días"},
              {"kind": "out", "text": "Proveedor B: mejor precio y una semana antes."},
              {"kind": "stamp", "text": "Opción enviada al vendedor"},
            ],
          },
          name: 'Abastecimiento',
          title: 'Una respuesta para lo que no manejas.',
          body: 'El agente busca una opción con tus proveedores y aliados, con precio y tiempo de entrega, antes de que el cliente le pregunte a alguien más.',
        },
        {
          id: 'pricing',
          demo: {
            ariaLabel: "Una partida cotizada por debajo del margen mínimo se marca y se recomienda un precio.",
            lines: [
              {"kind": "in", "text": "Q-2279 · partida 2", "value": "$41.20"},
              {"kind": "flag", "text": "Debajo del margen mínimo", "value": "−4%"},
              {"kind": "out", "text": "Recomendado para este cliente", "value": "$44.80"},
              {"kind": "stamp", "text": "Regla de precios cumplida"},
            ],
          },
          name: 'Precios',
          title: 'Un precio para este cliente y esta pieza.',
          body: 'Las recomendaciones salen de las condiciones del contrato, el costo y las ventas anteriores. Una cotización que rompe una regla de precios se marca antes de enviarse.',
        },
        {
          id: 'inventory',
          demo: {
            ariaLabel: "La existencia de un artículo baja semana a semana y se propone el resurtido antes de que se agote.",
            lines: [
              {"kind": "bars", "text": "Manguera 2 in · Monterrey", "levels": [100, 82, 61, 43, 24, 9]},
              {"kind": "out", "text": "Se agota en unos 9 días a este ritmo."},
              {"kind": "stamp", "text": "Resurtir 240 m antes del día 12"},
            ],
          },
          name: 'Inventario',
          title: 'Resurte antes de que el anaquel se vacíe.',
          body: 'La demanda se pronostica por artículo y sucursal, y el resurtido se propone con su razón a la vista.',
        },
        {
          id: 'ar',
          demo: {
            ariaLabel: "Una factura rechazada se corrige y se reenvía, y se conoce su fecha de pago.",
            lines: [
              {"kind": "in", "text": "INV-8812 enviada al portal", "value": "$9,720"},
              {"kind": "flag", "text": "Rechazada: falta el número de OC"},
              {"kind": "out", "text": "Encontré la OC en el correo del pedido. Reenviada."},
              {"kind": "stamp", "text": "Aprobada · se paga el día 15"},
            ],
          },
          name: 'CxP + CxC',
          title: 'De embarcado a cobrado, sin nada atorado en un portal.',
          body: 'Del lado de cobranza, da seguimiento a los requisitos de los portales de cuentas por pagar de tus clientes, las facturas rechazadas, los documentos faltantes y las fechas de pago. Del lado de pagos, empata y programa las facturas de proveedores.',
          page: 'arHome',
          early: true,
        },
      ],
    },
  },
}

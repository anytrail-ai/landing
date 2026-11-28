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
      { href: '#how', label: 'How it works' },
    ],
    // The home page's whole footer: this line and the privacy link.
    footerLine: '© 2026 anytrail.ai, AI software for wholesale distributors',
    footerPrivacy: 'Privacy Policy',
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
      // Each module's `scene` feeds its demo on the right: `steps` are the
      // three pill labels and `t` is every string and number the scene's
      // view shows (SceneViews.jsx draws it, sceneBeats.js times it). All of
      // it is invented sample data. The four product photos in
      // public/products are from Unsplash (Unsplash licence): hose by
      // @justusmenke, bearing by @glencarrie, fitting by @vl_cherkasenko,
      // hard hat by @richard_he, valve by @guilleb. Company, vendor and
      // place names are per language: US ones in English, Mexican in Spanish.
      items: [
        {
          id: 'crm',
          name: 'CRM',
          title: 'A CRM that tells reps who to call, and why.',
          body: 'Every inquiry is answered and qualified as it lands, on WhatsApp and email. Reps open the day to a ranked list, a brief for each account and a drafted quote or follow-up.',
          page: 'crmHome',
          scene: {
            ariaLabel: 'A WhatsApp inquiry arrives and the agent answers it. The agent then fills in what the customer needs and scores buying intent at 86. A quote for $7,960 is drafted, approved and sent, and the lead moves from new to quoted.',
            steps: ['Inquiry arrives', 'Agent qualifies', 'Quote drafted'],
            t: {
              initials: 'AT',
              customer: 'Andrew Tanner',
              channel: 'WhatsApp · Phone Lab Miami',
              stageNew: 'New',
              stageToQuote: 'To quote',
              stageQuoted: 'Quoted',
              msg1: 'Hi, can you do 40 units of the A25?',
              reply: 'Yes, the Nova A25 256 GB is in stock. Is it for one store, and when do you need them?',
              agent: 'Agent',
              msg2: 'One store in Miami. By Friday.',
              leadTitle: 'What the agent found out',
              leadSub: 'From this conversation',
              fields: [
                { name: 'Product', value: 'Nova A25 256 GB' },
                { name: 'Quantity', value: '40 units' },
                { name: 'Needed by', value: 'Friday' },
              ],
              intent: 'Buying intent',
              quoteId: 'Quote C-1042',
              quoteLine: '40 × Nova A25 256 GB',
              quoteTotal: '$7,960',
              approve: 'Approve & send',
              sent: 'Sent to Andrew',
            },
          },
        },
        {
          id: 'sourcing',
          name: 'Sourcing',
          title: 'An answer for the item you do not carry.',
          body: 'When a customer asks for something outside your catalog, the agent checks your vendors and partners for a match, with price and lead time, before the customer asks someone else.',
          scene: {
            ariaLabel: 'A customer emails asking for a valve that is not in the catalog. The agent asks three vendors, who answer one by one, and picks the best. A priced reply is drafted, approved and sent.',
            steps: ['Not in your catalog', 'Vendors checked', 'Answer sent'],
            t: {
              from: 'Harlow Industrial',
              fromSub: 'Email · 9:41',
              ask: '“Do you carry 2 in balancing valves? We need six this month.”',
              img: '/products/valve.jpg',
              item: 'Balancing valve, 2 in',
              itemSub: 'Quantity 6',
              statusMissing: 'Not in catalog',
              statusAsking: 'Asking vendors',
              statusFound: '3 options',
              statusSourced: 'Sourced',
              vendorsTitle: 'Vendor check',
              vendorsBusy: 'Waiting for answers',
              vendorsDone: '3 of 3 answered',
              best: 'Best',
              vendors: [
                { name: 'Gulf Valve Co.', lead: '12 days', cost: '$172' },
                { name: 'HydroParts Supply', lead: '5 days', cost: '$165', best: true },
                { name: 'Flow Supply Co.', lead: '3 days', cost: '$189' },
              ],
              note: 'HydroParts Supply is cheapest and arrives inside the month.',
              replyTitle: 'Reply drafted',
              replySub: '6 valves · 5 days · 23% margin',
              replyTotal: '$1,290',
              approve: 'Approve & send',
              sent: 'Sent to Harlow Industrial',
            },
          },
        },
        {
          id: 'inventory',
          name: 'Inventory',
          title: 'Reorder before the shelf is empty.',
          body: 'Demand is forecast per item and branch from your order history, and replenishment is proposed with the reasoning shown.',
          scene: {
            ariaLabel: 'The agent checks four stocked items one by one and finds the hydraulic hose has nine days left. It shows the hose running down week by week, then drafts a purchase order for the hose and the bearings, totalling $5,556, which is approved and sent.',
            steps: ['What is running low', 'Why it runs out', 'Reorder sent'],
            t: {
              listTitle: 'Dallas branch',
              listBusy: 'Checking 1,240 items',
              listDone: '2 need action',
              checking: 'Checking',
              items: [
                {
                  img: '/products/hose.jpg',
                  name: 'Hydraulic hose, 2 in',
                  sub: '280 ft on hand',
                  tag: '9 days left',
                  tone: 'bad',
                },
                {
                  img: '/products/bearing.jpg',
                  name: 'Ball bearing 6204',
                  sub: '42 on hand',
                  tag: '3 weeks left',
                  tone: 'warn',
                },
                {
                  img: '/products/fitting.jpg',
                  name: 'Brass fitting, 1/2 in',
                  sub: '380 on hand',
                  tag: 'Covered',
                  tone: 'good',
                },
                {
                  img: '/products/hardhat.jpg',
                  name: 'Hard hat, yellow',
                  sub: '64 on hand',
                  tag: 'Covered',
                  tone: 'good',
                },
              ],
              forecastSub: 'Stock by week',
              levels: [100, 82, 61, 43, 24, 9],
              note: 'Empty in about nine days. The vendor needs nine to deliver.',
              orderTitle: 'Purchase order',
              orderSub: 'Arrives the 12th',
              order: [
                {
                  img: '/products/hose.jpg',
                  name: 'Hydraulic hose, 2 in',
                  sub: '800 ft · Lone Star Hose',
                  amount: 4416,
                },
                {
                  img: '/products/bearing.jpg',
                  name: 'Ball bearing 6204',
                  sub: '60 units · Midwest Bearing',
                  amount: 1140,
                },
              ],
              total: 'Total',
              approve: 'Approve order',
              sent: 'Order sent',
            },
          },
        },
        {
          id: 'ar',
          name: 'Accounts receivable',
          title: 'From shipped to paid, with nothing stuck in a portal.',
          body: 'Track customer AP portal requirements, rejected invoices, missing documents and payment dates, so every blocked invoice has an owner and a next step.',
          page: 'arHome',
          scene: {
            ariaLabel: 'Three open invoices, one rejected by the customer portal. The agent finds the missing purchase order number in the original order email and resubmits. The invoice is approved with a payment date, and the amount at risk drops from $16,020 to $6,300.',
            steps: ['Invoices at risk', 'Blocker found', 'Payment date known'],
            t: {
              listTitle: 'Open invoices',
              listSub: 'At risk',
              riskBefore: 16020,
              riskAfter: 6300,
              invoices: [
                {
                  id: 'INV-8812',
                  customer: 'Summit Hydraulics',
                  tag: 'Rejected',
                  tone: 'bad',
                  amount: '$9,720',
                },
                {
                  id: 'INV-8774',
                  customer: 'Harlow Industrial',
                  tag: '12 days late',
                  tone: 'warn',
                  amount: '$6,300',
                },
                {
                  id: 'INV-8790',
                  customer: 'Cedar Process',
                  tag: 'Approved',
                  tone: 'good',
                  amount: '$4,100',
                },
              ],
              approved: 'Approved',
              paysOn: 'Pays on the 15th',
              chasing: 'Chasing',
              reminded: 'Reminder sent today',
              portalTitle: 'INV-8812',
              portalSub: 'Customer portal',
              reason: 'Rejected',
              reasonSub: 'PO number missing',
              search: 'Searched the order email',
              found: 'PO 44817, sent March 3',
              resubmitted: 'Resubmitted',
              resubmittedSub: 'With the PO attached',
              cleared: 'Blocker cleared',
            },
          },
        },
      ],
    },
    // "How it works": three layers, top to bottom. Each tier's `rows` are
    // what that layer looks like in the product (sample data); `tone` is the
    // chip colour (good | warn | plain).
    layers: {
      label: 'How it works',
      title: 'Agents on top. Your systems underneath. One record in between.',
      intro:
        'Anytrail pulls customers, products, prices, orders and invoices out of your ERP and the tools around it into one record. The agents work from that record, so what they answer, suggest and do is based on your business, in the modules you turn on.',
      tiers: [
        {
          id: 'agents',
          name: 'Agents',
          title: 'Agents at work',
          sub: 'Each one has a single job and its own permissions',
          rows: [
            { name: 'Inbound agent', sub: 'Answering 3 conversations', tag: 'Runs on its own', tone: 'good' },
            { name: 'Quoting agent', sub: '2 quotes drafted', tag: 'Asks first', tone: 'warn' },
            { name: 'Reorder agent', sub: 'Checks stock every morning', tag: 'Asks first', tone: 'warn' },
            { name: 'Collections agent', sub: '1 reminder sent today', tag: 'Runs on its own', tone: 'good' },
          ],
          caption: 'You decide, agent by agent, what goes out on its own and what waits for a person.',
        },
        {
          id: 'record',
          name: 'One record',
          title: 'Harlow Industrial',
          sub: 'One customer, seen by every module',
          rows: [
            { name: 'CRM', sub: 'Asked for six valves on Tuesday', value: 'Open' },
            { name: 'Sourcing', sub: 'Three vendor options, best at 5 days', value: '$1,290' },
            { name: 'Inventory', sub: 'Buys hose every six weeks', value: '280 ft' },
            { name: 'Accounts receivable', sub: 'INV-8774, 12 days late', value: '$6,300' },
          ],
          caption: 'What sales learns is already there when the order ships and the invoice goes out.',
        },
        {
          id: 'systems',
          name: 'Your systems',
          title: 'Connected systems',
          sub: 'The ERP stays the system of record',
          rows: [
            { name: 'ERP', sub: '4,210 customers · 12,400 products', tag: 'Synced', tone: 'good' },
            { name: 'WhatsApp and email', sub: 'Every conversation, attached to its customer', tag: 'Synced', tone: 'good' },
            { name: 'Storefront', sub: 'Orders and stock', tag: 'Synced', tone: 'good' },
            { name: 'Customer portals', sub: 'Invoice status and payment dates', tag: 'Synced', tone: 'good' },
          ],
          caption: 'Nothing is migrated. Anytrail reads from what you run and writes back to it.',
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
      { href: '#how', label: 'Cómo funciona' },
    ],
    footerLine: '© 2026 anytrail.ai, software de IA para distribuidores mayoristas',
    footerPrivacy: 'Política de privacidad',
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
            ariaLabel: 'Llega una consulta por WhatsApp y el agente la responde. Después llena lo que el cliente necesita y califica la intención de compra en 86. Se redacta, aprueba y envía una cotización por $159,200, y el prospecto pasa de nuevo a cotizado.',
            steps: ['Llega la consulta', 'El agente califica', 'Cotización lista'],
            t: {
              initials: 'AT',
              customer: 'Andrés Tamez',
              channel: 'WhatsApp · Phone Lab Monterrey',
              stageNew: 'Nuevo',
              stageToQuote: 'Por cotizar',
              stageQuoted: 'Cotizado',
              msg1: 'Hola, ¿me surten 40 piezas del A25?',
              reply: 'Sí, tenemos el Nova A25 256 GB en existencia. ¿Es para una tienda y para cuándo los necesitas?',
              agent: 'Agente',
              msg2: 'Una tienda en Monterrey. Para el viernes.',
              leadTitle: 'Lo que averiguó el agente',
              leadSub: 'De esta conversación',
              fields: [
                { name: 'Producto', value: 'Nova A25 256 GB' },
                { name: 'Cantidad', value: '40 piezas' },
                { name: 'Lo necesita', value: 'El viernes' },
              ],
              intent: 'Intención de compra',
              quoteId: 'Cotización C-1042',
              quoteLine: '40 × Nova A25 256 GB',
              quoteTotal: '$159,200',
              approve: 'Aprobar y enviar',
              sent: 'Enviada a Andrés',
            },
          },
        },
        {
          id: 'sourcing',
          name: 'Abastecimiento',
          title: 'Una respuesta para lo que no manejas.',
          body: 'Cuando un cliente pide algo fuera de tu catálogo, el agente busca una opción con tus proveedores y aliados, con precio y tiempo de entrega, antes de que el cliente le pregunte a alguien más.',
          scene: {
            ariaLabel: 'Un cliente pregunta por correo por una válvula que no está en el catálogo. El agente consulta a tres proveedores, que responden uno por uno, y elige al mejor. Se redacta, aprueba y envía una respuesta con precio.',
            steps: ['Fuera de catálogo', 'Proveedores consultados', 'Respuesta enviada'],
            t: {
              from: 'Grupo Alba',
              fromSub: 'Correo · 9:41',
              ask: '“¿Manejan válvulas de balanceo de 2 in? Necesitamos seis este mes.”',
              img: '/products/valve.jpg',
              item: 'Válvula de balanceo, 2 in',
              itemSub: 'Cantidad 6',
              statusMissing: 'Fuera de catálogo',
              statusAsking: 'Consultando',
              statusFound: '3 opciones',
              statusSourced: 'Resuelto',
              vendorsTitle: 'Consulta a proveedores',
              vendorsBusy: 'Esperando respuestas',
              vendorsDone: 'Respondieron 3 de 3',
              best: 'La mejor',
              vendors: [
                { name: 'Válvulas Noreste', lead: '12 días', cost: '$3,440' },
                { name: 'Hidro Partes', lead: '5 días', cost: '$3,300', best: true },
                { name: 'Suministros Flujo', lead: '3 días', cost: '$3,780' },
              ],
              note: 'Hidro Partes es la más barata y llega dentro del mes.',
              replyTitle: 'Respuesta redactada',
              replySub: '6 válvulas · 5 días · 23% de margen',
              replyTotal: '$25,800',
              approve: 'Aprobar y enviar',
              sent: 'Enviada a Grupo Alba',
            },
          },
        },
        {
          id: 'inventory',
          name: 'Inventario',
          title: 'Resurte antes de que el anaquel se vacíe.',
          body: 'La demanda se pronostica por artículo y sucursal con tu historial de pedidos, y el resurtido se propone con su razón a la vista.',
          scene: {
            ariaLabel: 'El agente revisa cuatro artículos uno por uno y encuentra que a la manguera hidráulica le quedan nueve días. Muestra cómo baja la existencia por semana y redacta una orden de compra por la manguera y los rodamientos, por $111,120, que se aprueba y se envía.',
            steps: ['Qué se está acabando', 'Por qué se agota', 'Pedido enviado'],
            t: {
              listTitle: 'Sucursal Monterrey',
              listBusy: 'Revisando 1,240 artículos',
              listDone: '2 requieren acción',
              checking: 'Revisando',
              items: [
                {
                  img: '/products/hose.jpg',
                  name: 'Manguera hidráulica 2 in',
                  sub: '86 m en existencia',
                  tag: '9 días',
                  tone: 'bad',
                },
                {
                  img: '/products/bearing.jpg',
                  name: 'Rodamiento 6204',
                  sub: '42 en existencia',
                  tag: '3 semanas',
                  tone: 'warn',
                },
                {
                  img: '/products/fitting.jpg',
                  name: 'Conector de latón 1/2',
                  sub: '380 en existencia',
                  tag: 'Cubierto',
                  tone: 'good',
                },
                {
                  img: '/products/hardhat.jpg',
                  name: 'Casco de seguridad',
                  sub: '64 en existencia',
                  tag: 'Cubierto',
                  tone: 'good',
                },
              ],
              forecastSub: 'Existencia por semana',
              levels: [100, 82, 61, 43, 24, 9],
              note: 'Se agota en unos nueve días. El proveedor tarda nueve en entregar.',
              orderTitle: 'Orden de compra',
              orderSub: 'Llega el día 12',
              order: [
                {
                  img: '/products/hose.jpg',
                  name: 'Manguera hidráulica 2 in',
                  sub: '240 m · Mangueras Norte',
                  amount: 88320,
                },
                {
                  img: '/products/bearing.jpg',
                  name: 'Rodamiento 6204',
                  sub: '60 pzas · Rodamientos MX',
                  amount: 22800,
                },
              ],
              total: 'Total',
              approve: 'Aprobar pedido',
              sent: 'Pedido enviado',
            },
          },
        },
        {
          id: 'ar',
          name: 'Cuentas por cobrar',
          title: 'De embarcado a cobrado, sin nada atorado en un portal.',
          body: 'Da seguimiento a los requisitos de los portales de tus clientes, las facturas rechazadas, los documentos faltantes y las fechas de pago, para que cada factura bloqueada tenga responsable y siguiente paso.',
          page: 'arHome',
          scene: {
            ariaLabel: 'Tres facturas abiertas, una rechazada por el portal del cliente. El agente encuentra el número de orden de compra faltante en el correo del pedido original y la reenvía. La factura queda aprobada con fecha de pago y el monto en riesgo baja de $320,400 a $126,000.',
            steps: ['Facturas en riesgo', 'Bloqueo encontrado', 'Fecha de pago'],
            t: {
              listTitle: 'Facturas abiertas',
              listSub: 'En riesgo',
              riskBefore: 320400,
              riskAfter: 126000,
              invoices: [
                {
                  id: 'INV-8812',
                  customer: 'Hidráulica del Norte',
                  tag: 'Rechazada',
                  tone: 'bad',
                  amount: '$194,400',
                },
                {
                  id: 'INV-8774',
                  customer: 'Grupo Alba',
                  tag: '12 días vencida',
                  tone: 'warn',
                  amount: '$126,000',
                },
                {
                  id: 'INV-8790',
                  customer: 'Procesos del Valle',
                  tag: 'Aprobada',
                  tone: 'good',
                  amount: '$82,000',
                },
              ],
              approved: 'Aprobada',
              paysOn: 'Se paga el día 15',
              chasing: 'En gestión',
              reminded: 'Recordatorio enviado hoy',
              portalTitle: 'INV-8812',
              portalSub: 'Portal del cliente',
              reason: 'Rechazada',
              reasonSub: 'Falta el número de OC',
              search: 'Busqué en el correo del pedido',
              found: 'OC 44817, enviada el 3 de marzo',
              resubmitted: 'Reenviada',
              resubmittedSub: 'Con la OC adjunta',
              cleared: 'Bloqueo resuelto',
            },
          },
        },
      ],
    },
    layers: {
      label: 'Cómo funciona',
      title: 'Agentes arriba. Tus sistemas abajo. Un solo registro en medio.',
      intro:
        'Anytrail toma clientes, productos, precios, pedidos y facturas de tu ERP y de las herramientas que lo rodean y los reúne en un solo registro. Los agentes trabajan sobre ese registro, así que lo que responden, sugieren y hacen parte de tu negocio, en los módulos que enciendas.',
      tiers: [
        {
          id: 'agents',
          name: 'Agentes',
          title: 'Agentes trabajando',
          sub: 'Cada uno con un solo trabajo y sus propios permisos',
          rows: [
            { name: 'Agente de entrada', sub: 'Atiende 3 conversaciones', tag: 'Trabaja solo', tone: 'good' },
            { name: 'Agente de cotización', sub: '2 cotizaciones en borrador', tag: 'Pregunta antes', tone: 'warn' },
            { name: 'Agente de resurtido', sub: 'Revisa existencias cada mañana', tag: 'Pregunta antes', tone: 'warn' },
            { name: 'Agente de cobranza', sub: '1 recordatorio enviado hoy', tag: 'Trabaja solo', tone: 'good' },
          ],
          caption: 'Tú decides, agente por agente, qué sale solo y qué espera a una persona.',
        },
        {
          id: 'record',
          name: 'Un registro',
          title: 'Grupo Alba',
          sub: 'Un cliente, visto por todos los módulos',
          rows: [
            { name: 'CRM', sub: 'Pidió seis válvulas el martes', value: 'Abierto' },
            { name: 'Abastecimiento', sub: 'Tres opciones, la mejor en 5 días', value: '$25,800' },
            { name: 'Inventario', sub: 'Compra manguera cada seis semanas', value: '86 m' },
            { name: 'Cuentas por cobrar', sub: 'INV-8774, 12 días vencida', value: '$126,000' },
          ],
          caption: 'Lo que aprende ventas ya está ahí cuando sale el pedido y cuando sale la factura.',
        },
        {
          id: 'systems',
          name: 'Tus sistemas',
          title: 'Sistemas conectados',
          sub: 'El ERP sigue siendo el sistema de registro',
          rows: [
            { name: 'ERP', sub: '4,210 clientes · 12,400 productos', tag: 'Sincronizado', tone: 'good' },
            { name: 'WhatsApp y correo', sub: 'Cada conversación, ligada a su cliente', tag: 'Sincronizado', tone: 'good' },
            { name: 'Tienda en línea', sub: 'Pedidos y existencias', tag: 'Sincronizado', tone: 'good' },
            { name: 'Portales de clientes', sub: 'Estatus de facturas y fechas de pago', tag: 'Sincronizado', tone: 'good' },
          ],
          caption: 'No se migra nada. Anytrail lee de lo que ya usas y escribe de vuelta.',
        },
      ],
    },
  },
}

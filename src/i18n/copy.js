// All landing-page copy in both languages. One object per section.
// `meta` feeds both the runtime <head> and the static prerender in prerender.js.
export const COPY = {
  en: {
    meta: {
      title:
        'Anytrail | AI Sales Agents for Industrial Equipment Companies',
      description:
        'Anytrail works demand in both directions for manufacturers and industrial distributors. It surfaces the accounts that are about to buy, reaches out on WhatsApp, email, and LinkedIn, and answers every inbound inquiry with AI sales agents trained on your product catalog: diagnosing the application, preparing quotes, and following up.',
      ogLocale: 'en_US',
    },
    navbar: {
      cta: 'Book a review',
    },
    hero: {
      title: 'AI sales agents trained on what your industrial company actually sells.',
      subtitle:
        'Anytrail works demand in both directions, finding the accounts that are about to buy and answering every inquiry the moment it lands. Same agent, same catalog knowledge: it diagnoses the application, collects what’s needed to quote, and follows up until your sales team steps in.',
      cta: 'Review my commercial process',
      ctaNote:
        'For manufacturers, distributors, and industrial equipment companies. Outbound on WhatsApp, email, and LinkedIn. Inbound from WhatsApp, ads, and your website. Both handled the way your best salesperson would.',
    },
    conversation: {
      ariaLabel:
        'Example: Anytrail diagnoses an inbound WhatsApp inquiry about a pressure washer and prepares the lead for quotation.',
      headerTitle: 'WhatsApp · New inquiry',
      statusTitle: 'Lead status',
      messages: [
        { from: 'customer', text: 'Hi, I need a pressure washer for cleaning production equipment.', time: '09:12' },
        { from: 'anytrail', text: 'Happy to help. What type of residue are you removing, and how often will it run per week?', time: '09:12' },
        { from: 'customer', text: 'Grease and metal shavings, more or less daily use.', time: '09:15' },
        { from: 'anytrail', text: 'Got it, daily industrial use. Do you have three-phase power at the site? That decides which models we can quote.', time: '09:15' },
      ],
      status: [
        'Application identified',
        'Requirements collected',
        'Product matched',
        'Ready for quotation',
      ],
    },
    problem: {
      label: 'THE PROBLEM',
      title: 'You pay to generate demand. Then sales are lost deciding who to chase and how fast you answer.',
      intro:
        "Most industrial equipment sales don't fail at the ad or the website. They fail in the gap between the signal and the quote.",
      groups: [
        {
          label: 'Demand you never found',
          leaks: [
            { title: 'No view of who is in market', body: 'Every account looks the same in the CRM, so the team works whoever shouted loudest instead of who is actually ready to buy.' },
            { title: 'Your own customer base goes cold', body: 'Plants that bought two years ago, lines that expanded, equipment due for replacement. Nobody ever went back to ask.' },
          ],
        },
        {
          label: 'Demand you answered too late',
          leaks: [
            { title: 'Slow first response', body: 'An interested buyer writes in, waits, and buys from whoever answers first.' },
            { title: 'Incomplete information', body: 'Quotes stall because nobody collected the application details, power supply, or usage before pricing.' },
            { title: 'Forgotten follow-up', body: 'A lead goes quiet, the salesperson moves on, and the opportunity dies without a decision.' },
          ],
        },
      ],
    },
    how: {
      label: 'HOW IT WORKS',
      title: 'Two ways an opportunity starts. One way it gets worked.',
      intro:
        'Anytrail runs your commercial process, step by step, whether the opportunity came to you or you went and found it. Your team keeps control of pricing, technical recommendations, quotes, and the final sale.',
      entriesLabel: 'How the opportunity starts',
      entries: [
        { title: 'Anytrail finds it', body: 'It surfaces accounts that match what you sell, both net-new companies in your market and customers already in your base worth going back to, then opens the conversation on WhatsApp, email, or LinkedIn.' },
        { title: 'The opportunity finds you', body: 'An inquiry lands from WhatsApp, an ad, or your website. Anytrail answers immediately, at any hour, instead of leaving it until Monday.' },
      ],
      sharedLabel: 'Then the same path, every time',
      steps: [
        { title: 'Diagnosis', body: 'It asks the qualification questions your sales team uses: application, usage, site conditions.' },
        { title: 'Recommendation', body: 'It helps identify the right equipment from your catalog for that application.' },
        { title: 'Quote preparation', body: 'It collects the technical and commercial details your team needs to prepare the quotation.' },
        { title: 'Follow-up', body: 'It keeps the conversation alive over days or weeks, so no opportunity is forgotten.' },
        { title: 'Sales team handoff', body: 'Qualified opportunities go to your salespeople with the full context, ready to close.' },
      ],
    },
    different: {
      label: "WHY IT'S DIFFERENT",
      title: 'Not a chatbot. Not a database. Not a sequence tool. Part of your sales operation.',
      intro:
        "Anytrail learns what you sell, asks your team's qualification questions, and works each opportunity through a real sales process, in both directions. It knows when to keep the conversation going and when your salespeople should take over.",
      comparisons: [
        { label: 'A chatbot', body: 'Answers isolated questions. It doesn’t diagnose the application, collect quote details, or follow up next week.' },
        { label: 'A CRM or contact database', body: 'Sells you records and generic intent scores, then organizes leads after someone types the information in. It doesn’t know your products and it doesn’t move the deal forward.' },
        { label: 'An outbound or sequence tool', body: 'Sends the message and stops there. Anyone can send the message. Almost nobody can answer the reply when a plant manager asks which model handles their duty cycle.' },
        { label: 'A lead agency', body: 'Sends you more inquiries. It doesn’t handle what happens after they arrive, which is where sales are lost.' },
      ],
    },
    proof: {
      label: 'PROOF',
      title: 'Built inside a real industrial equipment sales team.',
      p1: 'Anytrail was built and runs inside the sales process of an industrial equipment company, from the first contact through diagnosis, product recommendation, quotation, and follow-up. Last month alone, inbound conversations handled by the agent contributed to more than $20,000 USD in equipment sold.',
      p2:
        'It was developed around the way industrial equipment is actually diagnosed, quoted, followed up, and sold, not around a generic chatbot script.',
    },
    closing: {
      title: 'Review your commercial process',
      body:
        "We'll look at how your company currently finds and responds to new opportunities, and identify where potential sales may be getting lost.",
      cta: 'Review my commercial process',
    },
    whatsapp: {
      cta: 'Or ask our agent on WhatsApp',
      prefill: "Hi, I'd like to see how Anytrail could work our opportunities, inbound and outbound.",
    },
    thanks: {
      meta: {
        title: 'Booking confirmed | Anytrail',
        description: 'Your commercial process review is booked.',
        ogLocale: 'en_US',
      },
      title: 'Your review is booked.',
      body: "Check your email for the calendar invite. Before we meet, we'll send an inquiry through your own inbound channels and time how long a reply takes, so we can show you exactly where opportunities are being lost today.",
      manageSave: 'Save this link in case the confirmation email does not arrive — it is the only way to cancel or move your call:',
      back: 'Back to home',
      demoLead: 'While you wait, run the agent on your own catalog.',
      demoCta: 'Try the live demo',
    },
    demo: {
      meta: {
        title: 'Live Demo | Anytrail',
        description:
          'See an AI sales agent built on your own website in one minute. It learns your products and sells them back to you — plus your ideal customer profile and 5 matching leads.',
        ogLocale: 'en_US',
      },
    },
    schedule: {
      meta: {
        title: 'Book a commercial process review | Anytrail',
        description:
          'Book a 30 minute video call. We look at how your company finds and answers new opportunities today, and show you where sales are being lost.',
        ogLocale: 'en_US',
      },
      title: 'Review my commercial process',
      intro:
        'Thirty minutes, by video. We look at how opportunities reach you today, how fast they get answered, and what happens to the ones nobody follows up on.',
      bullets: [
        'Before the call we send an inquiry through your own channels and time the reply.',
        'You get the timings and the gaps, whether or not you buy anything.',
        'No slides. Bring the questions your sales team argues about.',
      ],
      pickDay: 'Pick a day',
      pickTime: 'Pick a time',
      yourZone: 'Times shown in your timezone',
      noSlots: 'No open times that day. Try another one.',
      form: { name: 'Your name', email: 'Work email', website: 'Company website', note: 'Anything we should know? (optional)' },
      submit: 'Book the call',
      booking: 'Booking...',
      manageTitle: 'Your booking',
      cancel: 'Cancel this call',
      move: 'Move to another time',
      cancelled: 'Your call is cancelled. You can book another any time.',
      errors: {
        invalid_website: "We couldn't use that website address. Check the URL and try again.",
        invalid_input: "That didn't look right. Check the form and try again.",
        slot_taken: 'Someone just took that time. Pick another one.',
        already_booked: 'You already have a call booked. Use the link in your confirmation email to change it.',
        rate_limited: 'Too many attempts. Try again later.',
        invalid_link: 'That link is not valid. Check the one in your confirmation email.',
        unknown_booking: 'We could not find that booking. It may already be cancelled.',
        generic: 'Something went wrong. Try again.',
      },
    },
    footer: {
      tagline: 'AI sales agents for industrial equipment companies. © 2026 Anytrail',
    },
  },

  es: {
    meta: {
      title:
        'Anytrail | Agentes de Ventas con IA para Empresas de Equipo Industrial',
      description:
        'Anytrail trabaja la demanda en ambas direcciones para fabricantes y distribuidores industriales. Detecta las cuentas que están por comprar, las contacta por WhatsApp, correo y LinkedIn, y responde cada consulta entrante con agentes de IA entrenados en tu catálogo: diagnostica la aplicación, prepara cotizaciones y da seguimiento.',
      ogLocale: 'es_ES',
    },
    navbar: {
      cta: 'Agenda una revisión',
    },
    hero: {
      title: 'Agentes de ventas con IA entrenados en lo que tu empresa industrial realmente vende.',
      subtitle:
        'Anytrail trabaja la demanda en ambas direcciones, encuentra las cuentas que están por comprar y responde cada consulta en el momento en que llega. El mismo agente, el mismo conocimiento de tu catálogo: diagnostica la aplicación, reúne los datos para cotizar y da seguimiento hasta que tu equipo de ventas entra.',
      cta: 'Revisa mi proceso comercial',
      ctaNote:
        'Para fabricantes, distribuidores y empresas de equipo industrial. Prospección por WhatsApp, correo y LinkedIn. Consultas entrantes de WhatsApp, anuncios y tu sitio web. Ambas atendidas como lo haría tu mejor vendedor.',
    },
    conversation: {
      ariaLabel:
        'Ejemplo: Anytrail diagnostica una consulta entrante por WhatsApp sobre una hidrolavadora y prepara el lead para cotización.',
      headerTitle: 'WhatsApp · Nueva consulta',
      statusTitle: 'Estado del lead',
      messages: [
        { from: 'customer', text: 'Hola, necesito una hidrolavadora para limpiar equipo de producción.', time: '09:12' },
        { from: 'anytrail', text: 'Con gusto. ¿Qué tipo de residuo van a remover y cuántas veces por semana la usarían?', time: '09:12' },
        { from: 'customer', text: 'Grasa y rebaba metálica, uso más o menos diario.', time: '09:15' },
        { from: 'anytrail', text: 'Entendido, uso industrial diario. ¿Cuentan con corriente trifásica en la planta? Eso define qué modelos podemos cotizar.', time: '09:15' },
      ],
      status: [
        'Aplicación identificada',
        'Requisitos reunidos',
        'Producto identificado',
        'Listo para cotizar',
      ],
    },
    problem: {
      label: 'EL PROBLEMA',
      title: 'Pagas por generar demanda. Y las ventas se pierden decidiendo a quién perseguir y qué tan rápido respondes.',
      intro:
        'La mayoría de las ventas de equipo industrial no se pierden en el anuncio ni en el sitio web. Se pierden en el hueco entre la señal y la cotización.',
      groups: [
        {
          label: 'Demanda que nunca encontraste',
          leaks: [
            { title: 'Sin visibilidad de quién está en mercado', body: 'Todas las cuentas se ven iguales en el CRM, así que el equipo atiende al que más insiste en lugar del que realmente está listo para comprar.' },
            { title: 'Tu propia cartera se enfría', body: 'Plantas que compraron hace dos años, líneas que crecieron, equipo que ya toca reemplazar. Nadie volvió a preguntar.' },
          ],
        },
        {
          label: 'Demanda que respondiste demasiado tarde',
          leaks: [
            { title: 'Respuesta lenta', body: 'Un comprador interesado escribe, espera, y le compra al primero que contesta.' },
            { title: 'Información incompleta', body: 'Las cotizaciones se atoran porque nadie reunió la aplicación, la alimentación eléctrica o el uso antes de dar precio.' },
            { title: 'Seguimiento olvidado', body: 'Un lead deja de contestar, el vendedor sigue con otra cosa, y la oportunidad muere sin decisión.' },
          ],
        },
      ],
    },
    how: {
      label: 'CÓMO FUNCIONA',
      title: 'Dos formas de que empiece una oportunidad. Una sola forma de trabajarla.',
      intro:
        'Anytrail lleva tu proceso comercial, paso a paso, ya sea que la oportunidad haya llegado sola o que la hayas salido a buscar. Tu equipo mantiene el control de precios, recomendaciones técnicas, cotizaciones y la venta final.',
      entriesLabel: 'Cómo empieza la oportunidad',
      entries: [
        { title: 'Anytrail la encuentra', body: 'Detecta cuentas que embonan con lo que vendes, tanto empresas nuevas en tu mercado como clientes que ya están en tu cartera y vale la pena retomar, y abre la conversación por WhatsApp, correo o LinkedIn.' },
        { title: 'La oportunidad te encuentra', body: 'Llega una consulta por WhatsApp, un anuncio o tu sitio web. Anytrail responde de inmediato, a cualquier hora, en lugar de dejarla para el lunes.' },
      ],
      sharedLabel: 'Después, el mismo camino, siempre',
      steps: [
        { title: 'Diagnóstico', body: 'Hace las preguntas de calificación que usa tu equipo: aplicación, uso, condiciones del sitio.' },
        { title: 'Recomendación', body: 'Ayuda a identificar el equipo adecuado de tu catálogo para esa aplicación.' },
        { title: 'Preparación de cotización', body: 'Reúne los datos técnicos y comerciales que tu equipo necesita para cotizar.' },
        { title: 'Seguimiento', body: 'Mantiene viva la conversación durante días o semanas, para que ninguna oportunidad se olvide.' },
        { title: 'Entrega al equipo de ventas', body: 'Las oportunidades calificadas llegan a tus vendedores con todo el contexto, listas para cerrar.' },
      ],
    },
    different: {
      label: 'POR QUÉ ES DIFERENTE',
      title: 'No es un chatbot. No es una base de datos. No es una herramienta de secuencias. Es parte de tu operación de ventas.',
      intro:
        'Anytrail aprende lo que vendes, hace las preguntas de calificación de tu equipo y trabaja cada oportunidad dentro de un proceso de ventas real, en ambas direcciones. Sabe cuándo seguir la conversación y cuándo deben entrar tus vendedores.',
      comparisons: [
        { label: 'Un chatbot', body: 'Contesta preguntas sueltas. No diagnostica la aplicación, no reúne datos para cotizar y no da seguimiento la próxima semana.' },
        { label: 'Un CRM o base de contactos', body: 'Te vende registros y scores genéricos de intención, y organiza leads después de que alguien captura la información. No conoce tus productos ni avanza el trato.' },
        { label: 'Una herramienta de prospección o secuencias', body: 'Manda el mensaje y ahí se queda. Cualquiera puede mandar el mensaje. Casi nadie puede contestar la respuesta cuando un jefe de planta pregunta qué modelo aguanta su ciclo de trabajo.' },
        { label: 'Una agencia de leads', body: 'Te manda más consultas. No se encarga de lo que pasa después de que llegan, que es donde se pierden las ventas.' },
      ],
    },
    proof: {
      label: 'PRUEBA',
      title: 'Construido dentro de un equipo de ventas de equipo industrial real.',
      p1: 'Anytrail se construyó y opera dentro del proceso comercial de una empresa de equipo industrial, desde el primer contacto hasta el diagnóstico, la recomendación de producto, la cotización y el seguimiento. Solo el mes pasado, las conversaciones entrantes atendidas por el agente contribuyeron a más de $400,000 MXN en equipo vendido.',
      p2:
        'Se desarrolló alrededor de cómo realmente se diagnostica, cotiza, da seguimiento y vende el equipo industrial, no alrededor de un guion genérico de chatbot.',
    },
    closing: {
      title: 'Revisa tu proceso comercial',
      body:
        'Revisamos cómo tu empresa encuentra y responde hoy a las nuevas oportunidades, e identificamos dónde se pueden estar perdiendo ventas.',
      cta: 'Revisa mi proceso comercial',
    },
    whatsapp: {
      cta: 'O pregúntale a nuestro agente por WhatsApp',
      prefill: 'Hola, quiero ver cómo Anytrail podría trabajar nuestras oportunidades, entrantes y de prospección.',
    },
    thanks: {
      meta: {
        title: 'Reunión confirmada | Anytrail',
        description: 'Tu revisión del proceso comercial está agendada.',
        ogLocale: 'es_ES',
      },
      title: 'Tu revisión está agendada.',
      body: 'Revisa tu correo para la invitación. Antes de la reunión, enviaremos una consulta por tus propios canales de ventas entrantes y mediremos cuánto tarda la respuesta, para mostrarte exactamente dónde se están perdiendo oportunidades hoy.',
      manageSave: 'Guarda este enlace por si el correo de confirmación no llega — es la única forma de cancelar o mover tu llamada:',
      back: 'Volver al inicio',
      demoLead: 'Mientras tanto, prueba el agente con tu propio catálogo.',
      demoCta: 'Probar la demo',
    },
    demo: {
      meta: {
        title: 'Demo en Vivo | Anytrail',
        description:
          'Mira un agente de ventas con IA construido sobre tu propio sitio web en un minuto. Aprende tus productos y te los vende — más tu perfil de cliente ideal y 5 prospectos.',
        ogLocale: 'es_ES',
      },
    },
    schedule: {
      meta: {
        title: 'Agenda una revisión de tu proceso comercial | Anytrail',
        description:
          'Agenda una videollamada de 30 minutos. Revisamos cómo tu empresa encuentra y responde nuevas oportunidades hoy, y dónde se están perdiendo ventas.',
        ogLocale: 'es_ES',
      },
      title: 'Revisa mi proceso comercial',
      intro:
        'Treinta minutos, por video. Revisamos cómo te llegan las oportunidades hoy, qué tan rápido se responden, y qué pasa con las que nadie sigue.',
      bullets: [
        'Antes de la llamada enviamos una consulta por tus propios canales y medimos cuánto tarda la respuesta.',
        'Te entregamos los tiempos y las fugas, compres algo o no.',
        'Sin presentaciones. Trae las preguntas que tu equipo comercial discute.',
      ],
      pickDay: 'Elige un día',
      pickTime: 'Elige una hora',
      yourZone: 'Horarios en tu zona horaria',
      noSlots: 'No hay horarios disponibles ese día. Prueba con otro.',
      form: { name: 'Tu nombre', email: 'Correo de trabajo', website: 'Sitio web de la empresa', note: '¿Algo que debamos saber? (opcional)' },
      submit: 'Agendar la llamada',
      booking: 'Agendando...',
      manageTitle: 'Tu cita',
      cancel: 'Cancelar esta llamada',
      move: 'Mover a otro horario',
      cancelled: 'Tu llamada fue cancelada. Puedes agendar otra cuando quieras.',
      errors: {
        invalid_website: 'No pudimos usar esa dirección web. Revisa la URL e inténtalo de nuevo.',
        invalid_input: 'Algo no se ve bien. Revisa el formulario e inténtalo de nuevo.',
        slot_taken: 'Alguien acaba de tomar ese horario. Elige otro.',
        already_booked: 'Ya tienes una llamada agendada. Usa el enlace de tu correo de confirmación para cambiarla.',
        rate_limited: 'Demasiados intentos. Inténtalo más tarde.',
        invalid_link: 'Ese enlace no es válido. Revisa el de tu correo de confirmación.',
        unknown_booking: 'No encontramos esa cita. Puede que ya esté cancelada.',
        generic: 'Algo salió mal. Inténtalo de nuevo.',
      },
    },
    footer: {
      tagline: 'Agentes de ventas con IA para empresas de equipo industrial. © 2026 Anytrail',
    },
  },
}

export const LANGS = ['en', 'es']

// Path prefix per language. English is the site root.
export const LANG_PATH = { en: '/', es: '/es' }

// Every route on the site, keyed by language then page. Localised paths, so a
// Spanish visitor never sees an English URL. prerender.js walks this to decide
// what to render, so adding a page here is enough to get it built.
export const ROUTES = {
  en: { home: '/', thanks: '/thanks', demo: '/demo', schedule: '/schedule' },
  es: { home: '/es', thanks: '/es/gracias', demo: '/es/demo', schedule: '/es/agenda' },
}

// Pages that must never be indexed. A thank-you page ranking in search would
// pull people past the booking step into a dead end.
export const NOINDEX_PAGES = ['thanks']

const normalise = (p) => {
  const trimmed = String(p || '/').replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

// Language and page are derived from the URL, not from state, so each is a
// real crawlable page that hreflang can point at.
export function routeFromPath(pathname) {
  const path = normalise(pathname)
  for (const lang of LANGS) {
    for (const [page, route] of Object.entries(ROUTES[lang])) {
      if (normalise(route) === path) return { lang, page }
    }
  }
  // Unknown path: fall back to the home page of the matching language.
  return { lang: path.startsWith(LANG_PATH.es) ? 'es' : 'en', page: 'home' }
}

export function langFromPath(pathname) {
  return routeFromPath(pathname).lang
}

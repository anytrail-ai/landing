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
    // Cluster page. Structure is read by ClusterPage.jsx, so the two remaining
    // cluster pages are a copy block and a ROUTES entry, nothing more.
    speedToLead: {
      meta: {
        title: 'Speed to Lead for Industrial Equipment Companies | Anytrail',
        description:
          'Speed to lead in industrial equipment sales is not how fast you reply. It is how fast the reply moves the quote forward. What to measure, and where the hours actually go.',
        ogLocale: 'en_US',
      },
      h1: 'Speed to lead in industrial equipment sales.',
      // Short form for the footer link, where the full h1 sentence is too long.
      navLabel: 'Speed to lead in industrial sales',
      lede: [
        'Speed to lead is the time between an inquiry arriving and somebody responding to it. In industrial equipment sales that definition is close to useless, because the reply that counts is not the first one. It is the first one that moved the deal toward a quote.',
        'This page is about that difference: why the standard advice does not transfer from software to equipment, where the hours really go, and what to measure instead.',
      ],
      sections: [
        {
          label: 'WHERE THE NUMBER CAME FROM',
          title: 'The five minute rule was written for mortgage forms.',
          paras: [
            'Every speed to lead statistic in circulation traces back to the same handful of studies, and all of them measured web form fills for mortgages, insurance, and software trials. In those markets the product is already defined and the buyer is comparing price and patience. Calling within five minutes works because there is nothing left to figure out. Someone wants a thirty year fixed, and you either quote it or you do not.',
            'Industrial equipment does not behave that way. When a maintenance manager writes in about a pressure washer, nobody yet knows what to sell. Not you, and not them. The residue is unnamed, the duty cycle is a guess, and whether there is three phase power at the wash bay is a question that decides which half of your catalog is even eligible. Answering that inquiry in five minutes with a price is not fast. It is wrong, quickly.',
            'The speed that matters here is a different quantity, and it is worth naming precisely, because the number most teams track is not it.',
          ],
        },
        {
          title: 'The first person to answer writes the spec.',
          paras: [
            'There is a mechanic in technical sales that does not exist in commodity sales, and it settles more deals than price does. Whoever answers first gets to ask the diagnostic questions. Whoever asks the diagnostic questions defines what the requirement is. By the time the buyer reaches the second vendor, they are no longer describing a problem. They are reading back a specification your competitor wrote, and asking to be quoted against it.',
            'Every equipment salesperson has felt this from the losing side. The quote request comes in oddly particular, the customer insists on a feature nobody asks for unprompted, and the deal gets scored on a sheet you had no hand in building. That sheet was built during the first conversation, usually within a day of the inquiry, often by whoever happened to be near their phone.',
            'That is the real prize for answering first, and it also explains why answering fast with nothing does not collect it.',
          ],
        },
        {
          title: 'An instant reply that says nothing is still a lost day.',
          paras: [
            'Most teams that set out to fix response time end up improving the wrong number. They add an autoresponder, or a chat widget that greets the visitor, or a routing rule that assigns the inquiry to a rep within sixty seconds. The dashboard turns green. Nothing changes, because none of those things asked the buyer a question.',
            'Two clocks run on every inquiry. The first is time to first contact, which is what a CRM reports. The second is time to first useful reply, meaning the first message that moved the opportunity closer to a quotable specification. Only the second one predicts anything. An acknowledgment at thirty seconds followed by a real question nineteen hours later is a nineteen hour response, and the buyer experienced it as one.',
          ],
          pointsLabel: 'Worth measuring',
          points: [
            {
              title: 'Time to first useful reply',
              body: 'The gap between the inquiry landing and the first message that asks something a quote depends on. Not the acknowledgment. The question.',
            },
            {
              title: 'Share of inquiries arriving off hours',
              body: 'What lands after six, on weekends, and during shutdown weeks. Most teams have never actually measured this and guess low, because a message that arrived at 21:40 looks like Monday morning by the time anyone opens it.',
            },
            {
              title: 'Round trips to a quotable spec',
              body: 'How many exchanges it takes to get from the first inquiry to enough information to price. Every round trip costs a day, and every day is an opening for somebody else.',
            },
            {
              title: 'Follow up survival',
              body: 'Of the inquiries that went quiet after one exchange, how many got a second attempt. This is usually the largest single leak, and it hides well, because nothing failed. Somebody just got busy.',
            },
          ],
        },
        {
          title: 'Where the hours actually go.',
          paras: [
            'None of this is a motivation problem. Good salespeople lose these hours too. The delay is structural, and it shows up in four predictable places.',
          ],
          points: [
            {
              title: 'Nobody owns the hour it arrived',
              body: 'The line is covered from eight to six. The inquiry landed at 21:40. There is no rule for that hour, so it waits for a shift that already has a queue of its own.',
            },
            {
              title: 'It arrived incomplete',
              body: 'The buyer wrote two sentences. Pricing needs six answers. Someone has to go back and ask, which puts the clock on the buyer’s schedule instead of yours.',
            },
            {
              title: 'It was routed before it was understood',
              body: 'Assignment rules split by territory or product line, but an inquiry rarely states either one clearly. The wrong rep receives it, reads it, forwards it, and the day is gone.',
            },
            {
              title: 'The follow up depended on memory',
              body: 'Equipment deals close on the second and third touch. Those are exactly the ones that live in a person’s head in between other work.',
            },
          ],
        },
        {
          label: 'WHAT WE DO ABOUT IT',
          title: 'Anytrail answers with the question, not the greeting.',
          paras: [
            'Anytrail replies the moment an inquiry lands, whether it came from WhatsApp, an ad, or your website, and the first message it sends is diagnostic. It asks what the residue is, how many hours a week the machine will run, and whether the site has three phase power, because those are the questions your own team asks before it prices anything.',
            'It keeps going until there is enough to quote, matches the application against your catalog, and hands the opportunity to a salesperson with the answers already collected. If the buyer goes quiet, it comes back over the following days and weeks without anyone having to remember. The same agent works the other direction as well, opening conversations with accounts that match what you sell.',
            'Your team keeps pricing, the technical recommendation, the quotation, and the sale. That boundary is deliberate. An agent that quotes is an agent that will eventually quote something you cannot deliver.',
          ],
        },
      ],
      limits: {
        title: 'What this does not do.',
        items: [
          'It does not set prices or issue quotes. It collects what a quote needs and hands that over.',
          'It does not replace a salesperson on a technical call. It makes sure that call starts with the application already diagnosed.',
          'We publish no benchmark response times, industry averages, or conversion lifts. We have not measured them ourselves, and the figures in circulation were measured on a different kind of sale.',
        ],
      },
      relatedLabel: 'Keep reading',
      related: [
        { page: 'home', label: 'How Anytrail works, inbound and outbound' },
        { page: 'demo', label: 'Build an agent on your own catalog in a minute' },
        { page: 'schedule', label: 'Book a commercial process review' },
      ],
      closing: {
        title: 'Find out what your own response time actually is.',
        body: 'Before the call we send a real inquiry through your own inbound channels and time how long a useful reply takes. You get the timings either way, whether or not you buy anything.',
        cta: 'Review my commercial process',
      },
    },
    footer: {
      tagline: 'AI sales agents for industrial equipment companies. © 2026 Anytrail',
      linksLabel: 'Reading',
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
    // "Speed to lead" no tiene equivalente de búsqueda en español. El comprador
    // industrial mexicano busca "tiempo de respuesta", así que la página se
    // escribe sobre ese término, no sobre la traducción del modismo inglés.
    speedToLead: {
      meta: {
        title: 'Tiempo de respuesta a leads industriales | Anytrail',
        description:
          'En la venta de equipo industrial no gana el que contesta rápido, sino el que contesta algo que acerca la cotización. Qué medir y dónde se van realmente las horas.',
        ogLocale: 'es_ES',
      },
      h1: 'Tiempo de respuesta a leads en la venta de equipo industrial.',
      navLabel: 'Tiempo de respuesta a leads industriales',
      lede: [
        'El tiempo de respuesta es lo que pasa entre que llega una consulta y que alguien contesta. En la venta de equipo industrial esa definición sirve de poco, porque la respuesta que cuenta no es la primera. Es la primera que acercó el trato a una cotización.',
        'De eso trata esta página: por qué el consejo estándar no se traslada del software al equipo, dónde se van de verdad las horas, y qué conviene medir en su lugar.',
      ],
      sections: [
        {
          label: 'DE DÓNDE SALIÓ EL NÚMERO',
          title: 'La regla de los cinco minutos se escribió para formularios de crédito.',
          paras: [
            'Todas las estadísticas de tiempo de respuesta que circulan vienen del mismo puñado de estudios, y todos midieron formularios web de créditos hipotecarios, seguros y pruebas de software. En esos mercados el producto ya está definido y el comprador compara precio y paciencia. Llamar en cinco minutos funciona porque no queda nada por averiguar. Alguien quiere un crédito a plazo fijo y tú se lo cotizas o no.',
            'El equipo industrial no se comporta así. Cuando un jefe de mantenimiento escribe preguntando por una hidrolavadora, todavía nadie sabe qué se va a vender. Ni tú ni él. El residuo no tiene nombre, el ciclo de trabajo es una suposición, y si hay o no corriente trifásica en la zona de lavado es una pregunta que decide cuál mitad de tu catálogo siquiera califica. Contestar esa consulta en cinco minutos con un precio no es rapidez. Es equivocarse rápido.',
            'La velocidad que importa aquí es otra cosa, y vale la pena nombrarla con precisión, porque el número que casi todos miden no es ese.',
          ],
        },
        {
          title: 'El primero que contesta es el que redacta la especificación.',
          paras: [
            'Hay una mecánica en la venta técnica que no existe en la venta de commodities, y define más tratos que el precio. El que contesta primero es el que hace las preguntas de diagnóstico. El que hace las preguntas de diagnóstico es el que define cuál es el requerimiento. Para cuando el comprador llega con el segundo proveedor, ya no está describiendo un problema. Está leyendo en voz alta una especificación que escribió tu competencia, y pidiendo que le coticen contra ella.',
            'Cualquier vendedor de equipo lo ha vivido desde el lado perdedor. La solicitud llega rara de específica, el cliente insiste en una característica que nadie pide por su cuenta, y el trato se califica en una tabla que tú no ayudaste a armar. Esa tabla se armó en la primera conversación, casi siempre dentro del primer día, muchas veces por quien tenía el celular a la mano.',
            'Ese es el verdadero premio por contestar primero, y también explica por qué contestar rápido sin decir nada no lo cobra.',
          ],
        },
        {
          title: 'Una respuesta inmediata que no dice nada sigue siendo un día perdido.',
          paras: [
            'La mayoría de los equipos que se proponen arreglar el tiempo de respuesta terminan mejorando el número equivocado. Ponen un autorespondedor, o un chat que saluda al visitante, o una regla que asigna la consulta a un vendedor en menos de un minuto. El tablero se pone verde. Nada cambia, porque ninguna de esas cosas le preguntó nada al comprador.',
            'En cada consulta corren dos relojes. El primero es el tiempo hasta el primer contacto, que es lo que reporta el CRM. El segundo es el tiempo hasta la primera respuesta útil, es decir el primer mensaje que acercó la oportunidad a una especificación cotizable. Solo el segundo predice algo. Un acuse de recibo a los treinta segundos y una pregunta real diecinueve horas después es una respuesta de diecinueve horas, y así la vivió el comprador.',
          ],
          pointsLabel: 'Lo que vale la pena medir',
          points: [
            {
              title: 'Tiempo hasta la primera respuesta útil',
              body: 'Lo que pasa entre que llega la consulta y el primer mensaje que pregunta algo de lo que depende una cotización. No el acuse de recibo. La pregunta.',
            },
            {
              title: 'Cuántas consultas llegan fuera de horario',
              body: 'Lo que entra después de las seis, en fin de semana y en semanas de paro de planta. Casi nadie lo ha medido de verdad y todos lo subestiman, porque un mensaje que llegó a las 21:40 parece del lunes en la mañana para cuando alguien lo abre.',
            },
            {
              title: 'Cuántas vueltas hasta poder cotizar',
              body: 'Cuántos intercambios se necesitan desde la primera consulta hasta tener con qué poner precio. Cada vuelta cuesta un día, y cada día es una puerta abierta para alguien más.',
            },
            {
              title: 'Cuántos seguimientos sobreviven',
              body: 'De las consultas que se quedaron calladas después de un intercambio, cuántas recibieron un segundo intento. Suele ser la fuga más grande, y se esconde bien, porque nada falló. Alguien simplemente se ocupó en otra cosa.',
            },
          ],
        },
        {
          title: 'Dónde se van realmente las horas.',
          paras: [
            'Nada de esto es falta de ganas. A los buenos vendedores también se les van estas horas. La demora es estructural, y aparece en cuatro lugares predecibles.',
          ],
          points: [
            {
              title: 'Nadie es dueño de la hora en que llegó',
              body: 'La línea está cubierta de ocho a seis. La consulta entró a las 21:40. Para esa hora no hay regla, así que espera a un turno que ya trae su propia cola.',
            },
            {
              title: 'Llegó incompleta',
              body: 'El comprador escribió dos renglones. Para cotizar hacen falta seis datos. Alguien tiene que regresar a preguntar, y eso pone el reloj en la agenda del comprador y no en la tuya.',
            },
            {
              title: 'Se asignó antes de entenderse',
              body: 'Las reglas de asignación reparten por zona o por línea de producto, pero una consulta casi nunca dice ninguna de las dos con claridad. Le llega al vendedor equivocado, la lee, la reenvía, y se fue el día.',
            },
            {
              title: 'El seguimiento dependía de la memoria',
              body: 'Los tratos de equipo se cierran en el segundo y el tercer contacto. Justo los que viven en la cabeza de una persona entre un pendiente y otro.',
            },
          ],
        },
        {
          label: 'QUÉ HACEMOS AL RESPECTO',
          title: 'Anytrail contesta con la pregunta, no con el saludo.',
          paras: [
            'Anytrail responde en el momento en que llega la consulta, venga de WhatsApp, de un anuncio o de tu sitio web, y su primer mensaje es de diagnóstico. Pregunta qué residuo hay que remover, cuántas horas a la semana va a trabajar el equipo y si la planta tiene corriente trifásica, porque son las preguntas que tu propio equipo hace antes de poner un precio.',
            'Sigue hasta reunir lo necesario para cotizar, identifica el equipo de tu catálogo que corresponde a esa aplicación, y entrega la oportunidad a un vendedor con las respuestas ya reunidas. Si el comprador deja de contestar, vuelve en los días y semanas siguientes sin que nadie tenga que acordarse. El mismo agente trabaja también la otra dirección, abriendo conversaciones con cuentas que embonan con lo que vendes.',
            'Tu equipo conserva el precio, la recomendación técnica, la cotización y la venta. Ese límite es a propósito. Un agente que cotiza es un agente que tarde o temprano va a cotizar algo que no puedes entregar.',
          ],
        },
      ],
      limits: {
        title: 'Qué no hace.',
        items: [
          'No pone precios ni emite cotizaciones. Reúne lo que una cotización necesita y lo entrega.',
          'No sustituye al vendedor en una llamada técnica. Se asegura de que esa llamada empiece con la aplicación ya diagnosticada.',
          'No publicamos tiempos de respuesta de referencia, promedios de industria ni mejoras de conversión. No los hemos medido nosotros, y los que circulan se midieron sobre otro tipo de venta.',
        ],
      },
      relatedLabel: 'Seguir leyendo',
      related: [
        { page: 'home', label: 'Cómo funciona Anytrail, entrante y de prospección' },
        { page: 'demo', label: 'Arma un agente con tu propio catálogo en un minuto' },
        { page: 'schedule', label: 'Agenda una revisión de tu proceso comercial' },
      ],
      closing: {
        title: 'Averigua cuál es tu tiempo de respuesta real.',
        body: 'Antes de la llamada enviamos una consulta real por tus propios canales de ventas entrantes y medimos cuánto tarda en llegar una respuesta útil. Te entregamos los tiempos de cualquier forma, compres algo o no.',
        cta: 'Revisa mi proceso comercial',
      },
    },
    footer: {
      tagline: 'Agentes de ventas con IA para empresas de equipo industrial. © 2026 Anytrail',
      linksLabel: 'Lectura',
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
  en: {
    home: '/',
    thanks: '/thanks',
    demo: '/demo',
    schedule: '/schedule',
    speedToLead: '/speed-to-lead',
  },
  es: {
    home: '/es',
    thanks: '/es/gracias',
    demo: '/es/demo',
    schedule: '/es/agenda',
    // "speed to lead" has no Spanish search equivalent, so the slug is built
    // on the term a Spanish-speaking industrial buyer actually types.
    speedToLead: '/es/tiempo-de-respuesta',
  },
}

// Long-form content pages, in the order they appear in the footer. Every page
// on the site links here, which is what gives a new cluster page more than the
// single internal link Semrush flags.
export const CLUSTER_PAGES = ['speedToLead']

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

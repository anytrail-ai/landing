// All landing-page copy in both languages. One object per section.
export const COPY = {
  en: {
    navbar: {
      cta: 'Book a demo',
    },
    hero: {
      title: 'Turn more inbound inquiries into equipment sales.',
      subtitle:
        'Anytrail answers new leads for industrial equipment companies, diagnoses what the customer needs, collects the details for a quote, and follows up — so your sales team steps in when a real opportunity is ready.',
      cta: 'Book a demo',
      ctaNote:
        'Leads from WhatsApp, ads, and your website — handled the same way your best salesperson would.',
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
        { from: 'anytrail', text: 'Got it — daily industrial use. Do you have three-phase power at the site? That decides which models we can quote.', time: '09:15' },
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
      title: 'You pay to generate leads. Then sales are lost after the inquiry arrives.',
      intro:
        "Most industrial equipment sales don't fail at the ad or the website. They fail in the gap between the inquiry and the quote.",
      leaks: [
        { title: 'Slow first response', body: 'An interested buyer writes in, waits, and buys from whoever answers first.' },
        { title: 'Incomplete information', body: 'Quotes stall because nobody collected the application details, power supply, or usage before pricing.' },
        { title: 'Forgotten follow-up', body: 'A lead goes quiet, the salesperson moves on, and the opportunity dies without a decision.' },
        { title: 'Time lost on unqualified leads', body: 'Salespeople repeat the same questions all day instead of working the deals that can actually close.' },
      ],
    },
    how: {
      label: 'HOW IT WORKS',
      title: 'Every inquiry follows the same path — from first message to your sales team.',
      intro:
        'Anytrail runs your inbound process, step by step. Your team keeps control of pricing, technical recommendations, quotes, and the final sale.',
      steps: [
        { title: 'New inquiry', body: 'A lead arrives from WhatsApp, an ad, or your website. Anytrail replies right away.' },
        { title: 'Diagnosis', body: 'It asks the qualification questions your sales team uses — application, usage, site conditions.' },
        { title: 'Recommendation', body: 'It helps identify the right equipment from your catalog for that application.' },
        { title: 'Quote preparation', body: 'It collects the technical and commercial details your team needs to prepare the quotation.' },
        { title: 'Follow-up', body: 'It keeps the conversation alive over days or weeks, so no lead is forgotten.' },
        { title: 'Sales team handoff', body: 'Qualified opportunities go to your salespeople with the full context, ready to close.' },
      ],
    },
    different: {
      label: "WHY IT'S DIFFERENT",
      title: 'Not a chatbot. Not a CRM. Part of your sales operation.',
      intro:
        "Anytrail learns what you sell, asks your team's qualification questions, and works each lead through a real sales process. It knows when to keep the conversation going and when your salespeople should take over.",
      comparisons: [
        { label: 'A chatbot', body: 'Answers isolated questions. It doesn’t diagnose the application, collect quote details, or follow up next week.' },
        { label: 'A CRM', body: 'Organizes leads after someone types the information in. It doesn’t talk to the customer or move the deal forward.' },
        { label: 'A lead agency', body: 'Sends you more inquiries. It doesn’t handle what happens after they arrive — which is where sales are lost.' },
      ],
    },
    proof: {
      label: 'PROOF',
      title: 'Built inside a real industrial equipment sales team.',
      p1a: 'Anytrail works closely with ',
      p1b:
        ', an industrial equipment company. For HIDROREY, Anytrail participates in the inbound process from the first inquiry through diagnosis, product recommendation, quotation, and follow-up — and that process has contributed to machine sales.',
      p2:
        'It was developed around the way industrial equipment is actually diagnosed, quoted, followed up, and sold — not around a generic chatbot script.',
    },
    closing: {
      title: 'Review your inbound process',
      body:
        "We'll look at how your company currently responds to new inquiries and identify where potential sales may be getting lost.",
      cta: 'Book a demo',
    },
    footer: {
      tagline: 'Inbound sales for industrial equipment companies. © 2026 Anytrail',
    },
  },

  es: {
    navbar: {
      cta: 'Agenda una demo',
    },
    hero: {
      title: 'Convierte más consultas entrantes en ventas de equipo.',
      subtitle:
        'Anytrail responde a los nuevos leads de empresas de equipo industrial, diagnostica lo que el cliente necesita, reúne los datos para cotizar y da seguimiento — para que tu equipo de ventas entre cuando hay una oportunidad real.',
      cta: 'Agenda una demo',
      ctaNote:
        'Leads de WhatsApp, anuncios y tu sitio web — atendidos como lo haría tu mejor vendedor.',
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
        { from: 'anytrail', text: 'Entendido — uso industrial diario. ¿Cuentan con corriente trifásica en la planta? Eso define qué modelos podemos cotizar.', time: '09:15' },
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
      title: 'Pagas por generar leads. Y las ventas se pierden después de que llega la consulta.',
      intro:
        'La mayoría de las ventas de equipo industrial no se pierden en el anuncio ni en el sitio web. Se pierden en el hueco entre la consulta y la cotización.',
      leaks: [
        { title: 'Respuesta lenta', body: 'Un comprador interesado escribe, espera, y le compra al primero que contesta.' },
        { title: 'Información incompleta', body: 'Las cotizaciones se atoran porque nadie reunió la aplicación, la alimentación eléctrica o el uso antes de dar precio.' },
        { title: 'Seguimiento olvidado', body: 'Un lead deja de contestar, el vendedor sigue con otra cosa, y la oportunidad muere sin decisión.' },
        { title: 'Tiempo perdido en leads no calificados', body: 'Los vendedores repiten las mismas preguntas todo el día en lugar de trabajar los tratos que sí pueden cerrar.' },
      ],
    },
    how: {
      label: 'CÓMO FUNCIONA',
      title: 'Cada consulta sigue el mismo camino — del primer mensaje a tu equipo de ventas.',
      intro:
        'Anytrail lleva tu proceso de ventas entrantes, paso a paso. Tu equipo mantiene el control de precios, recomendaciones técnicas, cotizaciones y la venta final.',
      steps: [
        { title: 'Nueva consulta', body: 'Llega un lead por WhatsApp, un anuncio o tu sitio web. Anytrail responde de inmediato.' },
        { title: 'Diagnóstico', body: 'Hace las preguntas de calificación que usa tu equipo — aplicación, uso, condiciones del sitio.' },
        { title: 'Recomendación', body: 'Ayuda a identificar el equipo adecuado de tu catálogo para esa aplicación.' },
        { title: 'Preparación de cotización', body: 'Reúne los datos técnicos y comerciales que tu equipo necesita para cotizar.' },
        { title: 'Seguimiento', body: 'Mantiene viva la conversación durante días o semanas, para que ningún lead se olvide.' },
        { title: 'Entrega al equipo de ventas', body: 'Las oportunidades calificadas llegan a tus vendedores con todo el contexto, listas para cerrar.' },
      ],
    },
    different: {
      label: 'POR QUÉ ES DIFERENTE',
      title: 'No es un chatbot. No es un CRM. Es parte de tu operación de ventas.',
      intro:
        'Anytrail aprende lo que vendes, hace las preguntas de calificación de tu equipo y trabaja cada lead dentro de un proceso de ventas real. Sabe cuándo seguir la conversación y cuándo deben entrar tus vendedores.',
      comparisons: [
        { label: 'Un chatbot', body: 'Contesta preguntas sueltas. No diagnostica la aplicación, no reúne datos para cotizar y no da seguimiento la próxima semana.' },
        { label: 'Un CRM', body: 'Organiza leads después de que alguien captura la información. No habla con el cliente ni avanza el trato.' },
        { label: 'Una agencia de leads', body: 'Te manda más consultas. No se encarga de lo que pasa después de que llegan — que es donde se pierden las ventas.' },
      ],
    },
    proof: {
      label: 'PRUEBA',
      title: 'Construido dentro de un equipo de ventas de equipo industrial real.',
      p1a: 'Anytrail trabaja de cerca con ',
      p1b:
        ', una empresa de equipo industrial. Para HIDROREY, Anytrail participa en el proceso de ventas entrantes desde la primera consulta hasta el diagnóstico, la recomendación de producto, la cotización y el seguimiento — y ese proceso ha contribuido a ventas de maquinaria.',
      p2:
        'Se desarrolló alrededor de cómo realmente se diagnostica, cotiza, da seguimiento y vende el equipo industrial — no alrededor de un guion genérico de chatbot.',
    },
    closing: {
      title: 'Revisa tu proceso de ventas entrantes',
      body:
        'Revisamos cómo responde hoy tu empresa a las nuevas consultas e identificamos dónde se pueden estar perdiendo ventas.',
      cta: 'Agenda una demo',
    },
    footer: {
      tagline: 'Ventas entrantes para empresas de equipo industrial. © 2026 Anytrail',
    },
  },
}

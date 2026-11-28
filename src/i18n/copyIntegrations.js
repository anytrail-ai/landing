// Copy for the integrations page (/integrations, /es/integraciones).
//
// `groups` is the list of what Anytrail connects to. Every name in it is an
// integration that exists in the product today (lead-crm: the ERP connectors,
// WhatsApp, the Google and Microsoft mail sign-ins, Shopify, Mercado Pago,
// Telnyx, Slack, Meta lead ads). Add a name here only when the integration
// is real; anything else belongs under "Don't see yours?".
export const INTEGRATIONS_COPY = {
  en: {
    meta: {
      title: 'Integrations | Anytrail',
      description:
        'Anytrail connects to the ERP, messaging, email, storefront and payment tools a distributor already runs. See what it works with, how the connection is set up and who controls what gets written back.',
      ogLocale: 'en_US',
    },
    hero: {
      label: 'Integrations',
      title: 'Anytrail connects to the systems you already run',
      body: 'Your ERP, your inbox, your WhatsApp line and your storefront stay where they are. Anytrail reads from them, keeps one record of each customer, and writes back only what you allow.',
      cta: 'Talk about your setup',
      secondary: 'See what it works with',
    },
    list: {
      label: 'What it works with',
      title: 'The tools around a distributor’s day',
      groups: [
        {
          name: 'ERP',
          body: 'Customers, products, prices, stock, quotes and orders, read from the ERP and written back to it.',
          items: ['Odoo', 'Microsip', 'SAI'],
        },
        {
          name: 'Messaging',
          body: 'Every conversation on your business line, attached to its customer.',
          items: ['WhatsApp Business', 'WhatsApp Web'],
        },
        {
          name: 'Email',
          body: 'Each rep connects their own mailbox, so quotes and replies go out from their address.',
          items: ['Gmail', 'Google Workspace', 'Outlook', 'Microsoft 365'],
        },
        {
          name: 'Storefront and payments',
          body: 'Catalog, prices and orders from your store, and payment links your customers can pay from a chat.',
          items: ['Shopify', 'Mercado Pago'],
        },
        {
          name: 'Phone',
          body: 'Calls placed and logged from the customer’s record.',
          items: ['Telnyx'],
        },
        {
          name: 'Team and ads',
          body: 'Conversations mirrored to your team’s channels, and leads from your ads arriving already attributed.',
          items: ['Slack', 'Meta lead ads'],
        },
        {
          name: 'Files',
          body: 'Price lists, catalogs and quotes, read in and sent out as documents.',
          items: ['Excel', 'CSV', 'PDF'],
        },
      ],
      other: {
        title: 'Don’t see yours?',
        body: 'Most ERPs can be connected. Tell us what you run and we will tell you plainly what the connection would take.',
        cta: 'Tell us what you use',
      },
    },
    control: {
      label: 'Control',
      title: 'Know who can act on your data',
      body: 'Connecting a system is one decision. What Anytrail may do with it is a separate one, and it stays yours.',
      items: [
        {
          title: 'You control write-back',
          body: 'Anytrail writes to your ERP only along the paths you approve: a quote, an order, a stock update.',
        },
        {
          title: 'Agents ask first',
          body: 'For each agent you choose what goes out on its own and what waits for a person to approve.',
        },
        {
          title: 'Access by role',
          body: 'Reps, managers and admins see and do different things. Each rep works their own accounts.',
        },
      ],
      link: 'Read the privacy policy',
    },
    faq: {
      title: 'Questions about connecting',
      body: 'If yours is not here, we can go through it on a call.',
      cta: 'Book a call',
      items: [
        {
          q: 'Will Anytrail work with our ERP?',
          a: 'If it is Odoo, Microsip or SAI, the connector already exists. For anything else, tell us which ERP and how you reach it today, and we will tell you what the connection would take before you commit to anything.',
        },
        {
          q: 'Who does the integration, and what do you need from us?',
          a: 'We do it. From you we need access to the ERP, or to an export of it, and someone who knows how your data is organised for a couple of conversations.',
        },
        {
          q: 'Does our data need to be clean before we start?',
          a: 'No. We work with it as it is and show you what we find: duplicate customers, products without a category, prices that disagree.',
        },
        {
          q: 'Can Anytrail connect more than one ERP or company?',
          a: 'Yes. Each one is connected separately and your team works across them from one place.',
        },
        {
          q: 'Can Anytrail write back to our ERP?',
          a: 'Yes, where you allow it. Quotes and orders can be created in the ERP from Anytrail. Nothing is written along a path you have not approved.',
        },
      ],
    },
  },

  es: {
    meta: {
      title: 'Integraciones | Anytrail',
      description:
        'Anytrail se conecta al ERP, la mensajería, el correo, la tienda en línea y los medios de pago que un distribuidor ya usa. Conoce con qué funciona, cómo se hace la conexión y quién controla lo que se escribe de vuelta.',
      ogLocale: 'es_ES',
    },
    hero: {
      label: 'Integraciones',
      title: 'Anytrail se conecta a los sistemas que ya usas',
      body: 'Tu ERP, tu correo, tu línea de WhatsApp y tu tienda en línea se quedan donde están. Anytrail lee de ellos, mantiene un solo registro de cada cliente y escribe de vuelta solo lo que permitas.',
      cta: 'Platiquemos de tu caso',
      secondary: 'Ver con qué funciona',
    },
    list: {
      label: 'Con qué funciona',
      title: 'Las herramientas del día a día de un distribuidor',
      groups: [
        {
          name: 'ERP',
          body: 'Clientes, productos, precios, existencias, cotizaciones y pedidos, leídos del ERP y escritos de vuelta.',
          items: ['Odoo', 'Microsip', 'SAI'],
        },
        {
          name: 'Mensajería',
          body: 'Cada conversación de tu línea de negocio, ligada a su cliente.',
          items: ['WhatsApp Business', 'WhatsApp Web'],
        },
        {
          name: 'Correo',
          body: 'Cada vendedor conecta su propio buzón, así las cotizaciones y respuestas salen desde su dirección.',
          items: ['Gmail', 'Google Workspace', 'Outlook', 'Microsoft 365'],
        },
        {
          name: 'Tienda en línea y pagos',
          body: 'Catálogo, precios y pedidos de tu tienda, y ligas de pago que tus clientes pueden pagar desde un chat.',
          items: ['Shopify', 'Mercado Pago'],
        },
        {
          name: 'Teléfono',
          body: 'Llamadas hechas y registradas desde la ficha del cliente.',
          items: ['Telnyx'],
        },
        {
          name: 'Equipo y anuncios',
          body: 'Conversaciones reflejadas en los canales de tu equipo, y prospectos de tus anuncios que llegan ya atribuidos.',
          items: ['Slack', 'Anuncios de Meta'],
        },
        {
          name: 'Archivos',
          body: 'Listas de precios, catálogos y cotizaciones, leídos y enviados como documentos.',
          items: ['Excel', 'CSV', 'PDF'],
        },
      ],
      other: {
        title: '¿No ves el tuyo?',
        body: 'La mayoría de los ERP se pueden conectar. Cuéntanos qué usas y te decimos con claridad qué implicaría la conexión.',
        cta: 'Cuéntanos qué usas',
      },
    },
    control: {
      label: 'Control',
      title: 'Sabe quién puede actuar sobre tus datos',
      body: 'Conectar un sistema es una decisión. Lo que Anytrail puede hacer con él es otra, y sigue siendo tuya.',
      items: [
        {
          title: 'Tú controlas lo que se escribe',
          body: 'Anytrail escribe en tu ERP solo por las vías que apruebas: una cotización, un pedido, una actualización de existencias.',
        },
        {
          title: 'Los agentes preguntan antes',
          body: 'Para cada agente eliges qué sale solo y qué espera a que una persona lo apruebe.',
        },
        {
          title: 'Acceso por rol',
          body: 'Vendedores, gerentes y administradores ven y hacen cosas distintas. Cada vendedor trabaja sus propias cuentas.',
        },
      ],
      link: 'Leer la política de privacidad',
    },
    faq: {
      title: 'Preguntas sobre la conexión',
      body: 'Si la tuya no está aquí, la vemos en una llamada.',
      cta: 'Agenda una llamada',
      items: [
        {
          q: '¿Anytrail funciona con nuestro ERP?',
          a: 'Si es Odoo, Microsip o SAI, el conector ya existe. Para cualquier otro, dinos cuál es y cómo accedes a él hoy, y te decimos qué implicaría la conexión antes de que te comprometas a nada.',
        },
        {
          q: '¿Quién hace la integración y qué necesitan de nosotros?',
          a: 'La hacemos nosotros. De tu lado necesitamos acceso al ERP, o a una exportación, y alguien que conozca cómo están organizados tus datos para un par de conversaciones.',
        },
        {
          q: '¿Nuestros datos tienen que estar limpios antes de empezar?',
          a: 'No. Trabajamos con ellos como están y te mostramos lo que encontramos: clientes duplicados, productos sin categoría, precios que no coinciden.',
        },
        {
          q: '¿Anytrail puede conectar más de un ERP o empresa?',
          a: 'Sí. Cada uno se conecta por separado y tu equipo trabaja con todos desde un solo lugar.',
        },
        {
          q: '¿Anytrail puede escribir de vuelta en nuestro ERP?',
          a: 'Sí, donde lo permitas. Las cotizaciones y los pedidos se pueden crear en el ERP desde Anytrail. No se escribe nada por una vía que no hayas aprobado.',
        },
      ],
    },
  },
}

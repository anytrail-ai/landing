// Copy for the WhatsApp CRM / AI sales agent product (served under /crm).
// Each block overrides the matching block in COPY when a page belongs to the
// CRM product; see copyFor() in copy.js. Restored from the pre-AR site
// (6b55609) when anytrail.ai became a product chooser.
export const CRM_COPY = {
  "en": {
    "meta": {
      "title": "Anytrail | Find the Revenue Your Business Is Already Losing",
      "description": "Anytrail finds the sales that distributors, wholesalers, and industrial equipment companies are missing. It works across WhatsApp, email, your CRM, and your ERP to answer every inquiry, revive stalled quotes, win back past customers, and show you what customers want that you don’t stock.",
      "ogLocale": "en_US"
    },
    "navbar": {
      "cta": "See my report"
    },
    "hero": {
      "clockLead": "You’ve been on this page for",
      "clockTail": "The average company takes 42 hours to answer an inquiry.",
      "clockSource": "Harvard Business Review, 2011",
      "title": "Find the revenue your business is already losing.",
      "subtitle": "Every quote, chat, and order holds a clue to your next sale. Anytrail watches your whole operation, across WhatsApp, email, your CRM, and your ERP, and surfaces the deals falling through the cracks: which customers to call, which quotes to revive, and which products to stock.",
      "cta": "See my revenue report",
      "ctaNote": "For distributors, wholesalers, and industrial equipment companies. Works with Salesforce, HubSpot, and SAP."
    },
    "benefits": {
      "label": "WHAT YOU GET BACK",
      "title": "The sales your team is too busy to catch.",
      "items": [
        {
          "title": "Never lose a lead to a slow reply",
          "body": "Every inquiry on WhatsApp or email is answered and qualified right away, at any hour, before the buyer moves on to the next supplier."
        },
        {
          "title": "Win back past customers",
          "body": "Anytrail spots repeat-buy moments, like equipment due for replacement or a plant ready to expand, and starts the conversation."
        },
        {
          "title": "No more forgotten quotes",
          "body": "It tracks every quote you send and follows up on the ones that stall, so you know exactly which deals need attention."
        },
        {
          "title": "Stock what customers ask for",
          "body": "See the products customers keep requesting that you don’t carry, and stop turning orders away."
        }
      ]
    },
    "audit": {
      "ariaLabel": "Sample revenue review for an example distributor: unanswered inquiries, stalled quotes, silent accounts, and unstocked requests, each with an estimated value.",
      "headerTitle": "Revenue review",
      "sample": "Sample",
      "company": "Example Industrial Supply",
      "period": "Last 90 days",
      "colFinding": "Found",
      "colValue": "Est. value",
      "lines": [
        {
          "text": "14 WhatsApp inquiries with no reply after 24 hours",
          "value": "$18,400",
          "recovered": "9 answered"
        },
        {
          "text": "6 quotes sent with no follow-up",
          "value": "$22,100",
          "recovered": "4 followed up"
        },
        {
          "text": "23 past customers silent for 18+ months",
          "value": "$31,500"
        },
        {
          "text": "9 requests for products you don’t stock",
          "value": "$7,200"
        }
      ],
      "totalLabel": "Revenue at risk",
      "total": "$79,200"
    },
    "problem": {
      "caught": "Caught by Anytrail",
      "linePrefix": "L-",
      "label": "WHERE THE MONEY GOES",
      "title": "Your business should be making more. The leaks are just hard to see.",
      "intro": "Revenue rarely disappears in one place. It leaks between systems: an inquiry on WhatsApp nobody answered, a quote in email nobody chased, a customer in the ERP nobody called back.",
      "stats": [
        {
          "value": "7×",
          "body": "more likely to qualify a lead when you reply within an hour instead of later.",
          "source": "Harvard Business Review, 2011",
          "url": "https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
        },
        {
          "value": "42 hrs",
          "body": "average response time across 2,241 U.S. companies, and 23% never responded at all.",
          "source": "Harvard Business Review, 2011",
          "url": "https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
        },
        {
          "value": "5–25×",
          "body": "more expensive to win a new customer than to keep one you already have.",
          "source": "Harvard Business Review, 2014",
          "url": "https://hbr.org/2014/10/the-value-of-keeping-the-right-customers"
        }
      ],
      "groups": [
        {
          "label": "Demand you never found",
          "leaks": [
            {
              "title": "No view of who is in market",
              "body": "Every account looks the same in the CRM, so the team works whoever shouted loudest instead of who is actually ready to buy."
            },
            {
              "title": "Your own customer base goes cold",
              "body": "Plants that bought two years ago, lines that expanded, equipment due for replacement. Nobody ever went back to ask."
            }
          ]
        },
        {
          "label": "Demand you answered too late",
          "leaks": [
            {
              "title": "Slow first response",
              "body": "An interested buyer writes in, waits, and buys from whoever answers first."
            },
            {
              "title": "Incomplete information",
              "body": "Quotes stall because nobody collected the application details, power supply, or usage before pricing."
            },
            {
              "title": "Forgotten follow-up",
              "body": "A lead goes quiet, the salesperson moves on, and the opportunity dies without a decision."
            }
          ]
        }
      ]
    },
    "how": {
      "stepLabel": "Step",
      "label": "HOW IT WORKS",
      "title": "Two ways an opportunity starts. One way it gets worked.",
      "intro": "Anytrail runs your commercial process, step by step, whether the opportunity came to you or you went and found it. Your team keeps control of pricing, technical recommendations, quotes, and the final sale.",
      "entriesLabel": "How the opportunity starts",
      "entries": [
        {
          "title": "Anytrail finds it",
          "body": "It surfaces accounts that match what you sell, both net-new companies in your market and customers already in your base worth going back to, then opens the conversation on WhatsApp, email, or LinkedIn."
        },
        {
          "title": "The opportunity finds you",
          "body": "An inquiry lands from WhatsApp, an ad, or your website. Anytrail answers immediately, at any hour, instead of leaving it until Monday."
        }
      ],
      "sharedLabel": "Then the same path, every time",
      "steps": [
        {
          "title": "Diagnosis",
          "body": "It asks the qualification questions your sales team uses: application, usage, site conditions."
        },
        {
          "title": "Recommendation",
          "body": "It helps identify the right equipment from your catalog for that application."
        },
        {
          "title": "Quote preparation",
          "body": "It collects the technical and commercial details your team needs to prepare the quotation."
        },
        {
          "title": "Follow-up",
          "body": "It keeps the conversation alive over days or weeks, so no opportunity is forgotten."
        },
        {
          "title": "Sales team handoff",
          "body": "Qualified opportunities go to your salespeople with the full context, ready to close."
        }
      ]
    },
    "different": {
      "usLabel": "Anytrail",
      "label": "WHY IT'S DIFFERENT",
      "title": "Not another chatbot or CRM. A revenue auditor that never clocks out.",
      "intro": "Anytrail learns what you sell, asks your team's qualification questions, and works each opportunity through a real sales process, in both directions. It knows when to keep the conversation going and when your salespeople should take over.",
      "comparisons": [
        {
          "label": "A chatbot",
          "body": "Answers isolated questions. It doesn’t diagnose the application, collect quote details, or follow up next week."
        },
        {
          "label": "A CRM or contact database",
          "body": "Sells you records and generic intent scores, then organizes leads after someone types the information in. It doesn’t know your products and it doesn’t move the deal forward."
        },
        {
          "label": "An outbound or sequence tool",
          "body": "Sends the message and stops there. Anyone can send the message. Almost nobody can answer the reply when a plant manager asks which model handles their duty cycle."
        },
        {
          "label": "A lead agency",
          "body": "Sends you more inquiries. It doesn’t handle what happens after they arrive, which is where sales are lost."
        }
      ]
    },
    "proof": {
      "label": "PROOF",
      "title": "Built inside real sales teams. Already finding money.",
      "stat": "+$50,000 USD",
      "statLabel": "in value found for our customers last month.",
      "p2": "Anytrail was built inside a working industrial sales team, around the way products are actually diagnosed, quoted, followed up, and sold, not around a generic chatbot script.",
      "customersLabel": "Trusted by",
      "testimonials": [
        {
          "company": "Hidrorey",
          "quote": "",
          "name": "",
          "role": ""
        }
      ],
      "integrationsLabel": "Works with",
      "integrations": [
        "Salesforce",
        "HubSpot",
        "SAP",
        "WhatsApp",
        "Email"
      ]
    },
    "closing": {
      "title": "Find your first revenue leak",
      "body": "In a free revenue review, we look at how your business finds and answers opportunities today and show you where sales are slipping away.",
      "cta": "See my revenue report"
    },
    "thanks": {
      "meta": {
        "title": "Booking confirmed | Anytrail",
        "description": "Your commercial process review is booked.",
        "ogLocale": "en_US"
      },
      "title": "Your review is booked.",
      "body": "Check your email for the calendar invite. Before we meet, we'll send an inquiry through your own inbound channels and time how long a reply takes, so we can show you exactly where opportunities are being lost today.",
      "manageSave": "Save this link in case the confirmation email does not arrive. It is the only way to cancel or move your call:",
      "back": "Back to home",
      "demoLead": "While you wait, run the agent on your own catalog.",
      "demoCta": "Try the live demo"
    },
    "schedule": {
      "meta": {
        "title": "Book a commercial process review | Anytrail",
        "description": "Book a 30 minute video call. We look at how your company finds and answers new opportunities today, and show you where sales are being lost.",
        "ogLocale": "en_US"
      },
      "title": "Review my commercial process",
      "intro": "Thirty minutes, by video. We look at how opportunities reach you today, how fast they get answered, and what happens to the ones nobody follows up on.",
      "bullets": [
        "Before the call we send an inquiry through your own channels and time the reply.",
        "You get the timings and the gaps, whether or not you buy anything.",
        "No slides. Bring the questions your sales team argues about."
      ],
      "pickDay": "Pick a day",
      "pickTime": "Pick a time",
      "yourZone": "Times shown in your timezone",
      "noSlots": "No open times that day. Try another one.",
      "form": {
        "name": "Your name",
        "email": "Work email",
        "website": "Company website",
        "note": "Anything we should know? (optional)"
      },
      "submit": "Book the call",
      "booking": "Booking...",
      "manageTitle": "Your booking",
      "cancel": "Cancel this call",
      "move": "Move to another time",
      "cancelled": "Your call is cancelled. You can book another any time.",
      "errors": {
        "invalid_website": "We couldn't use that website address. Check the URL and try again.",
        "invalid_input": "That didn't look right. Check the form and try again.",
        "slot_taken": "Someone just took that time. Pick another one.",
        "already_booked": "You already have a call booked. Use the link in your confirmation email to change it.",
        "rate_limited": "Too many attempts. Try again later.",
        "invalid_link": "That link is not valid. Check the one in your confirmation email.",
        "unknown_booking": "We could not find that booking. It may already be cancelled.",
        "generic": "Something went wrong. Try again."
      }
    },
    "footer": {
      "tagline": "Finds the revenue distributors and industrial companies are missing. © 2026 Anytrail",
      "linksLabel": "Reading",
      "privacyLabel": "Privacy policy"
    }
  },
  "es": {
    "meta": {
      "title": "Anytrail | Encuentra los Ingresos que tu Empresa Ya Está Perdiendo",
      "description": "Anytrail encuentra las ventas que distribuidores, mayoristas y empresas de equipo industrial están dejando ir. Trabaja sobre WhatsApp, correo, tu CRM y tu ERP para responder cada consulta, revivir cotizaciones atoradas, recuperar clientes anteriores y mostrarte lo que tus clientes piden y no tienes en inventario.",
      "ogLocale": "es_ES"
    },
    "navbar": {
      "cta": "Ver mi reporte"
    },
    "hero": {
      "clockLead": "Llevas en esta página",
      "clockTail": "La empresa promedio tarda 42 horas en responder una consulta.",
      "clockSource": "Harvard Business Review, 2011",
      "title": "Encuentra los ingresos que tu empresa ya está perdiendo.",
      "subtitle": "Cada cotización, chat y pedido guarda una pista de tu próxima venta. Anytrail vigila toda tu operación, en WhatsApp, correo, tu CRM y tu ERP, y saca a la luz las ventas que se están escapando: a qué clientes llamar, qué cotizaciones revivir y qué productos tener en inventario.",
      "cta": "Ver mi reporte de ingresos",
      "ctaNote": "Para distribuidores, mayoristas y empresas de equipo industrial. Funciona con Salesforce, HubSpot y SAP."
    },
    "benefits": {
      "label": "LO QUE RECUPERAS",
      "title": "Las ventas que tu equipo está demasiado ocupado para atender.",
      "items": [
        {
          "title": "Ningún lead perdido por responder tarde",
          "body": "Cada consulta por WhatsApp o correo se responde y califica de inmediato, a cualquier hora, antes de que el comprador se vaya con otro proveedor."
        },
        {
          "title": "Recupera clientes anteriores",
          "body": "Anytrail detecta los momentos de recompra, como equipo que ya toca reemplazar o una planta lista para crecer, y abre la conversación."
        },
        {
          "title": "Ninguna cotización olvidada",
          "body": "Registra cada cotización que envías y da seguimiento a las que se atoran, para que sepas exactamente qué tratos necesitan atención."
        },
        {
          "title": "Ten lo que tus clientes piden",
          "body": "Ve los productos que tus clientes siguen pidiendo y no manejas, y deja de rechazar pedidos."
        }
      ]
    },
    "audit": {
      "ariaLabel": "Revisión de ingresos de ejemplo para un distribuidor ficticio: consultas sin respuesta, cotizaciones detenidas, cuentas inactivas y pedidos de productos que no manejas, cada uno con un valor estimado.",
      "headerTitle": "Revisión de ingresos",
      "sample": "Ejemplo",
      "company": "Suministros Industriales Ejemplo",
      "period": "Últimos 90 días",
      "colFinding": "Hallazgo",
      "colValue": "Valor est.",
      "lines": [
        {
          "text": "14 consultas de WhatsApp sin respuesta después de 24 horas",
          "value": "$18,400",
          "recovered": "9 respondidas"
        },
        {
          "text": "6 cotizaciones enviadas sin seguimiento",
          "value": "$22,100",
          "recovered": "4 con seguimiento"
        },
        {
          "text": "23 clientes anteriores sin comprar en 18+ meses",
          "value": "$31,500"
        },
        {
          "text": "9 pedidos de productos que no manejas",
          "value": "$7,200"
        }
      ],
      "totalLabel": "Ingresos en riesgo",
      "total": "$79,200"
    },
    "problem": {
      "caught": "Lo atrapa Anytrail",
      "linePrefix": "L-",
      "label": "A DÓNDE SE VA EL DINERO",
      "title": "Tu empresa debería estar ganando más. Las fugas solo son difíciles de ver.",
      "intro": "Los ingresos casi nunca se pierden en un solo lugar. Se escapan entre sistemas: una consulta en WhatsApp que nadie contestó, una cotización en el correo que nadie persiguió, un cliente en el ERP al que nadie volvió a llamar.",
      "stats": [
        {
          "value": "7×",
          "body": "más probable calificar un lead si respondes en menos de una hora que si tardas más.",
          "source": "Harvard Business Review, 2011",
          "url": "https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
        },
        {
          "value": "42 h",
          "body": "tiempo promedio de respuesta en 2,241 empresas de EE. UU., y el 23% nunca respondió.",
          "source": "Harvard Business Review, 2011",
          "url": "https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
        },
        {
          "value": "5–25×",
          "body": "más caro conseguir un cliente nuevo que conservar uno que ya tienes.",
          "source": "Harvard Business Review, 2014",
          "url": "https://hbr.org/2014/10/the-value-of-keeping-the-right-customers"
        }
      ],
      "groups": [
        {
          "label": "Demanda que nunca encontraste",
          "leaks": [
            {
              "title": "Sin visibilidad de quién está en mercado",
              "body": "Todas las cuentas se ven iguales en el CRM, así que el equipo atiende al que más insiste en lugar del que realmente está listo para comprar."
            },
            {
              "title": "Tu propia cartera se enfría",
              "body": "Plantas que compraron hace dos años, líneas que crecieron, equipo que ya toca reemplazar. Nadie volvió a preguntar."
            }
          ]
        },
        {
          "label": "Demanda que respondiste demasiado tarde",
          "leaks": [
            {
              "title": "Respuesta lenta",
              "body": "Un comprador interesado escribe, espera, y le compra al primero que contesta."
            },
            {
              "title": "Información incompleta",
              "body": "Las cotizaciones se atoran porque nadie reunió la aplicación, la alimentación eléctrica o el uso antes de dar precio."
            },
            {
              "title": "Seguimiento olvidado",
              "body": "Un lead deja de contestar, el vendedor sigue con otra cosa, y la oportunidad muere sin decisión."
            }
          ]
        }
      ]
    },
    "how": {
      "stepLabel": "Paso",
      "label": "CÓMO FUNCIONA",
      "title": "Dos formas de que empiece una oportunidad. Una sola forma de trabajarla.",
      "intro": "Anytrail lleva tu proceso comercial, paso a paso, ya sea que la oportunidad haya llegado sola o que la hayas salido a buscar. Tu equipo mantiene el control de precios, recomendaciones técnicas, cotizaciones y la venta final.",
      "entriesLabel": "Cómo empieza la oportunidad",
      "entries": [
        {
          "title": "Anytrail la encuentra",
          "body": "Detecta cuentas que embonan con lo que vendes, tanto empresas nuevas en tu mercado como clientes que ya están en tu cartera y vale la pena retomar, y abre la conversación por WhatsApp, correo o LinkedIn."
        },
        {
          "title": "La oportunidad te encuentra",
          "body": "Llega una consulta por WhatsApp, un anuncio o tu sitio web. Anytrail responde de inmediato, a cualquier hora, en lugar de dejarla para el lunes."
        }
      ],
      "sharedLabel": "Después, el mismo camino, siempre",
      "steps": [
        {
          "title": "Diagnóstico",
          "body": "Hace las preguntas de calificación que usa tu equipo: aplicación, uso, condiciones del sitio."
        },
        {
          "title": "Recomendación",
          "body": "Ayuda a identificar el equipo adecuado de tu catálogo para esa aplicación."
        },
        {
          "title": "Preparación de cotización",
          "body": "Reúne los datos técnicos y comerciales que tu equipo necesita para cotizar."
        },
        {
          "title": "Seguimiento",
          "body": "Mantiene viva la conversación durante días o semanas, para que ninguna oportunidad se olvide."
        },
        {
          "title": "Entrega al equipo de ventas",
          "body": "Las oportunidades calificadas llegan a tus vendedores con todo el contexto, listas para cerrar."
        }
      ]
    },
    "different": {
      "usLabel": "Anytrail",
      "label": "POR QUÉ ES DIFERENTE",
      "title": "No es otro chatbot ni otro CRM. Es un auditor de ingresos que nunca se va a casa.",
      "intro": "Anytrail aprende lo que vendes, hace las preguntas de calificación de tu equipo y trabaja cada oportunidad dentro de un proceso de ventas real, en ambas direcciones. Sabe cuándo seguir la conversación y cuándo deben entrar tus vendedores.",
      "comparisons": [
        {
          "label": "Un chatbot",
          "body": "Contesta preguntas sueltas. No diagnostica la aplicación, no reúne datos para cotizar y no da seguimiento la próxima semana."
        },
        {
          "label": "Un CRM o base de contactos",
          "body": "Te vende registros y scores genéricos de intención, y organiza leads después de que alguien captura la información. No conoce tus productos ni avanza el trato."
        },
        {
          "label": "Una herramienta de prospección o secuencias",
          "body": "Manda el mensaje y ahí se queda. Cualquiera puede mandar el mensaje. Casi nadie puede contestar la respuesta cuando un jefe de planta pregunta qué modelo aguanta su ciclo de trabajo."
        },
        {
          "label": "Una agencia de leads",
          "body": "Te manda más consultas. No se encarga de lo que pasa después de que llegan, que es donde se pierden las ventas."
        }
      ]
    },
    "proof": {
      "label": "PRUEBA",
      "title": "Construido dentro de equipos de ventas reales. Ya está encontrando dinero.",
      "stat": "+$50,000 USD",
      "statLabel": "en valor encontrado para nuestros clientes el mes pasado.",
      "p2": "Anytrail se construyó dentro de un equipo de ventas industrial en operación, alrededor de cómo realmente se diagnostican, cotizan, se les da seguimiento y se venden los productos, no alrededor de un guion genérico de chatbot.",
      "customersLabel": "Confían en nosotros",
      "testimonials": [
        {
          "company": "Hidrorey",
          "quote": "",
          "name": "",
          "role": ""
        }
      ],
      "integrationsLabel": "Funciona con",
      "integrations": [
        "Salesforce",
        "HubSpot",
        "SAP",
        "WhatsApp",
        "Correo"
      ]
    },
    "closing": {
      "title": "Encuentra tu primera fuga de ingresos",
      "body": "En una revisión de ingresos gratuita, vemos cómo tu empresa encuentra y responde hoy a las oportunidades y te mostramos dónde se están escapando las ventas.",
      "cta": "Ver mi reporte de ingresos"
    },
    "thanks": {
      "meta": {
        "title": "Reunión confirmada | Anytrail",
        "description": "Tu revisión del proceso comercial está agendada.",
        "ogLocale": "es_ES"
      },
      "title": "Tu revisión está agendada.",
      "body": "Revisa tu correo para la invitación. Antes de la reunión, enviaremos una consulta por tus propios canales de ventas entrantes y mediremos cuánto tarda la respuesta, para mostrarte exactamente dónde se están perdiendo oportunidades hoy.",
      "manageSave": "Guarda este enlace por si el correo de confirmación no llega. Es la única forma de cancelar o mover tu llamada:",
      "back": "Volver al inicio",
      "demoLead": "Mientras tanto, prueba el agente con tu propio catálogo.",
      "demoCta": "Probar la demo"
    },
    "schedule": {
      "meta": {
        "title": "Agenda una revisión de tu proceso comercial | Anytrail",
        "description": "Agenda una videollamada de 30 minutos. Revisamos cómo tu empresa encuentra y responde nuevas oportunidades hoy, y dónde se están perdiendo ventas.",
        "ogLocale": "es_ES"
      },
      "title": "Revisa mi proceso comercial",
      "intro": "Treinta minutos, por video. Revisamos cómo te llegan las oportunidades hoy, qué tan rápido se responden, y qué pasa con las que nadie sigue.",
      "bullets": [
        "Antes de la llamada enviamos una consulta por tus propios canales y medimos cuánto tarda la respuesta.",
        "Te entregamos los tiempos y las fugas, compres algo o no.",
        "Sin presentaciones. Trae las preguntas que tu equipo comercial discute."
      ],
      "pickDay": "Elige un día",
      "pickTime": "Elige una hora",
      "yourZone": "Horarios en tu zona horaria",
      "noSlots": "No hay horarios disponibles ese día. Prueba con otro.",
      "form": {
        "name": "Tu nombre",
        "email": "Correo de trabajo",
        "website": "Sitio web de la empresa",
        "note": "¿Algo que debamos saber? (opcional)"
      },
      "submit": "Agendar la llamada",
      "booking": "Agendando...",
      "manageTitle": "Tu cita",
      "cancel": "Cancelar esta llamada",
      "move": "Mover a otro horario",
      "cancelled": "Tu llamada fue cancelada. Puedes agendar otra cuando quieras.",
      "errors": {
        "invalid_website": "No pudimos usar esa dirección web. Revisa la URL e inténtalo de nuevo.",
        "invalid_input": "Algo no se ve bien. Revisa el formulario e inténtalo de nuevo.",
        "slot_taken": "Alguien acaba de tomar ese horario. Elige otro.",
        "already_booked": "Ya tienes una llamada agendada. Usa el enlace de tu correo de confirmación para cambiarla.",
        "rate_limited": "Demasiados intentos. Inténtalo más tarde.",
        "invalid_link": "Ese enlace no es válido. Revisa el de tu correo de confirmación.",
        "unknown_booking": "No encontramos esa cita. Puede que ya esté cancelada.",
        "generic": "Algo salió mal. Inténtalo de nuevo."
      }
    },
    "footer": {
      "tagline": "Encuentra los ingresos que distribuidores y empresas industriales están dejando ir. © 2026 Anytrail",
      "linksLabel": "Lectura",
      "privacyLabel": "Aviso de privacidad"
    }
  }
}

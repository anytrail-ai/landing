// All landing-page copy in both languages. One object per section.
// `meta` feeds both the runtime <head> and the static prerender in prerender.js.
export const COPY = {
  en: {
    meta: {
      "title": "Anytrail | Keep Up with Every Customer AP Portal",
      "description": "For B2B accounts receivable teams juggling customer payment portals. Explore what we are building to track invoice rejections, payment terms, payment runs and follow-ups in one place. Book an early-access demo.",
      "ogLocale": "en_US"
    },
    navbar: {
      "cta": "Book a demo"
    },
    hero: {
      "title": "Stop chasing invoices across customer portals.",
      "subtitle": "One customer wants invoices uploaded. Another rejects a missing PO. A third only pays on Fridays. We’re building Anytrail to help B2B finance teams keep track of the work between sending an invoice and getting paid.",
      "cta": "Book an early-access demo",
      "ctaNote": "30-minute video call for accounts receivable, credit and finance teams. Bring the customer portals that take up your week.",
      "scope": "In early development. Help shape the workflow around your team’s real payment process."
    },
    benefits: {
      "label": "What we’re building",
      "title": "One place for the details that decide when you get paid.",
      "items": [
        {
          "title": "Know what needs attention",
          "body": "An invoice can be submitted, rejected, approved or waiting on the customer. We’re designing a shared view of status and the next action for each one."
        },
        {
          "title": "Keep payment terms separate from payment dates",
          "body": "Net 30 is one piece of the picture. Customer approval rules, payment runs and cutoffs also matter. Our goal is to keep that context alongside the invoice."
        },
        {
          "title": "Get rejections back into the queue",
          "body": "Missing purchase orders, mismatched amounts and incomplete documents create work. We want to make the reason, owner and follow-up easy to see."
        },
        {
          "title": "Keep customer requirements out of people’s heads",
          "body": "Document the portal, submission steps and payment contacts for each customer, so the next follow-up does not start from scratch."
        }
      ]
    },
    audit: {
      "ariaLabel": "Illustrative invoice follow-up worklist, not a live product screenshot. Four sample customer portal issues and their next actions.",
      "headerTitle": "Invoice follow-up",
      "sample": "Illustration",
      "company": "Example B2B supplier",
      "period": "Across customer portals",
      "colFinding": "What needs attention",
      "colValue": "Next step",
      "lines": [
        {
          "text": "Customer A: invoice rejected for missing PO",
          "value": "Confirm PO"
        },
        {
          "text": "Customer B: Net 60, approval still pending",
          "value": "Check approval"
        },
        {
          "text": "Customer C: approved, Friday payment run",
          "value": "Confirm cutoff"
        },
        {
          "text": "Customer D: invoice past expected payment date",
          "value": "Follow up"
        }
      ],
      "totalLabel": "Illustrative workflow",
      "total": "4 next actions"
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
      "linePrefix": "",
      "label": "The work behind getting paid",
      "title": "Every customer has a process. Your team has to remember all of them.",
      "intro": "As invoice volume grows, checking another portal becomes a daily job. The hard part is knowing what changed, what is stuck and who needs to act.",
      "stats": [],
      "groups": [
        {
          "label": "Before payment is approved",
          "leaks": [
            {
              "title": "Submitted does not mean accepted",
              "body": "A missing PO or attachment can send an invoice back. The rejection needs an owner before the clock keeps running."
            },
            {
              "title": "Each portal has its own rules",
              "body": "Different upload formats, approval steps and supporting documents make the same invoice a different job at every customer."
            }
          ]
        },
        {
          "label": "After the invoice is accepted",
          "leaks": [
            {
              "title": "Terms are not the whole payment story",
              "body": "An invoice’s due date and the customer’s next payment run may be different dates. Your cash forecast needs both."
            },
            {
              "title": "Follow-ups get scattered",
              "body": "Portal notes, emails and spreadsheets tell parts of the story. Someone still has to put them together before contacting the customer."
            }
          ]
        }
      ]
    },
    how: {
      "stepLabel": "Step",
      "label": "Your early-access demo",
      "title": "Bring your portal headaches. Let’s work through them.",
      "intro": "Anytrail is in early development. This is a focused conversation about your workflow, what we are building and whether it could fit your team.",
      "entriesLabel": "Who this is for",
      "entries": [
        {
          "title": "Accounts receivable and credit teams",
          "body": "You handle invoice submissions, rejection fixes and payment follow-ups across several customer portals."
        },
        {
          "title": "Finance leaders at B2B suppliers",
          "body": "You need a clearer view of expected cash and the operational work behind the receivables balance."
        }
      ],
      "sharedLabel": "What we’ll cover in 30 minutes",
      "steps": [
        {
          "title": "Map your customer portals",
          "body": "Walk us through the portals, invoice volume and payment processes your team manages today."
        },
        {
          "title": "Find the recurring blockers",
          "body": "Pick one rejection or delayed payment and trace the missing information, handoffs and follow-ups."
        },
        {
          "title": "Review the product direction",
          "body": "See the workflow we are designing, discuss your must-haves and decide whether to continue into early access."
        }
      ]
    },
    different: {
      "usLabel": "Anytrail’s direction",
      "label": "Where it fits",
      "title": "Built around your customers’ payment processes.",
      "intro": "We’re building a shared working view of customer portal requirements, invoice issues and payment follow-ups for the supplier’s finance team. Portal coverage and implementation requirements will be discussed in the demo.",
      "comparisons": [
        {
          "label": "Your accounting system",
          "body": "The receivables ledger is the starting point. The work in customer portals adds approval status, rejection reasons and payment-process details."
        },
        {
          "label": "Your customers’ AP portals",
          "body": "Each portal shows one customer’s process. Your team needs to follow work across all of them."
        },
        {
          "label": "Your spreadsheets and inbox",
          "body": "They hold useful context, but keeping that context current depends on someone checking and updating it."
        }
      ]
    },
    proof: {
      label: 'PROOF',
      title: 'Built inside real sales teams. Already finding money.',
      stat: '+$50,000 USD',
      statLabel: 'in value found for our customers last month.',
      p2:
        'Anytrail was built inside a working industrial sales team, around the way products are actually diagnosed, quoted, followed up, and sold, not around a generic chatbot script.',
      customersLabel: 'Trusted by',
      // A testimonial renders only once its quote is filled in, so an empty
      // slot never ships as a blank card.
      testimonials: [
        { company: 'Hidrorey', quote: '', name: '', role: '' },
        { company: 'Toshiba', quote: '', name: '', role: '' },
      ],
      integrationsLabel: 'Works with',
      integrations: ['Salesforce', 'HubSpot', 'SAP', 'WhatsApp', 'Email'],
    },
    closing: {
      "title": "Which customer portal takes up the most of your week?",
      "body": "Show us where invoices get stuck. We’ll walk through what we’re building and see whether Anytrail could help your team.",
      "cta": "Book an early-access demo"
    },
    whatsapp: {
      cta: 'Or text us on WhatsApp',
      prefill: "Hi, I'd like to find the sales we're missing.",
    },
    privacy: {
      meta: {
        title: 'Privacy Policy | Anytrail',
        description:
          'What personal data Anytrail collects through its website, ads and messaging channels, what it is used for, who processes it, and how to request access or deletion.',
        ogLocale: 'en_US',
      },
      title: 'Privacy Policy',
      updated: 'Last updated: October 16, 2026',
      intro:
        'Anytrail builds AI sales agents for industrial companies and distributors. This policy covers the personal data we handle when you visit this site, fill in one of our forms, reach us through an ad, or message us. It does not cover the data our customers load into their own Anytrail accounts, which they control.',
      contactHeading: 'Who is responsible',
      contactBody: 'Anytrail. Contact:',
      contactEmail: 'root@anytrail.ai',
      sections: [
        {
          heading: 'What we collect',
          paragraphs: [
            'What you send us. When you book a review, request a demo or fill in any form on this site, we keep what you type: usually your name, work email, phone number, company, and what you told us about your sales process.',
            'Lead forms on Facebook and Instagram. If you reach us through a Meta lead form, Meta sends us the fields you submitted: your name, email, phone number, and your answers to the questions on the form. Meta handles that form under its own data policy, which you see before you submit.',
            'WhatsApp and email. If you message us, we keep your number or address and the conversation so we can follow it up.',
            'How you use this site. We record page views and clicks ourselves: which page, your language, the referring site, any campaign tags in the link, your window size, and where on the page you clicked. A random id in your browser tab groups one visit together and disappears when the tab closes. It is never linked to your name unless you fill in a form.',
            'Google Analytics and the Meta Pixel. The site also loads these two third-party tags. Google Analytics gives us aggregate traffic statistics. The Meta Pixel tells Meta when someone visits this site or books a review, so we can measure our Facebook and Instagram ads and stop showing them to people who are not interested. Each sets a cookie in your browser (Google: _ga, Meta: _fbp) and receives your IP address, browser details and the pages you view; Meta may link that activity to your Meta account under its own data policy. Browser tracking protection or an ad blocker stops both, and the site works the same without them.',
          ],
        },
        {
          heading: 'What we use it for',
          paragraphs: [
            'To answer you: book the review, run the demo, send what you asked for, and follow up on that specific request by email, phone or WhatsApp. If you would rather we stopped, reply saying so or write to root@anytrail.ai and we will.',
            'To understand which pages and campaigns bring people who go on to talk to us, so we spend less on the ones that do not.',
          ],
        },
        {
          heading: 'What we never do',
          paragraphs: [
            'We do not sell your data, and we do not share it with third parties for their own marketing.',
            'We do not use your contact details or your messages to train models.',
            'Apart from Google Analytics and the Meta Pixel described above, this site sets no cookies and loads no advertising or analytics scripts from other companies.',
          ],
        },
        {
          heading: 'Who processes it on our behalf',
          paragraphs: [
            'Our infrastructure runs on Amazon Web Services in the US East region (us-east-1); that is where form submissions, conversations and site telemetry are stored. Meta processes lead forms and WhatsApp messages when you reach us through those channels, and receives the Meta Pixel signals described above. Google receives the Google Analytics signals. Our email provider carries the email we exchange with you. Each of them acts under our instructions and its own privacy commitments.',
          ],
        },
        {
          heading: 'How long we keep it',
          paragraphs: [
            'We keep your request and the conversation around it for as long as we need to handle it and follow up, and we delete it when you ask. Site usage data is kept in aggregate and is not tied to you.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You can ask us what we hold about you, correct it, have it deleted, or tell us to stop contacting you, by writing to root@anytrail.ai. If you are in Mexico this includes your rights of access, rectification, cancellation and opposition under the federal data protection law. We answer within the time the applicable law requires.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'When this policy changes, the date at the top changes with it. Material changes will also be noted on this page for a period after they take effect.',
          ],
        },
      ],
      related: {
        text: 'The Anytrail Copilot Chrome extension has its own notice:',
        href: '/privacy/copilot',
        label: 'Anytrail Copilot privacy policy',
      },
    },
    privacyCopilot: {
      meta: {
        title: 'Anytrail Copilot Privacy Policy | Anytrail',
        description:
          'What data the Anytrail Copilot Chrome extension handles, what it never does with it, and how to request access or deletion.',
        ogLocale: 'en_US',
      },
      title: 'Anytrail Copilot — Privacy Policy',
      updated: 'Last updated: August 15, 2026',
      intro:
        'Anytrail Copilot is a Chrome extension for sales teams that use Anytrail. This policy explains what data it handles, what it is used for, and what it never does.',
      contactHeading: 'Who is responsible',
      contactBody: 'Anytrail. Contact:',
      contactEmail: 'root@anytrail.ai',
      sections: [
        {
          heading: 'What the extension handles',
          paragraphs: [
            'Your Anytrail account. When you sign in, your email and password are sent once to our server to authenticate you. Your password is never stored, neither in your browser nor on our servers: only the session tokens produced by that sign-in are kept, in your browser local storage.',
            'Your outreach activity. The extension records in your Anytrail account the actions you take on the contacts in your campaign: invitation sent, message sent, invitation accepted, reply received, or contact removed with its reason. These records include your email, so your company knows who followed up with each contact.',
            'What it reads from LinkedIn. Using your own LinkedIn session, the extension reads your recent messages and notifications and your connections list, for two purposes only: knowing who replied to you, and knowing who accepted your invitation. This reading happens in your browser. The content of your messages is never sent to our servers; only the fact that a reply or a connection happened, with its date.',
            'Contacts in your campaign. The names, job titles and profiles you see in the extension come from the campaigns your own company loaded into Anytrail.',
          ],
        },
        {
          heading: 'What it never does',
          paragraphs: [
            'It never sends anything for you. You send every invitation and every message yourself, from LinkedIn. The extension prepares the text and records what happened.',
            'It does not sell or share your data with third parties, and does not use it for advertising.',
            'It does not read your browsing outside linkedin.com.',
            'It does not store your passwords, for Anytrail or for LinkedIn.',
            'It does not use your data to train models.',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'The extension reads a single linkedin.com cookie (JSESSIONID) because LinkedIn requires its value as a security token on its own requests. That value is never stored or transmitted anywhere.',
          ],
        },
        {
          heading: 'Where data is stored and for how long',
          paragraphs: [
            'In your browser local storage (session, tasks and the day counters), and in Anytrail infrastructure on Amazon Web Services, US East region (us-east-1).',
            'The local session is cleared when you sign out or uninstall the extension. Outreach activity history is kept in your company account while the campaign is active, and deleted when your company requests it.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You can request access to, correction of, or deletion of your data by writing to root@anytrail.ai. If your account belongs to your company, we will coordinate the request with whoever administers it.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'Any change to this policy will be published at this same address, with the updated date at the top.',
          ],
        },
      ],
    },
    thanks: {
      meta: {
        title: 'Booking confirmed | Anytrail',
        description: 'Your Anytrail early-access demo is booked.',
        ogLocale: 'en_US',
      },
      title: 'Your demo is booked.',
      body: "Check your email for the calendar invite. Bring the names of your customer portals and one example of a rejection or delayed payment. No portal credentials or customer documents needed.",
      manageSave: 'Save this link in case the confirmation email does not arrive. It is the only way to cancel or move your call:',
      back: 'Back to home',
      demoLead: 'Follow our progress while you wait.',
      demoCta: 'Anytrail on LinkedIn',
    },
    demo: {
      meta: {
        title: 'Live Demo | Anytrail',
        description:
          'Talk to a live AI sales agent on WhatsApp. Leave your name, phone number and email, then watch it handle a real inquiry like a customer would send.',
        ogLocale: 'en_US',
      },
      hero: {
        title: 'Watch the agent sell. On WhatsApp, right now.',
        sub: 'Leave your name, phone number and email, then open WhatsApp and talk to the agent like a customer would.',
      },
      form: {
        name: 'Your name',
        namePlaceholder: 'Ana García',
        phone: 'Phone number',
        phonePlaceholder: '+52 81 1234 5678',
        phoneHint: 'Include the country code.',
        email: 'Email',
        emailPlaceholder: 'ana@company.com',
        submit: 'Continue to WhatsApp',
        saving: 'Saving…',
      },
      done: {
        title: 'Thanks, {name}.',
        body: 'Tap below to open WhatsApp. The first message is already written for you; send it and the agent takes it from there.',
        cta: 'Open WhatsApp',
        messageLabel: 'Your first message:',
      },
      errors: {
        invalid_phone: 'That phone number does not look right. Include the country code, like +52 81 1234 5678.',
        invalid_email: 'That email does not look right. Check it and try again.',
        invalid_input: 'Please fill in your name, phone number and email.',
        generic: 'Something went wrong. Please try again.',
      },
    },
    inboundDemo: {
      meta: {
        title: 'Inbound Agent Demo | Anytrail',
        description:
          'See an AI sales agent built on your own website in one minute. It learns your products and sells them back to you, plus your ideal customer profile and 5 matching leads.',
        ogLocale: 'en_US',
      },
    },
    schedule: {
      meta: {
        title: 'Book an early-access demo | Anytrail',
        description:
          'Book a 30-minute video call about managing invoice rejections, payment terms and follow-ups across customer AP portals.',
        ogLocale: 'en_US',
      },
      title: 'Let’s talk about your customer portals',
      intro:
        'Thirty minutes, by video. Walk us through your customer payment portals and see the direction we’re building for accounts receivable teams.',
      bullets: [
        'Map your portals, invoice volume and the work your team repeats each week.',
        'Review a rejection or delayed payment and the follow-up it needs.',
        'Discuss the early-access product direction, portal coverage and whether there is a fit.',
      ],
      pickDay: 'Pick a day',
      pickTime: 'Pick a time',
      yourZone: 'Times shown in your timezone',
      noSlots: 'No open times that day. Try another one.',
      form: { name: 'Your name', email: 'Work email', website: 'Company website', note: 'Which customer portals do you manage? (optional)' },
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
        { page: 'rfqAutomation', label: 'RFQ automation, and the RFQs that arrive incomplete' },
        { page: 'manufacturingCrm', label: 'Manufacturing CRM: what it fixes, and what it does not' },
        { page: 'home', label: 'How Anytrail works, inbound and outbound' },
        { page: 'schedule', label: 'Book a commercial process review' },
      ],
      closing: {
        title: 'Find out what your own response time actually is.',
        body: 'Before the call we send a real inquiry through your own inbound channels and time how long a useful reply takes. You get the timings either way, whether or not you buy anything.',
        cta: 'Review my commercial process',
      },
    },
    // The search term names a category we are deliberately not. The page says
    // so rather than pretending to be a CRM to catch the traffic.
    manufacturingCrm: {
      meta: {
        title: 'Manufacturing CRM: What It Fixes, and What It Does Not | Anytrail',
        description:
          'A CRM records what happened. In manufacturing, the expensive problem is what never got recorded. Why generic CRMs struggle here, and what to ask before you replace yours.',
        ogLocale: 'en_US',
      },
      h1: 'Manufacturing CRM: what it fixes, and what it does not.',
      navLabel: 'What a manufacturing CRM fixes',
      lede: [
        'If you are looking for a manufacturing CRM, something is usually already wrong. The forecast does not match reality, nobody trusts the pipeline, or the deals that closed were never in the system until the week they closed.',
        'Before replacing the tool, it is worth separating two problems that look identical from the outside. One of them a CRM fixes. The other one it cannot, and buying a better CRM will not touch it.',
      ],
      sections: [
        {
          label: 'START HERE',
          title: 'A CRM is a system of record. That is the whole job.',
          paras: [
            'A CRM stores what happened and reports on it. Who the account is, which stage the deal is in, what was agreed, what closed. Done well that is genuinely valuable, and a manufacturer running on spreadsheets and inbox memory should absolutely fix it.',
            'But a system of record is downstream of the record existing. It organizes information after a human has entered it. Every CRM ever built shares this property, and it is the reason a CRM project can finish successfully and change nothing about revenue.',
            'So the question worth asking is not which CRM. It is whether your problem lives before or after the data entry step.',
          ],
        },
        {
          title: 'Where generic CRMs actually struggle in manufacturing.',
          paras: [
            'Most CRMs were designed around a software or services sale: one buyer, one contract, a stage that advances in one direction. Manufacturing violates several of those assumptions at once, which is why the tool tends to feel like it is fighting you.',
          ],
          pointsLabel: 'The structural mismatches',
          points: [
            {
              title: 'The unit of work is a quote, not an opportunity',
              body: 'One inquiry can produce four quotes across two years as the spec changes. CRMs model that as one opportunity you keep editing, or four you keep deduplicating. Neither matches what your team is actually doing.',
            },
            {
              title: 'The buyer is often not your contact',
              body: 'Sell through distributors or reps and the person specifying the equipment is a company away. The CRM has a contact record for someone who does not make the decision.',
            },
            {
              title: 'The installed base is the pipeline',
              body: 'A pump sold six years ago is a replacement due now. That is a real, forecastable opportunity, and almost no CRM models it as anything other than a closed deal in the past.',
            },
            {
              title: 'The spec does not fit in fields',
              body: 'Duty cycle, residue, site conditions, power supply. It arrives as a photo of a nameplate in a WhatsApp thread, and it ends up in an attachment nobody can query.',
            },
          ],
        },
        {
          title: 'Your CRM data problem is not a discipline problem.',
          paras: [
            'The standard diagnosis is that salespeople do not update the CRM, and the standard remedy is a policy, a dashboard, or a manager asking on Fridays. This rarely works for long, and it is worth being honest about why.',
            'Entering data is unpaid work with a delayed, indirect payoff for the person doing it. A salesperson who just spent forty minutes on the phone establishing that the customer needs three phase power and cannot take delivery until the shutdown has every incentive to move to the next call, because the deal does not advance by typing it up. It advances by quoting.',
            'So the record stays thin, the reports are built on the thin record, and the forecast is a work of fiction that everybody agrees to treat as data. Adding required fields makes it worse: people fill them with whatever passes validation.',
            'This is the part no CRM can fix, because the fix has to happen before the data entry step, in the conversation itself.',
          ],
        },
        {
          title: 'What to ask before you replace the CRM.',
          paras: [
            'If the tool genuinely is the problem, replacing it is correct. These are the questions that separate the two cases.',
          ],
          points: [
            {
              title: 'Which deals are missing, not which fields',
              body: 'Pull ten deals that closed last quarter. How many existed in the CRM more than a month before they closed? If most appeared late, the system is a ledger, not a pipeline, and a new ledger will behave the same.',
            },
            {
              title: 'Where the technical detail lives today',
              body: 'If the answer is email, WhatsApp, and a salesperson’s memory, then migrating to a new CRM moves the empty fields, not the information.',
            },
            {
              title: 'Who is expected to type',
              body: 'Any plan whose success depends on busy salespeople entering more than they do now is a plan that has already been tried at your company.',
            },
            {
              title: 'What happens to an inquiry at 9pm',
              body: 'Not a CRM question at all, which is rather the point. It is usually the more expensive problem.',
            },
          ],
        },
        {
          label: 'WHERE WE FIT',
          title: 'Anytrail is not a CRM, and it does not want to be your record.',
          paras: [
            'We are the four things listed above, from the other side. Anytrail works the demand rather than filing it: it answers inbound inquiries the moment they land, opens conversations with accounts that match what you sell, runs the diagnostic questions your team would ask, and follows up over weeks.',
            'Because it is in the conversation, the technical detail is captured as it is established rather than reconstructed afterwards. The application, the duty cycle, the power supply and the site constraints arrive with the opportunity, structured, without anyone typing them up. What your CRM records improves as a side effect of the work getting done, which is the only version of that problem that stays fixed.',
            'Keep your CRM. It is the system of record, and you need one. Anytrail sits in front of it.',
          ],
        },
      ],
      limits: {
        title: 'What this does not do.',
        items: [
          'It is not a CRM and does not replace one. No pipeline reporting, no forecasting, no system of record.',
          'We do not migrate your existing CRM data, and we make no claims about integrations with any specific CRM on this page.',
          'It does not set prices or issue quotes. Your team keeps pricing, the technical recommendation, and the sale.',
          'We publish no benchmark figures on CRM adoption, data quality, or win rates. We have not measured them ourselves.',
        ],
      },
      relatedLabel: 'Keep reading',
      related: [
        { page: 'speedToLead', label: 'Speed to lead in industrial equipment sales' },
        { page: 'rfqAutomation', label: 'RFQ automation, and the RFQs that arrive incomplete' },
        { page: 'home', label: 'How Anytrail works, inbound and outbound' },
        { page: 'schedule', label: 'Book a commercial process review' },
      ],
      closing: {
        title: 'Find out which of the two problems you have.',
        body: 'Thirty minutes. We look at how opportunities reach you, what gets recorded, and what never makes it into the system at all. You get the findings whether or not you buy anything.',
        cta: 'Review my commercial process',
      },
    },
    // Closest match of the three cluster terms to what the product actually
    // does. The boundary to hold: Anytrail prepares quotes, it never issues.
    rfqAutomation: {
      meta: {
        title: 'RFQ Automation for Industrial Equipment | Anytrail',
        description:
          'Most RFQ automation assumes a complete RFQ arrives. In industrial equipment it usually does not. What to automate when the request is missing the details you need to price it.',
        ogLocale: 'en_US',
      },
      h1: 'RFQ automation for industrial equipment.',
      navLabel: 'RFQ automation for equipment',
      lede: [
        'RFQ automation usually means software that moves a request for quote through your process faster: routing it, templating the response, tracking where it sits.',
        'All of that assumes the RFQ arrived complete. In industrial equipment it usually did not, and the time you lose is spent getting to a quotable specification, not producing the document once you have one.',
      ],
      sections: [
        {
          label: 'TWO DIFFERENT THINGS',
          title: 'Buyer-side and supplier-side automation are not the same product.',
          paras: [
            'The term covers two markets that have very little to do with each other. On the buyer side, procurement teams automate sending RFQs out to a vendor list and normalizing what comes back. That software is bought by the person purchasing, and it is a genuinely different problem.',
            'On the supplier side, which is where you are if you sell equipment, automation means what happens to a request when it arrives. Most of the tooling here was built for the case where a complete, structured RFQ lands from a portal: line items, quantities, specifications, a deadline. If that describes your inbound, the standard tools work.',
            'For most equipment manufacturers and distributors it does not. The request arrives as three sentences on WhatsApp.',
          ],
        },
        {
          title: 'The incomplete RFQ is the normal case, not the exception.',
          paras: [
            '"Can you quote me on a pump" is a real RFQ, and it is unquotable as written. Before anyone can price it, someone has to establish a list of things the sender did not think to include, usually because they did not know they mattered.',
          ],
          pointsLabel: 'What is typically missing',
          points: [
            {
              title: 'The application',
              body: 'What the equipment is for, which determines everything downstream. What is being moved, cleaned, cut, or lifted, and in what condition.',
            },
            {
              title: 'Duty cycle',
              body: 'Two hours a week and sixteen hours a day are different machines at different prices. Nobody volunteers this number.',
            },
            {
              title: 'Site conditions and power',
              body: 'Three phase availability, ambient conditions, drainage, access for installation. Any one of these can eliminate the model you were about to quote.',
            },
            {
              title: 'Who is actually asking',
              body: 'A maintenance manager replacing a failed unit and a project engineer specifying for a new line need different responses, on different timelines, at different prices.',
            },
          ],
        },
        {
          title: 'A longer form does not solve this, and it costs you submissions.',
          paras: [
            'The obvious fix is to ask for everything up front: a detailed quote request form with the fields your team needs. Every equipment company tries this. Two things go wrong.',
            'The first is that a form is flat and diagnosis is conditional. Whether the power supply question matters depends on the answer to the application question. Whether you need drainage details depends on what is being washed. A form cannot branch on an answer it has not received yet, so it either asks everyone everything, which is long enough that people abandon it, or it asks the safe generic subset, which is exactly the incomplete RFQ you started with.',
            'The second is that the buyer often cannot answer the questions in the form. They know the pump is leaking. They do not know the head or the flow rate, and a required field asking for it does not create the knowledge. A person would work around this by asking what the pump is doing and inferring the rest. A form cannot.',
            'This is why the round trips happen, and each one costs a day.',
          ],
        },
        {
          title: 'What is actually worth automating.',
          paras: [
            'Ranked roughly by how much time each recovers in an equipment business.',
          ],
          points: [
            {
              title: 'Conditional intake',
              body: 'Asking the next question based on the last answer, the way a salesperson would, instead of presenting a fixed field list. This is the step that eliminates round trips rather than shortening them.',
            },
            {
              title: 'A completeness check before handoff',
              body: 'Nothing reaches a salesperson until the answers needed to price it are present. The expensive failure is a quote request that sits in someone’s queue for two days before anyone notices it is unquotable.',
            },
            {
              title: 'Catalog matching',
              body: 'Narrowing to the models that fit the application and the site constraints, so the person quoting starts from a shortlist rather than the full catalog.',
            },
            {
              title: 'Follow-up on stalled requests',
              body: 'RFQs go quiet constantly, and the second and third touch are where equipment deals close. This is pure recovered revenue and it is almost never automated.',
            },
          ],
        },
        {
          label: 'WHAT WE DO',
          title: 'Anytrail gets the RFQ to quotable. Your team quotes it.',
          paras: [
            'Anytrail answers the request when it arrives, on WhatsApp, from an ad, or from your website, and works it the way your own team would: what the application is, how hard the machine will run, what the site can support. It asks the next question based on the last answer, so a buyer who does not know the flow rate still ends up somewhere quotable.',
            'When the picture is complete it matches the application against your catalog and hands the request to a salesperson with the answers already collected. Requests that go quiet get followed up over the following days and weeks without anyone having to remember.',
            'It stops there, deliberately. Anytrail prepares the quote; it does not issue one. Pricing, the technical recommendation, and the final document stay with your team. An agent that quotes autonomously is an agent that will eventually commit you to a price or a lead time you cannot honor.',
          ],
        },
      ],
      limits: {
        title: 'What this does not do.',
        items: [
          'It does not issue quotes, set prices, or commit to lead times. It collects what a quote needs and hands that to a person.',
          'It is not a procurement or eProcurement tool. If you are the buyer sending RFQs out, this is the wrong side of the market.',
          'We make no claims on this page about integrations with any specific ERP, quoting system, or supplier portal.',
          'We publish no figures on RFQ volumes, cycle times, or win rates. We have not measured them ourselves.',
        ],
      },
      relatedLabel: 'Keep reading',
      related: [
        { page: 'speedToLead', label: 'Speed to lead in industrial equipment sales' },
        { page: 'manufacturingCrm', label: 'Manufacturing CRM: what it fixes, and what it does not' },
        { page: 'home', label: 'How Anytrail works, inbound and outbound' },
        { page: 'schedule', label: 'Book a commercial process review' },
      ],
      closing: {
        title: 'See how many round trips your RFQs actually take.',
        body: 'Before the call we send a real request through your own channels and count the exchanges it takes to reach something quotable. You get the findings whether or not you buy anything.',
        cta: 'Review my commercial process',
      },
    },
    footer: {
      "tagline": "Building a clearer way to manage customer payment portals. © 2026 Anytrail",
      "linksLabel": "Reading",
      "privacyLabel": "Privacy policy"
    },
  },

  es: {
    meta: {
      "title": "Anytrail | Tus Portales de Cobro, Bajo Control",
      "description": "Para equipos de cuentas por cobrar B2B que trabajan en múltiples portales de clientes. Estamos construyendo una forma de dar seguimiento a rechazos, plazos, días de pago y pendientes. Agenda una demo de acceso anticipado.",
      "ogLocale": "es_ES"
    },
    navbar: {
      "cta": "Agendar demo"
    },
    hero: {
      "title": "Deja de perseguir facturas entre portales de clientes.",
      "subtitle": "Un cliente pide cargar la factura. Otro la rechaza porque falta la orden de compra. Un tercero solo paga los viernes. Estamos construyendo Anytrail para que los equipos de finanzas B2B sigan el trabajo entre enviar una factura y cobrarla.",
      "cta": "Agendar demo de acceso anticipado",
      "ctaNote": "Videollamada de 30 minutos para equipos de cuentas por cobrar, crédito y finanzas. Trae los portales que ocupan tu semana.",
      "scope": "En desarrollo inicial. Ayúdanos a diseñar el flujo con el proceso de cobro real de tu equipo."
    },
    benefits: {
      "label": "Lo que estamos construyendo",
      "title": "Un lugar para los detalles que definen cuándo cobras.",
      "items": [
        {
          "title": "Saber qué necesita atención",
          "body": "Una factura puede estar enviada, rechazada, aprobada o esperando al cliente. Estamos diseñando una vista compartida del estado y la siguiente acción de cada una."
        },
        {
          "title": "Distinguir el plazo de la fecha de pago",
          "body": "El crédito a 30 días es solo una parte. También importan las aprobaciones, los días de pago y las fechas de corte del cliente. Queremos reunir ese contexto junto a la factura."
        },
        {
          "title": "Dar seguimiento a cada rechazo",
          "body": "Las órdenes de compra faltantes, diferencias de importes y documentos incompletos generan trabajo. Queremos que el motivo, el responsable y el siguiente paso sean claros."
        },
        {
          "title": "Documentar los requisitos de cada cliente",
          "body": "Reúne el portal, los pasos de entrega y los contactos de pago de cada cliente para que el siguiente seguimiento no empiece desde cero."
        }
      ]
    },
    audit: {
      "ariaLabel": "Ejemplo ilustrativo de seguimiento de facturas, no es una captura de un producto en operación. Cuatro pendientes en portales de clientes y su siguiente acción.",
      "headerTitle": "Seguimiento de facturas",
      "sample": "Ilustración",
      "company": "Proveedor B2B de ejemplo",
      "period": "Portales de clientes",
      "colFinding": "Pendiente",
      "colValue": "Siguiente paso",
      "lines": [
        {
          "text": "Cliente A: rechazo por falta de orden de compra",
          "value": "Confirmar OC"
        },
        {
          "text": "Cliente B: crédito a 60 días, sin aprobar",
          "value": "Revisar aprobación"
        },
        {
          "text": "Cliente C: aprobada, paga los viernes",
          "value": "Confirmar corte"
        },
        {
          "text": "Cliente D: pasó la fecha esperada de pago",
          "value": "Dar seguimiento"
        }
      ],
      "totalLabel": "Flujo ilustrativo",
      "total": "4 pendientes"
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
      "linePrefix": "",
      "label": "El trabajo detrás del cobro",
      "title": "Cada cliente tiene su proceso. Tu equipo debe recordar todos.",
      "intro": "Cuando crece el volumen de facturas, revisar otro portal se vuelve una tarea diaria. Lo difícil es saber qué cambió, qué está detenido y quién debe actuar.",
      "stats": [],
      "groups": [
        {
          "label": "Antes de que aprueben el pago",
          "leaks": [
            {
              "title": "Enviada no significa aceptada",
              "body": "Una orden de compra o un anexo faltante puede causar un rechazo. Alguien debe atenderlo mientras siguen pasando los días."
            },
            {
              "title": "Cada portal tiene sus reglas",
              "body": "Distintos formatos, aprobaciones y documentos de soporte convierten la misma factura en un trabajo diferente con cada cliente."
            }
          ]
        },
        {
          "label": "Después de aceptar la factura",
          "leaks": [
            {
              "title": "El plazo no cuenta toda la historia",
              "body": "El vencimiento y el próximo día de pago del cliente pueden ser fechas distintas. Tu pronóstico de caja necesita ambas."
            },
            {
              "title": "El seguimiento queda disperso",
              "body": "Las notas del portal, el correo y las hojas de cálculo cuentan partes de la historia. Alguien tiene que unirlas antes de contactar al cliente."
            }
          ]
        }
      ]
    },
    how: {
      "stepLabel": "Paso",
      "label": "Tu demo de acceso anticipado",
      "title": "Trae los portales que te complican el cobro. Revisémoslos juntos.",
      "intro": "Anytrail está en desarrollo inicial. La llamada se centra en tu proceso, lo que estamos construyendo y si podría encajar con tu equipo.",
      "entriesLabel": "Para quién es",
      "entries": [
        {
          "title": "Equipos de cuentas por cobrar y crédito",
          "body": "Gestionas la entrega de facturas, la corrección de rechazos y el seguimiento de pagos en varios portales de clientes."
        },
        {
          "title": "Líderes de finanzas en proveedores B2B",
          "body": "Necesitas entender el efectivo esperado y el trabajo operativo que hay detrás del saldo por cobrar."
        }
      ],
      "sharedLabel": "Lo que veremos en 30 minutos",
      "steps": [
        {
          "title": "Mapear tus portales",
          "body": "Cuéntanos qué portales, volumen de facturas y procesos de pago maneja hoy tu equipo."
        },
        {
          "title": "Identificar los bloqueos recurrentes",
          "body": "Elige un rechazo o un pago atrasado y revisemos la información faltante, los responsables y el seguimiento."
        },
        {
          "title": "Revisar la dirección del producto",
          "body": "Conoce el flujo que estamos diseñando, comparte lo indispensable para tu equipo y decide si seguimos hacia el acceso anticipado."
        }
      ]
    },
    different: {
      "usLabel": "La dirección de Anytrail",
      "label": "Dónde encaja",
      "title": "Diseñado alrededor de los procesos de pago de tus clientes.",
      "intro": "Estamos construyendo una vista compartida de requisitos de portales, problemas de facturas y seguimiento de pagos para el equipo de finanzas del proveedor. En la demo hablaremos de la cobertura de portales y los requisitos de implementación.",
      "comparisons": [
        {
          "label": "Tu sistema contable",
          "body": "La cartera por cobrar es el punto de partida. El trabajo en portales agrega estados de aprobación, motivos de rechazo y detalles del proceso de pago."
        },
        {
          "label": "Los portales de tus clientes",
          "body": "Cada portal muestra el proceso de un cliente. Tu equipo necesita dar seguimiento al trabajo en todos."
        },
        {
          "label": "Tus hojas de cálculo y correo",
          "body": "Guardan contexto útil, pero mantenerlo al día depende de que alguien lo revise y lo actualice."
        }
      ]
    },
    proof: {
      label: 'PRUEBA',
      title: 'Construido dentro de equipos de ventas reales. Ya está encontrando dinero.',
      stat: '+$50,000 USD',
      statLabel: 'en valor encontrado para nuestros clientes el mes pasado.',
      p2:
        'Anytrail se construyó dentro de un equipo de ventas industrial en operación, alrededor de cómo realmente se diagnostican, cotizan, se les da seguimiento y se venden los productos, no alrededor de un guion genérico de chatbot.',
      customersLabel: 'Confían en nosotros',
      testimonials: [
        { company: 'Hidrorey', quote: '', name: '', role: '' },
        { company: 'Toshiba', quote: '', name: '', role: '' },
      ],
      integrationsLabel: 'Funciona con',
      integrations: ['Salesforce', 'HubSpot', 'SAP', 'WhatsApp', 'Correo'],
    },
    closing: {
      "title": "¿Qué portal de cliente ocupa más tiempo de tu semana?",
      "body": "Muéstranos dónde se detienen las facturas. Revisaremos lo que estamos construyendo y si Anytrail podría ayudar a tu equipo.",
      "cta": "Agendar demo de acceso anticipado"
    },
    whatsapp: {
      cta: 'O escríbenos por WhatsApp',
      prefill: 'Hola, quiero encontrar las ventas que estamos dejando ir.',
    },
    thanks: {
      meta: {
        title: 'Reunión confirmada | Anytrail',
        description: 'Tu demo de acceso anticipado de Anytrail está agendada.',
        ogLocale: 'es_ES',
      },
      title: 'Tu demo está agendada.',
      body: 'Revisa tu correo para la invitación. Trae los nombres de tus portales de clientes y un ejemplo de un rechazo o pago atrasado. No necesitas compartir contraseñas ni documentos de clientes.',
      manageSave: 'Guarda este enlace por si el correo de confirmación no llega. Es la única forma de cancelar o mover tu llamada:',
      back: 'Volver al inicio',
      demoLead: 'Sigue nuestros avances mientras llega la reunión.',
      demoCta: 'Anytrail en LinkedIn',
    },
    demo: {
      meta: {
        title: 'Demo en Vivo | Anytrail',
        description:
          'Habla con un agente de ventas con IA en vivo por WhatsApp. Deja tu nombre, tu teléfono y tu correo y mira cómo atiende una consulta real, como la enviaría un cliente.',
        ogLocale: 'es_ES',
      },
      hero: {
        title: 'Mira a Anytrail ayudarte a cerrar más, ahora mismo.',
        sub: 'Déjanos tu nombre, tu teléfono y tu correo, luego abre WhatsApp y habla con el agente como lo haría un cliente.',
      },
      form: {
        name: 'Tu nombre',
        namePlaceholder: 'Ana García',
        phone: 'Número de teléfono',
        phonePlaceholder: '+52 81 1234 5678',
        phoneHint: 'Incluye la lada del país.',
        email: 'Correo electrónico',
        emailPlaceholder: 'ana@empresa.com',
        submit: 'Continuar a WhatsApp',
        saving: 'Guardando…',
      },
      done: {
        title: 'Gracias, {name}.',
        body: 'Toca el botón para abrir WhatsApp. El primer mensaje ya está escrito; envíalo y el agente sigue desde ahí.',
        cta: 'Abrir WhatsApp',
        messageLabel: 'Tu primer mensaje:',
      },
      errors: {
        invalid_phone: 'Ese número no parece correcto. Incluye la lada del país, como +52 81 1234 5678.',
        invalid_email: 'Ese correo no parece correcto. Revísalo e inténtalo de nuevo.',
        invalid_input: 'Completa tu nombre, tu número de teléfono y tu correo.',
        generic: 'Algo salió mal. Inténtalo de nuevo.',
      },
    },
    celdasDemo: {
      meta: {
        title: 'Agente de cotización de celdas de carga | Anytrail',
        description:
          'Demostración: un agente de ventas califica al cliente por WhatsApp, elige la celda Utilcell 350N correcta y envía la cotización en PDF.',
        ogLocale: 'es_ES',
      },
    },
    grubpakDemo: {
      meta: {
        title: 'Vendedor de Grubpak | Anytrail',
        description:
          'Demostración: un vendedor con IA califica al cliente, arma su paquete de empaques, lo manda a pagar a Shopify y le da seguimiento según si compró.',
        ogLocale: 'es_ES',
      },
    },
    siniestrosDemo: {
      meta: {
        title: 'Siniestros en orden | Anytrail',
        description:
          'Demostración: cada foto, póliza y reporte que llega por WhatsApp se organiza solo en el expediente de su siniestro.',
        ogLocale: 'es_ES',
      },
    },
    schedule: {
      meta: {
        title: 'Agenda una demo de acceso anticipado | Anytrail',
        description:
          'Agenda una videollamada de 30 minutos sobre rechazos de facturas, plazos y seguimiento en los portales de pago de tus clientes.',
        ogLocale: 'es_ES',
      },
      title: 'Hablemos de tus portales de clientes',
      intro:
        'Treinta minutos, por video. Cuéntanos cómo gestionas los portales de cobro de tus clientes y conoce lo que estamos construyendo para cuentas por cobrar.',
      bullets: [
        'Mapear tus portales, el volumen de facturas y las tareas que tu equipo repite cada semana.',
        'Revisar un rechazo o un pago atrasado y el seguimiento que necesita.',
        'Conversar sobre el acceso anticipado, la cobertura de portales y si encaja con tu equipo.',
      ],
      pickDay: 'Elige un día',
      pickTime: 'Elige una hora',
      yourZone: 'Horarios en tu zona horaria',
      noSlots: 'No hay horarios disponibles ese día. Prueba con otro.',
      form: { name: 'Tu nombre', email: 'Correo de trabajo', website: 'Sitio web de la empresa', note: '¿Qué portales de clientes manejas? (opcional)' },
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
    quoteDemo: {
      meta: {
        title: 'Demo de cotización automática | Anytrail',
        description: 'Sube un catálogo, conversa con el agente de ventas y recibe una cotización generada al instante. Si falta un precio, el agente se lo pide al proveedor.',
        ogLocale: 'es_ES',
      },
    },
    supplierPrice: {
      meta: {
        title: 'Captura de precios | Anytrail',
        description: 'Captura los precios solicitados para completar una cotización.',
        ogLocale: 'es_ES',
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
        { page: 'rfqAutomation', label: 'Automatización de cotizaciones y las solicitudes que llegan incompletas' },
        { page: 'manufacturingCrm', label: 'CRM para manufactura: qué resuelve y qué no' },
        { page: 'home', label: 'Cómo funciona Anytrail, entrante y de prospección' },
        { page: 'schedule', label: 'Agenda una revisión de tu proceso comercial' },
      ],
      closing: {
        title: 'Averigua cuál es tu tiempo de respuesta real.',
        body: 'Antes de la llamada enviamos una consulta real por tus propios canales de ventas entrantes y medimos cuánto tarda en llegar una respuesta útil. Te entregamos los tiempos de cualquier forma, compres algo o no.',
        cta: 'Revisa mi proceso comercial',
      },
    },
    // El término nombra una categoría que deliberadamente no somos. La página
    // lo dice, en lugar de fingir ser un CRM para capturar el tráfico.
    manufacturingCrm: {
      meta: {
        title: 'CRM para manufactura: qué resuelve y qué no | Anytrail',
        description:
          'Un CRM registra lo que pasó. En manufactura, el problema caro es lo que nunca se registró. Por qué los CRM genéricos batallan aquí y qué preguntar antes de cambiar el tuyo.',
        ogLocale: 'es_ES',
      },
      h1: 'CRM para manufactura: qué resuelve y qué no.',
      navLabel: 'Qué resuelve un CRM para manufactura',
      lede: [
        'Si andas buscando un CRM para manufactura, por lo general ya hay algo descompuesto. El pronóstico no cuadra con la realidad, nadie confía en el pipeline, o los tratos que se cerraron nunca estuvieron en el sistema hasta la semana en que se firmaron.',
        'Antes de cambiar la herramienta vale la pena separar dos problemas que desde afuera se ven iguales. Uno sí lo resuelve un CRM. El otro no, y comprar un CRM mejor no lo va a tocar.',
      ],
      sections: [
        {
          label: 'EMPECEMOS POR AQUÍ',
          title: 'Un CRM es un sistema de registro. Ese es todo el trabajo.',
          paras: [
            'Un CRM guarda lo que pasó y reporta sobre eso. Quién es la cuenta, en qué etapa va el trato, qué se acordó, qué se cerró. Bien hecho, eso vale mucho, y un fabricante que opera con hojas de cálculo y memoria de bandeja de entrada debería arreglarlo.',
            'Pero un sistema de registro va después de que el registro existe. Ordena información una vez que una persona la capturó. Todos los CRM que se han construido comparten esa propiedad, y por eso un proyecto de CRM puede terminar bien y no cambiar nada en los ingresos.',
            'Así que la pregunta que importa no es cuál CRM. Es si tu problema vive antes o después del paso de captura.',
          ],
        },
        {
          title: 'Dónde batallan de verdad los CRM genéricos en manufactura.',
          paras: [
            'La mayoría de los CRM se diseñaron alrededor de una venta de software o de servicios: un comprador, un contrato, una etapa que avanza en un solo sentido. La manufactura rompe varias de esas suposiciones al mismo tiempo, y por eso la herramienta se siente como si te estorbara.',
          ],
          pointsLabel: 'Los desajustes de fondo',
          points: [
            {
              title: 'La unidad de trabajo es una cotización, no una oportunidad',
              body: 'Una sola consulta puede producir cuatro cotizaciones en dos años conforme cambia la especificación. El CRM lo modela como una oportunidad que editas sin parar, o como cuatro que andas depurando. Ninguna de las dos se parece a lo que tu equipo hace.',
            },
            {
              title: 'El comprador muchas veces no es tu contacto',
              body: 'Si vendes por distribuidores o representantes, quien especifica el equipo está a una empresa de distancia. El CRM tiene el registro de alguien que no decide.',
            },
            {
              title: 'La cartera instalada es el pipeline',
              body: 'Una bomba que vendiste hace seis años es un reemplazo que toca ahora. Es una oportunidad real y pronosticable, y casi ningún CRM la modela como algo distinto a un trato cerrado en el pasado.',
            },
            {
              title: 'La especificación no cabe en campos',
              body: 'Ciclo de trabajo, residuo, condiciones del sitio, alimentación eléctrica. Llega como la foto de una placa en un hilo de WhatsApp y termina en un adjunto que nadie puede consultar.',
            },
          ],
        },
        {
          title: 'Tu problema de datos en el CRM no es falta de disciplina.',
          paras: [
            'El diagnóstico de siempre es que los vendedores no actualizan el CRM, y el remedio de siempre es una política, un tablero, o un gerente preguntando los viernes. Casi nunca aguanta, y vale la pena ser honestos sobre por qué.',
            'Capturar datos es trabajo no pagado con un beneficio lejano e indirecto para quien lo hace. Un vendedor que acaba de pasar cuarenta minutos al teléfono estableciendo que el cliente necesita trifásica y que no puede recibir hasta el paro de planta tiene todos los incentivos para pasar a la siguiente llamada, porque el trato no avanza por capturarlo. Avanza por cotizar.',
            'Entonces el registro queda flaco, los reportes se arman sobre el registro flaco, y el pronóstico es una obra de ficción que todos acuerdan tratar como dato. Poner campos obligatorios lo empeora: la gente los llena con lo que pase la validación.',
            'Esta es la parte que ningún CRM puede arreglar, porque el arreglo tiene que ocurrir antes de la captura, dentro de la conversación.',
          ],
        },
        {
          title: 'Qué preguntar antes de cambiar el CRM.',
          paras: [
            'Si de verdad la herramienta es el problema, cambiarla es lo correcto. Estas son las preguntas que separan los dos casos.',
          ],
          points: [
            {
              title: 'Cuáles tratos faltan, no cuáles campos',
              body: 'Saca diez tratos que se cerraron el trimestre pasado. ¿Cuántos existían en el CRM más de un mes antes de cerrarse? Si la mayoría apareció tarde, el sistema es una bitácora y no un pipeline, y una bitácora nueva se va a portar igual.',
            },
            {
              title: 'Dónde vive hoy el detalle técnico',
              body: 'Si la respuesta es el correo, WhatsApp y la memoria de un vendedor, migrar a otro CRM mueve los campos vacíos, no la información.',
            },
            {
              title: 'Quién se supone que va a capturar',
              body: 'Cualquier plan cuyo éxito dependa de que vendedores ocupados capturen más de lo que capturan hoy es un plan que en tu empresa ya se intentó.',
            },
            {
              title: 'Qué pasa con una consulta a las nueve de la noche',
              body: 'No es una pregunta de CRM, que es justamente el punto. Casi siempre es el problema más caro.',
            },
          ],
        },
        {
          label: 'DÓNDE ENTRAMOS',
          title: 'Anytrail no es un CRM, y no quiere ser tu sistema de registro.',
          paras: [
            'Somos las cuatro cosas de arriba, vistas del otro lado. Anytrail trabaja la demanda en lugar de archivarla: responde las consultas entrantes en el momento en que llegan, abre conversaciones con cuentas que embonan con lo que vendes, hace las preguntas de diagnóstico que haría tu equipo, y da seguimiento durante semanas.',
            'Como está dentro de la conversación, el detalle técnico se captura mientras se establece y no se reconstruye después. La aplicación, el ciclo de trabajo, la alimentación eléctrica y las restricciones del sitio llegan junto con la oportunidad, ordenadas, sin que nadie las tenga que capturar. Lo que tu CRM registra mejora como efecto secundario de que el trabajo se hizo, que es la única versión de ese problema que se queda arreglada.',
            'Quédate con tu CRM. Es el sistema de registro y sí necesitas uno. Anytrail va delante de él.',
          ],
        },
      ],
      limits: {
        title: 'Qué no hace.',
        items: [
          'No es un CRM ni sustituye uno. Nada de reportes de pipeline, pronóstico ni sistema de registro.',
          'No migramos los datos de tu CRM actual, y en esta página no afirmamos nada sobre integraciones con ningún CRM en particular.',
          'No pone precios ni emite cotizaciones. Tu equipo conserva el precio, la recomendación técnica y la venta.',
          'No publicamos cifras de referencia sobre adopción de CRM, calidad de datos ni tasas de cierre. No las hemos medido nosotros.',
        ],
      },
      relatedLabel: 'Seguir leyendo',
      related: [
        { page: 'speedToLead', label: 'Tiempo de respuesta a leads en la venta de equipo industrial' },
        { page: 'rfqAutomation', label: 'Automatización de cotizaciones y las solicitudes que llegan incompletas' },
        { page: 'home', label: 'Cómo funciona Anytrail, entrante y de prospección' },
        { page: 'schedule', label: 'Agenda una revisión de tu proceso comercial' },
      ],
      closing: {
        title: 'Averigua cuál de los dos problemas tienes.',
        body: 'Treinta minutos. Revisamos cómo te llegan las oportunidades, qué queda registrado y qué nunca entra al sistema. Te entregamos los hallazgos, compres algo o no.',
        cta: 'Revisa mi proceso comercial',
      },
    },
    // De los tres términos, el que más se parece a lo que el producto hace.
    // El límite que hay que sostener: Anytrail prepara la cotización, no la emite.
    rfqAutomation: {
      meta: {
        title: 'Automatización de cotizaciones para equipo industrial | Anytrail',
        description:
          'Casi toda la automatización de cotizaciones asume que la solicitud llega completa. En equipo industrial rara vez llega así. Qué automatizar cuando falta lo que necesitas para poner precio.',
        ogLocale: 'es_ES',
      },
      h1: 'Automatización de cotizaciones para equipo industrial.',
      navLabel: 'Automatización de cotizaciones',
      lede: [
        'Automatizar cotizaciones normalmente significa software que mueve una solicitud más rápido por tu proceso: la asigna, arma la respuesta con plantillas, y rastrea dónde va.',
        'Todo eso asume que la solicitud llegó completa. En equipo industrial casi nunca llegó así, y el tiempo que pierdes se va en llegar a una especificación cotizable, no en producir el documento una vez que la tienes.',
      ],
      sections: [
        {
          label: 'SON DOS COSAS DISTINTAS',
          title: 'Automatizar del lado del comprador y del lado del proveedor no es el mismo producto.',
          paras: [
            'El término cubre dos mercados que tienen poco que ver entre sí. Del lado del comprador, las áreas de compras automatizan el envío de solicitudes a una lista de proveedores y la normalización de lo que regresa. Ese software lo compra quien adquiere, y es otro problema.',
            'Del lado del proveedor, que es donde estás tú si vendes equipo, automatizar significa qué pasa con una solicitud cuando llega. Casi todas las herramientas de este lado se construyeron para el caso en que aterriza una solicitud completa y estructurada desde un portal: partidas, cantidades, especificaciones y una fecha límite. Si así es tu entrada, las herramientas estándar funcionan.',
            'Para la mayoría de los fabricantes y distribuidores de equipo no es así. La solicitud llega en tres renglones por WhatsApp.',
          ],
        },
        {
          title: 'La solicitud incompleta es el caso normal, no la excepción.',
          paras: [
            '"¿Me cotizas una bomba?" es una solicitud real, y como está escrita no se puede cotizar. Antes de que alguien ponga precio, hay que establecer una lista de cosas que el remitente no pensó en incluir, casi siempre porque no sabía que importaban.',
          ],
          pointsLabel: 'Lo que suele faltar',
          points: [
            {
              title: 'La aplicación',
              body: 'Para qué es el equipo, que determina todo lo demás. Qué se va a mover, lavar, cortar o levantar, y en qué condiciones.',
            },
            {
              title: 'El ciclo de trabajo',
              body: 'Dos horas a la semana y dieciséis horas al día son máquinas distintas a precios distintos. Nadie ofrece ese dato por su cuenta.',
            },
            {
              title: 'Condiciones del sitio y alimentación',
              body: 'Disponibilidad de trifásica, condiciones ambientales, drenaje, acceso para la instalación. Cualquiera de estas puede eliminar el modelo que estabas por cotizar.',
            },
            {
              title: 'Quién está preguntando en realidad',
              body: 'Un jefe de mantenimiento reemplazando una unidad que falló y un ingeniero de proyecto especificando para una línea nueva necesitan respuestas distintas, en tiempos distintos y a precios distintos.',
            },
          ],
        },
        {
          title: 'Un formulario más largo no resuelve esto, y te cuesta solicitudes.',
          paras: [
            'La salida obvia es pedir todo por adelantado: un formulario de solicitud con los campos que tu equipo necesita. Toda empresa de equipo lo intenta. Fallan dos cosas.',
            'La primera es que un formulario es plano y el diagnóstico es condicional. Que importe la pregunta de la alimentación eléctrica depende de la respuesta sobre la aplicación. Que necesites datos de drenaje depende de qué se está lavando. Un formulario no puede ramificar sobre una respuesta que todavía no recibe, así que o le pregunta todo a todos, y entonces es tan largo que la gente lo abandona, o pregunta el subconjunto genérico y seguro, que es exactamente la solicitud incompleta de la que partiste.',
            'La segunda es que muchas veces el comprador no puede contestar lo que el formulario pregunta. Sabe que la bomba está goteando. No sabe la carga ni el gasto, y un campo obligatorio no le crea ese conocimiento. Una persona lo resolvería preguntando qué hace la bomba y deduciendo el resto. Un formulario no.',
            'Por eso ocurren las vueltas, y cada una cuesta un día.',
          ],
        },
        {
          title: 'Qué sí vale la pena automatizar.',
          paras: [
            'Ordenado más o menos por cuánto tiempo recupera cada uno en un negocio de equipo.',
          ],
          points: [
            {
              title: 'Captura condicional',
              body: 'Hacer la siguiente pregunta según la respuesta anterior, como lo haría un vendedor, en lugar de presentar una lista fija de campos. Este es el paso que elimina vueltas, no el que las acorta.',
            },
            {
              title: 'Revisar que esté completa antes de entregarla',
              body: 'Que nada llegue a un vendedor hasta que estén las respuestas necesarias para poner precio. La falla cara es una solicitud que se queda dos días en la cola de alguien antes de que se note que no se puede cotizar.',
            },
            {
              title: 'Identificación en el catálogo',
              body: 'Reducir a los modelos que embonan con la aplicación y con las restricciones del sitio, para que quien cotiza empiece de una lista corta y no del catálogo completo.',
            },
            {
              title: 'Seguimiento de las que se atoran',
              body: 'Las solicitudes se quedan calladas todo el tiempo, y el segundo y tercer contacto es donde se cierran los tratos de equipo. Es ingreso puro recuperado y casi nunca se automatiza.',
            },
          ],
        },
        {
          label: 'QUÉ HACEMOS',
          title: 'Anytrail lleva la solicitud hasta que se pueda cotizar. Tu equipo cotiza.',
          paras: [
            'Anytrail responde la solicitud cuando llega, por WhatsApp, desde un anuncio o desde tu sitio web, y la trabaja como lo haría tu equipo: cuál es la aplicación, qué tan duro va a trabajar la máquina, qué aguanta el sitio. Hace la siguiente pregunta según la respuesta anterior, así que un comprador que no sabe el gasto de todos modos termina en un punto cotizable.',
            'Cuando el panorama está completo, identifica en tu catálogo lo que corresponde a esa aplicación y entrega la solicitud a un vendedor con las respuestas ya reunidas. Las que se quedan calladas reciben seguimiento en los días y semanas siguientes sin que nadie tenga que acordarse.',
            'Y ahí se detiene, a propósito. Anytrail prepara la cotización; no la emite. El precio, la recomendación técnica y el documento final se quedan con tu equipo. Un agente que cotiza solo es un agente que tarde o temprano te va a comprometer a un precio o a un tiempo de entrega que no puedes cumplir.',
          ],
        },
      ],
      limits: {
        title: 'Qué no hace.',
        items: [
          'No emite cotizaciones, no pone precios y no compromete tiempos de entrega. Reúne lo que una cotización necesita y se lo entrega a una persona.',
          'No es una herramienta de compras. Si tú eres quien envía solicitudes a proveedores, este es el lado equivocado del mercado.',
          'En esta página no afirmamos nada sobre integraciones con ningún ERP, sistema de cotización o portal de proveedores en particular.',
          'No publicamos cifras sobre volumen de solicitudes, tiempos de ciclo ni tasas de cierre. No las hemos medido nosotros.',
        ],
      },
      relatedLabel: 'Seguir leyendo',
      related: [
        { page: 'speedToLead', label: 'Tiempo de respuesta a leads en la venta de equipo industrial' },
        { page: 'manufacturingCrm', label: 'CRM para manufactura: qué resuelve y qué no' },
        { page: 'home', label: 'Cómo funciona Anytrail, entrante y de prospección' },
        { page: 'schedule', label: 'Agenda una revisión de tu proceso comercial' },
      ],
      closing: {
        title: 'Mira cuántas vueltas dan realmente tus solicitudes.',
        body: 'Antes de la llamada enviamos una solicitud real por tus propios canales y contamos los intercambios que toma llegar a algo cotizable. Te entregamos los hallazgos, compres algo o no.',
        cta: 'Revisa mi proceso comercial',
      },
    },
    privacy: {
      meta: {
        title: 'Aviso de Privacidad | Anytrail',
        description:
          'Qué datos personales recaba Anytrail a través de su sitio web, anuncios y canales de mensajería, para qué los usa, quién los procesa y cómo solicitar acceso o eliminación.',
        ogLocale: 'es_MX',
      },
      title: 'Aviso de Privacidad',
      updated: 'Última actualización: 16 de octubre de 2026',
      intro:
        'Anytrail desarrolla agentes de ventas con IA para empresas industriales y distribuidores. Este aviso cubre los datos personales que manejamos cuando visitas este sitio, llenas uno de nuestros formularios, nos contactas desde un anuncio o nos escribes. No cubre los datos que nuestros clientes cargan en sus propias cuentas de Anytrail, que ellos controlan.',
      contactHeading: 'Responsable',
      contactBody: 'Anytrail. Contacto:',
      contactEmail: 'root@anytrail.ai',
      sections: [
        {
          heading: 'Qué recabamos',
          paragraphs: [
            'Lo que nos envías. Cuando agendas una revisión, pides una demo o llenas cualquier formulario de este sitio, guardamos lo que escribes: normalmente tu nombre, correo de trabajo, teléfono, empresa y lo que nos contaste sobre tu proceso de ventas.',
            'Formularios en Facebook e Instagram. Si nos contactas a través de un formulario de clientes potenciales de Meta, Meta nos envía los campos que llenaste: tu nombre, correo, teléfono y tus respuestas a las preguntas del formulario. Meta maneja ese formulario bajo su propia política de datos, que ves antes de enviarlo.',
            'WhatsApp y correo. Si nos escribes, guardamos tu número o dirección y la conversación para poder darle seguimiento.',
            'Cómo usas este sitio. Registramos nosotros mismos las vistas de página y los clics: qué página, tu idioma, el sitio de origen, las etiquetas de campaña del enlace, el tamaño de tu ventana y en qué parte de la página hiciste clic. Un identificador aleatorio en la pestaña de tu navegador agrupa una visita y desaparece al cerrarla. Nunca se vincula con tu nombre a menos que llenes un formulario.',
            'Google Analytics y el Píxel de Meta. El sitio también carga estas dos etiquetas de terceros. Google Analytics nos da estadísticas agregadas de tráfico. El Píxel de Meta le avisa a Meta cuando alguien visita este sitio o agenda una revisión, para que podamos medir nuestros anuncios en Facebook e Instagram y dejar de mostrárselos a quien no le interesan. Cada una instala una cookie en tu navegador (Google: _ga, Meta: _fbp) y recibe tu dirección IP, datos de tu navegador y las páginas que ves; Meta puede vincular esa actividad con tu cuenta de Meta bajo su propia política de datos. La protección contra rastreo de tu navegador o un bloqueador de anuncios detiene ambas, y el sitio funciona igual sin ellas.',
          ],
        },
        {
          heading: 'Para qué lo usamos',
          paragraphs: [
            'Para responderte: agendar la revisión, hacer la demo, enviarte lo que pediste y dar seguimiento a esa solicitud por correo, teléfono o WhatsApp. Si prefieres que dejemos de hacerlo, respóndenos diciéndolo o escribe a root@anytrail.ai y lo haremos.',
            'Para entender qué páginas y campañas traen a personas que luego hablan con nosotros, y gastar menos en las que no.',
          ],
        },
        {
          heading: 'Lo que nunca hacemos',
          paragraphs: [
            'No vendemos tus datos ni los compartimos con terceros para su propia publicidad.',
            'No usamos tus datos de contacto ni tus mensajes para entrenar modelos.',
            'Fuera de Google Analytics y el Píxel de Meta descritos arriba, este sitio no instala cookies ni carga scripts de publicidad o analítica de otras empresas.',
          ],
        },
        {
          heading: 'Quién los procesa por nosotros',
          paragraphs: [
            'Nuestra infraestructura corre en Amazon Web Services en la región US East (us-east-1); ahí se almacenan los formularios, las conversaciones y la telemetría del sitio. Meta procesa los formularios de clientes potenciales y los mensajes de WhatsApp cuando nos contactas por esos canales, y recibe las señales del Píxel de Meta descritas arriba. Google recibe las señales de Google Analytics. Nuestro proveedor de correo transporta los correos que intercambiamos contigo. Cada uno actúa bajo nuestras instrucciones y sus propios compromisos de privacidad.',
          ],
        },
        {
          heading: 'Cuánto tiempo los conservamos',
          paragraphs: [
            'Conservamos tu solicitud y la conversación relacionada mientras la atendemos y le damos seguimiento, y los eliminamos cuando nos lo pides. Los datos de uso del sitio se conservan de forma agregada y no están ligados a ti.',
          ],
        },
        {
          heading: 'Tus derechos',
          paragraphs: [
            'Puedes pedirnos qué datos tenemos sobre ti, corregirlos, que los eliminemos o que dejemos de contactarte, escribiendo a root@anytrail.ai. Si estás en México, esto incluye tus derechos de acceso, rectificación, cancelación y oposición (derechos ARCO) conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Respondemos dentro del plazo que exige la ley aplicable.',
          ],
        },
        {
          heading: 'Cambios',
          paragraphs: [
            'Cuando este aviso cambie, cambiará la fecha que aparece arriba. Los cambios relevantes también se señalarán en esta página durante un tiempo después de entrar en vigor.',
          ],
        },
      ],
      related: {
        text: 'La extensión de Chrome Anytrail Copilot tiene su propio aviso (en inglés):',
        href: '/privacy/copilot',
        label: 'Política de privacidad de Anytrail Copilot',
      },
    },
    // Customer how-to: connect a WhatsApp Business number to the CRM in
    // coexistence mode. Spanish only (our customers' sales teams); the PDF in
    // public/guias/ is the same content for sending over email or WhatsApp.
    // Inline **bold** is rendered by the page, so the block stays plain data.
    whatsappGuide: {
      meta: {
        title: 'Conectar su WhatsApp al CRM manteniendo el número en el teléfono | Anytrail',
        description:
          'Guía paso a paso para conectar su número de WhatsApp Business al Inbox de Anytrail en modo coexistencia: el número sigue en su teléfono y las conversaciones llegan al CRM.',
        ogLocale: 'es_ES',
      },
      eyebrow: 'Guía de conexión · WhatsApp',
      title: 'Conectar su WhatsApp al CRM',
      lede: [
        'Guía paso a paso para la conexión en modo **coexistencia**: su número sigue funcionando en la app WhatsApp Business del teléfono y, al mismo tiempo, todas las conversaciones llegan al Inbox de Anytrail.',
      ],
      pdf: {
        label: 'Descargar la guía en PDF',
        file: 'Guia-conectar-WhatsApp-coexistencia.pdf',
        note: '6 páginas · 3 MB',
      },
      before: {
        title: 'Antes de empezar',
        items: [
          '**Tenga el teléfono a la mano.** Varios pasos se confirman desde la app WhatsApp Business.',
          '**Actualice WhatsApp Business** en el teléfono a la última versión disponible en la tienda.',
          '**Use una cuenta de administrador** de Anytrail. El botón Conectar número solo aparece para administradores.',
          '**Tenga a la mano el acceso a Facebook** de la persona dueña del negocio (o con permiso en el portafolio empresarial de Meta).',
          '**Desactive bloqueadores de anuncios** o extensiones de privacidad en el navegador: la ventana de Meta se abre como ventana emergente.',
          'Reserve unos **10 minutos** sin interrupciones. El proceso completo se hace de corrido.',
        ],
        note: {
          kind: 'info',
          title: '¿Qué cambia después de conectar?',
          body:
            'Nada en su forma de trabajar desde el teléfono: sigue enviando y recibiendo mensajes en WhatsApp Business como siempre. Lo nuevo es que esas mismas conversaciones aparecen en el Inbox de Anytrail, donde su equipo puede leerlas, responderlas y dejar que el agente ayude. Lo que no se sincroniza: grupos, mensajes temporales, mensajes de una sola vez, ubicación en tiempo real, listas de difusión y llamadas.',
        },
      },
      steps: [
        {
          number: '0',
          title: 'Desvincular todos los dispositivos en WhatsApp Business',
          where: 'En el teléfono',
          paras: [
            'La conexión desvincula automáticamente cualquier WhatsApp Web o de escritorio que tenga abierto. Si lo hace usted primero, el proceso avanza sin errores a la mitad del camino.',
          ],
          phone: {
            title: 'En la app WhatsApp Business',
            items: [
              'Android: toque el menú de tres puntos (arriba a la derecha) y luego **Dispositivos vinculados**.',
              'iPhone: toque **Configuración** (abajo a la derecha) y luego **Dispositivos vinculados**.',
              'Toque cada dispositivo de la lista y elija **Cerrar sesión**.',
              'Repita hasta que la lista quede vacía.',
            ],
          },
          note: {
            kind: 'warn',
            title: 'Importante',
            body:
              'WhatsApp para Windows y para reloj (WearOS) no son compatibles con la conexión. Después de terminar la guía puede volver a vincular WhatsApp Web o la app de escritorio de Mac sin problema.',
          },
        },
        {
          number: '1',
          title: 'Abrir el Inbox',
          where: 'En la computadora',
          paras: [
            'Inicie sesión en Anytrail con su cuenta de administrador y entre a **platform.anytrail.ai/inbox** (también puede hacer clic en el icono de chat de la barra izquierda).',
          ],
          figures: [
            {
              src: 'inbox.jpg',
              alt: 'Inbox de Anytrail: lista de chats a la izquierda y botón Conectar número en el encabezado',
              caption:
                'El Inbox. Arriba a la izquierda, junto al logotipo, está el botón **Conectar número**.',
            },
          ],
        },
        {
          number: '2',
          title: 'Hacer clic en "Conectar número"',
          where: 'En el Inbox',
          paras: [
            'Haga clic en el botón **+ Conectar número**. Se abre un menú con dos opciones.',
            'Si no ve el botón, su usuario no es administrador de la cuenta. Pida a un administrador que haga la conexión o que le asigne ese rol.',
          ],
        },
        {
          number: '3',
          title: 'Elegir "Mantener WhatsApp en mi teléfono"',
          where: 'En el menú',
          paras: [
            'Seleccione la primera opción: **Mantener WhatsApp en mi teléfono**. Esa es la conexión en modo coexistencia.',
          ],
          figures: [
            {
              src: 'menu.jpg',
              alt: 'Menú Conectar número con las opciones Mantener WhatsApp en mi teléfono y Mover mi número a la nube',
              caption: 'Menú de **Conectar número**. Elija la primera opción.',
            },
          ],
          parasAfter: [
            'Al hacer clic, el botón muestra un indicador de carga y se abre una **ventana emergente de Meta**. Si no aparece, revise que el navegador no la haya bloqueado (icono de ventana bloqueada en la barra de direcciones) y vuelva a intentar.',
          ],
          note: {
            kind: 'warn',
            title: 'No elija "Mover mi número a la nube"',
            body:
              'Esa opción migra el número por completo a la nube de Meta: dejaría de funcionar en la app del teléfono. Solo se usa para números nuevos dedicados al CRM.',
          },
        },
        {
          number: '4',
          title: 'Completar el flujo de Meta (coexistencia)',
          where: 'Ventana emergente de Meta',
          paras: [
            'Esta parte la controla Meta. Las pantallas de abajo son las de la documentación oficial de Meta (en inglés); en su computadora y teléfono aparecen en español con los mismos textos.',
          ],
          list: [
            '**Inicie sesión en Facebook** con la cuenta de la persona dueña del negocio y haga clic en **Continuar** cuando Meta muestre la información que compartirá con Anytrail.',
            '**Seleccione o cree el portafolio empresarial** de su empresa. Si es la primera vez, Meta pedirá el nombre legal, sitio web o perfil y dirección del negocio.',
            'En **"Seleccione su configuración"** elija **Conectar su app de WhatsApp Business existente** y haga clic en **Siguiente**.',
            'Escriba el **número de teléfono** que usa en la app WhatsApp Business (con el código de país) y haga clic en **Siguiente**.',
          ],
          figures: [
            {
              src: 'meta-setup.jpg',
              alt: 'Pantalla de Meta "Select your setup" con la tarjeta "Connect your existing WhatsApp Business App" seleccionada',
              caption: 'Elija **Conectar su app de WhatsApp Business existente** (la primera tarjeta).',
            },
            {
              src: 'meta-telefono.jpg',
              alt: 'Pantalla de Meta "Add a phone number for WhatsApp" con el número escrito',
              caption: 'Escriba el número tal como está en la app del teléfono.',
            },
          ],
          parasAfter: [
            'Meta muestra entonces la pantalla **"Comparta sus contactos y chats"** con un **código de verificación**. Déjela abierta: ese código se escribe en el teléfono en el siguiente paso. Si prefiere, el enlace **"Usar un código QR"** muestra un QR para escanear desde la app.',
          ],
          figuresAfter: [
            {
              src: 'meta-codigo.jpg',
              alt: 'Pantalla de Meta "Share your contacts and chats" con el código de verificación y los pasos a seguir en el teléfono',
              caption: 'Copie el código de verificación. Debajo, Meta resume los pasos a hacer en el teléfono.',
            },
            {
              src: 'app-mensaje.jpg',
              alt: 'Chat de Facebook Business en WhatsApp Business con el mensaje "Connect to the Business Platform" y el botón Connect',
              caption: 'En el teléfono: mensaje de **Facebook Business** en WhatsApp Business. Toque **Conectar**.',
            },
          ],
        },
        {
          number: '5',
          title: 'Conectar y compartir sus chats',
          where: 'En el teléfono',
          paras: [
            'Al tocar **Conectar** en el mensaje de Facebook Business, la app abre la pantalla **"Conectar a la Plataforma de empresas"**. Si no recibió el mensaje, llegue a la misma pantalla desde **Menú** (Android) o **Configuración** (iPhone), luego **Cuenta** y **Conectar a la Plataforma de empresas**.',
          ],
          list: [
            'Toque el botón **Conectar a la Plataforma de empresas**.',
            'En el cuadro **"Compartir historial de chats"** toque **Compartir chats**. Así el Inbox de Anytrail arranca con las conversaciones de los últimos 6 meses y los nombres de sus contactos. **Esta decisión no se puede cambiar después.**',
            'En **"Ingresar código de verificación"** pegue el código que copió de la ventana de Meta (o toque **Escanear código QR**).',
            'Regrese a la computadora: la ventana de Meta avanza sola. Haga clic en **Finalizar**.',
          ],
          figures: [
            {
              src: 'app-conectar.jpg',
              alt: 'Pantalla "Connect to the Business Platform" en WhatsApp Business con el botón para conectar',
              caption: 'Toque **Conectar a la Plataforma de empresas**.',
            },
            {
              src: 'app-compartir.jpg',
              alt: 'Cuadro "Share chat history" con las opciones Share chats, Don\'t share chats y Cancel',
              caption: 'Toque **Compartir chats**.',
            },
            {
              src: 'app-codigo.jpg',
              alt: 'Pantalla "Enter verification code" con el campo para el código y el enlace Scan QR code instead',
              caption: 'Pegue el código o escanee el QR.',
            },
          ],
          note: {
            kind: 'warn',
            title: 'Hay 24 horas para hacerlo',
            body:
              'La sincronización de chats y contactos solo puede completarse dentro de las 24 horas siguientes a la conexión. Si en ese plazo no se compartieron los chats, hay que desconectar el número y repetir todo el proceso.',
          },
        },
        {
          number: '6',
          title: 'Verificar que quedó conectado',
          where: 'En el Inbox',
          paras: [
            'Al cerrarse la ventana de Meta, el Inbox muestra el aviso **"Número conectado"**. En los minutos siguientes:',
          ],
          list: [
            'Las conversaciones de los últimos 6 meses van apareciendo en la lista de chats (el historial se importa por partes y puede tardar un rato en completarse).',
            'Los nombres de sus contactos del teléfono se muestran en el Inbox.',
            'Envíe un mensaje de prueba desde el teléfono a un cliente: debe verse en el Inbox en segundos.',
            'Responda ese chat desde el Inbox: el mensaje debe verse también en el teléfono.',
          ],
        },
      ],
      after: {
        title: 'Después de conectar',
        note: {
          kind: 'info',
          title: 'Puede seguir usando WhatsApp Web',
          body:
            'Puede volver a vincular WhatsApp Web o la app de escritorio. El número queda con un límite de 20 mensajes por segundo entre la app y el CRM, suficiente para la operación diaria. Si en algún momento desea desconectar el CRM, se hace desde WhatsApp Business en el teléfono: **Configuración**, **Cuenta**, **Plataforma de empresas**, botón **Desconectar**.',
        },
        figure: {
          src: 'app-desconectar.jpg',
          alt: 'Pantalla "Business Platform" en WhatsApp Business con la cuenta conectada y el botón Disconnect',
          caption: 'Pantalla **Plataforma de empresas** en WhatsApp Business, con el botón **Desconectar**.',
        },
      },
      trouble: {
        title: 'Si algo sale mal',
        colMessage: 'Mensaje en pantalla',
        colAction: 'Qué hacer',
        rows: [
          {
            message: '"Su navegador bloqueó la ventana de Meta"',
            action:
              'Desactive el bloqueador de anuncios o la extensión de privacidad para platform.anytrail.ai, recargue la página y repita desde el Paso 2.',
          },
          {
            message: '"Se canceló la conexión"',
            action:
              'Se cerró la ventana de Meta antes de terminar. Repita desde el Paso 2 y complete todas las pantallas hasta Finalizar.',
          },
          {
            message: '"Ese número ya está conectado a otra cuenta"',
            action:
              'El número ya está vinculado a otra cuenta de Anytrail. Escríbanos para resolverlo antes de volver a intentar.',
          },
          {
            message: '"No se pudo conectar el número"',
            action:
              'Espere un minuto y repita desde el Paso 2. Si persiste, envíenos una captura de pantalla de la ventana de Meta.',
          },
          {
            message: 'Meta muestra "Función no disponible" justo después de Continuar',
            action:
              'Es una restricción del lado de Meta sobre la cuenta de Facebook usada. Avísenos: lo revisamos con usted.',
          },
          {
            message: 'El número aparece como "No elegible" en la lista de Meta',
            action:
              'Se eligió "Mover mi número a la nube" en vez de "Mantener WhatsApp en mi teléfono". Cierre la ventana y repita desde el Paso 3.',
          },
        ],
      },
      source: {
        text: 'Las capturas de la ventana de Meta y de la app provienen de la documentación oficial de Meta:',
        href: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users',
        label: 'Onboard WhatsApp Business app users',
      },
    },
    // Customer how-to: give Anytrail partner access to the customer's Meta ad
    // account and Page from their own business portfolio, so the operator can
    // connect ads and Instant Form leads from the admin console. Spanish only,
    // same component and PDF convention as whatsappGuide.
    metaGuide: {
      meta: {
        title: 'Conectar sus anuncios de Meta con Anytrail | Anytrail',
        description:
          'Guía paso a paso para dar acceso a Anytrail, como socio, a su cuenta publicitaria y a su página de Facebook, para que sus campañas y los leads de sus formularios lleguen al CRM.',
        ogLocale: 'es_ES',
      },
      eyebrow: 'Guía de conexión · Anuncios de Meta',
      title: 'Conectar sus anuncios de Meta con Anytrail',
      lede: [
        'En esta guía usted da acceso a Anytrail, como **socio**, a su cuenta publicitaria y a su página de Facebook desde el portafolio empresarial de Meta de su empresa. Con ese acceso, nuestro equipo conecta sus campañas al CRM: los leads de sus formularios instantáneos llegan solos y el agente responde a quien escribe desde sus anuncios.',
        'Usted conserva la propiedad de todo: la cuenta publicitaria, la página y el método de pago siguen siendo suyos, y puede retirar el acceso cuando quiera.',
      ],
      pdf: {
        label: 'Descargar la guía en PDF',
        file: 'Guia-conectar-anuncios-Meta.pdf',
        note: '5 páginas · 255 KB',
      },
      before: {
        title: 'Antes de empezar',
        items: [
          '**Use la cuenta de Facebook de un administrador** del portafolio empresarial de su empresa (antes llamado Business Manager). Solo un administrador con control total puede agregar socios.',
          '**Tenga a la mano el ID del portafolio de Anytrail:** **4027857450851371** (Anytrail Inc.).',
          '**Use una computadora.** Estos pasos se hacen en **business.facebook.com**; la app del teléfono no muestra todas las opciones.',
          'Reserve unos **10 minutos**.',
        ],
        note: {
          kind: 'info',
          title: '¿Qué podrá hacer Anytrail con este acceso?',
          body:
            'Ver el rendimiento de sus campañas, crear y ajustar anuncios junto con usted y recibir en el CRM los leads de sus formularios instantáneos. No podrá ver ni cambiar su método de pago, ni eliminar su cuenta publicitaria o su página.',
        },
      },
      steps: [
        {
          number: '1',
          title: 'Revisar que su cuenta publicitaria esté al corriente',
          where: 'Facturación y pagos',
          paras: [
            'Meta no permite compartir una cuenta publicitaria que tenga un pago rechazado o una revisión pendiente, y el error aparece hasta el final del proceso. Revíselo primero.',
          ],
          list: [
            'Entre a **business.facebook.com** y abra **Facturación y pagos** (en el menú de la izquierda o en **Todas las herramientas**).',
            'En **Cuentas**, elija su cuenta publicitaria y confirme que el **saldo actual** no tenga pagos vencidos.',
            'En **Actividad de pagos**, revise que no haya movimientos con estado **Fallido** sin un pago **Pagado** después.',
            'Confirme que el **método de pago predeterminado** esté vigente (por ejemplo, que la tarjeta no haya vencido).',
          ],
          note: {
            kind: 'warn',
            title: 'Si hubo un pago fallido',
            body:
              'Liquídelo desde **Facturación y pagos** y espere de **24 a 48 horas** antes de continuar con el Paso 2. Aunque el saldo quede en cero, Meta puede tardar en retirar el aviso de la cuenta.',
          },
        },
        {
          number: '2',
          title: 'Agregar a Anytrail como socio',
          where: 'Configuración del portafolio',
          list: [
            'En **business.facebook.com** abra **Configuración** (icono de engrane, abajo a la izquierda).',
            'Arriba a la izquierda, verifique que esté seleccionado el **portafolio de su empresa**.',
            'En el menú, abra **Usuarios** y luego **Socios**.',
            'Haga clic en **Agregar** y elija **Dar acceso a sus activos a un socio**.',
            'Escriba el ID **4027857450851371** y haga clic en **Siguiente**.',
          ],
          note: {
            kind: 'info',
            title: 'Si los nombres no coinciden exactamente',
            body:
              'Meta cambia los textos de sus menús con frecuencia. Busque siempre la sección **Socios** dentro de **Usuarios**; si no la encuentra, escriba "Socios" en el buscador de Configuración.',
          },
        },
        {
          number: '3',
          title: 'Compartir su cuenta publicitaria',
          where: 'Configuración › Socios',
          paras: [
            'Después de escribir el ID, Meta le pide elegir qué activos compartir con **Anytrail Inc.**',
          ],
          list: [
            'Como tipo de activo, elija **Cuentas publicitarias**.',
            'Marque la cuenta publicitaria de su empresa.',
            'En los permisos, active **Administrar campañas** y **Ver rendimiento**. Si prefiere que nosotros administremos todo, elija **Control total**.',
            'Haga clic en **Guardar cambios**.',
          ],
        },
        {
          number: '4',
          title: 'Compartir su página de Facebook',
          where: 'Configuración › Socios',
          paras: [
            'La página es la que firma sus anuncios y la dueña de sus formularios instantáneos. Sin acceso a ella no podemos traer los leads al CRM.',
          ],
          list: [
            'Con **Anytrail Inc.** seleccionado en **Socios**, haga clic en **Asignar activos** y elija **Páginas**.',
            'Marque la página de su empresa.',
            'Active los permisos de **Anuncios**, **Leads** (clientes potenciales) y **Rendimiento**.',
            'Haga clic en **Guardar cambios**.',
          ],
        },
        {
          number: '5',
          title: 'Dar acceso a los leads de sus formularios',
          where: 'Configuración › Integraciones',
          paras: [
            'Meta pide un permiso adicional para que una herramienta externa reciba los leads de sus formularios instantáneos.',
          ],
          list: [
            'En **Configuración**, abra **Integraciones** y luego **Acceso a clientes potenciales** (en inglés, "Leads Access").',
            'Seleccione la página de su empresa.',
            'En la pestaña **Socios**, agregue a **Anytrail Inc.**',
            'En la pestaña **CRM**, agregue **anytrail-leads-crm** si aparece en la lista.',
          ],
          note: {
            kind: 'info',
            title: 'Si no hay restricciones',
            body:
              'Si Meta indica que todas las personas y herramientas con acceso a la página ya pueden ver los leads, no hace falta hacer nada más en este paso.',
          },
        },
        {
          number: '6',
          title: 'Avisarnos para terminar la conexión',
          where: 'Por correo o WhatsApp',
          paras: [
            'Escríbale a su contacto en Anytrail cuando termine, con el **nombre de su cuenta publicitaria** y el de su **página**. A partir de ahí, nosotros:',
          ],
          list: [
            'Conectamos su cuenta publicitaria al CRM desde nuestra consola.',
            'Dejamos sus campañas visibles en **Campañas**, dentro de Anytrail, con gasto, alcance y leads.',
            'Activamos la llegada automática de los leads de sus formularios al CRM.',
            'Si su WhatsApp todavía no está conectado, lo hacemos juntos con la guía **Conectar su WhatsApp al CRM** (anytrail.ai/es/guias/conectar-whatsapp).',
          ],
        },
      ],
      after: {
        title: 'Después de conectar',
        note: {
          kind: 'info',
          title: 'Puede retirar el acceso cuando quiera',
          body:
            'En **Configuración**, **Usuarios**, **Socios**, seleccione **Anytrail Inc.** y elija **Eliminar**. Sus campañas, su página y sus leads siguen siendo suyos; solo dejan de verse en el CRM.',
        },
      },
      trouble: {
        title: 'Si algo sale mal',
        colMessage: 'Lo que ve',
        colAction: 'Qué hacer',
        rows: [
          {
            message: '"Estado de cuenta existente no válido": una o más cuentas publicitarias tienen problemas o están en revisión',
            action:
              'Hay un pago pendiente o una revisión en alguna cuenta publicitaria de su portafolio. Revise el Paso 1, liquide cualquier pago fallido y espere de 24 a 48 horas antes de volver a intentar.',
          },
          {
            message: 'No aparece la sección **Socios** o el botón **Agregar**',
            action:
              'Su usuario no es administrador con control total del portafolio. Pida a un administrador que haga los pasos, o que le asigne ese rol en **Usuarios › Personas**.',
          },
          {
            message: 'Meta no encuentra el portafolio al escribir el ID',
            action: 'Revise que el ID sea exactamente **4027857450851371**, sin espacios.',
          },
          {
            message: 'Su cuenta publicitaria no aparece al compartir activos',
            action:
              'La cuenta es personal o pertenece a otro portafolio. Agréguela primero a su portafolio en **Cuentas › Cuentas publicitarias › Agregar**, o avísenos y lo vemos juntos.',
          },
          {
            message: 'Meta pide verificar su negocio',
            action:
              'Siga las indicaciones de Meta en **Centro de seguridad**. La verificación es de su empresa y requiere sus documentos, así que no podemos hacerla por usted.',
          },
        ],
      },
    },
    footer: {
      "tagline": "Construyendo una forma más clara de gestionar los portales de cobro de tus clientes. © 2026 Anytrail",
      "linksLabel": "Lecturas",
      "privacyLabel": "Aviso de privacidad"
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
    manufacturingCrm: '/manufacturing-crm',
    rfqAutomation: '/rfq-automation',
    // Site-wide privacy policy. Linked from the footer, and the URL our Meta
    // lead forms point at, so the path must stay stable.
    privacy: '/privacy',
    // English only: it is the privacy notice for the Chrome extension, and the
    // Chrome Web Store listing points at this exact URL. Pages missing from a
    // language are skipped by prerender.js rather than faked.
    privacyCopilot: '/privacy/copilot',
    // English only, like the privacy notice: the original website-crawl chat
    // demo, kept reachable for inbound-agent walkthroughs after /demo became
    // the WhatsApp handoff.
    inboundDemo: '/inbound_demo',
  },
  es: {
    home: '/es',
    thanks: '/es/gracias',
    demo: '/es/demo',
    schedule: '/es/agenda',
    // Spanish slugs are built on the terms a Spanish-speaking industrial buyer
    // actually types, not on translations of the English idiom. "Speed to
    // lead" in particular has no Spanish search equivalent at all.
    speedToLead: '/es/tiempo-de-respuesta',
    manufacturingCrm: '/es/crm-para-manufactura',
    rfqAutomation: '/es/automatizacion-de-cotizaciones',
    privacy: '/es/privacidad',
    // Spanish-only unlisted demo; noindex.
    quoteDemo: '/quote_demo',
    supplierPrice: '/supplier_price',
    // Spanish only and unlisted: the claims demo built for a Delpur (seguros)
    // meeting. Full-screen app, no marketing chrome (see App.jsx).
    siniestrosDemo: '/es/siniestros_demo',
    // Spanish only and unlisted: the Utilcell 350N load-cell quoting agent
    // demo. Full-screen app like siniestrosDemo.
    celdasDemo: '/es/celdas_demo',
    // Spanish only and unlisted: packaging sales agent demo for Grubpak
    // (Shopify store). Full-screen app like celdasDemo.
    grubpakDemo: '/es/grubpak_demo',
    // Spanish only: customer how-to for connecting WhatsApp in coexistence
    // mode. Sent to customers as a link; nothing on the site links to it yet,
    // so it is noindex like privacyCopilot. Drop it from NOINDEX_PAGES to
    // let it rank once a page links to it.
    whatsappGuide: '/es/guias/conectar-whatsapp',
    // Spanish only, unlinked like whatsappGuide: partner-access guide sent to
    // customers before we connect their ads from the admin console.
    metaGuide: '/es/guias/conectar-anuncios-meta',
  },
}

// Long-form content pages, in the order they appear in the footer. Every page
// on the site links here, which is what gives a new cluster page more than the
// single internal link Semrush flags.
export const CLUSTER_PAGES = ['speedToLead', 'manufacturingCrm', 'rfqAutomation']

// Pages that must never be indexed. A thank-you page ranking in search would
// pull people past the booking step into a dead end.
// demo and schedule are form-only conversion pages: too little text to rank,
// and Semrush flags them for low word count and text-HTML ratio. They stay
// linked from every page (noindex, follow). privacyCopilot exists for the
// Chrome Web Store listing; nothing on the site links to it, so listing it in
// the sitemap made it an orphan.
export const NOINDEX_PAGES = ['thanks', 'demo', 'schedule', 'privacyCopilot', 'inboundDemo', 'quoteDemo', 'supplierPrice', 'siniestrosDemo', 'celdasDemo', 'grubpakDemo', 'whatsappGuide', 'metaGuide']

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

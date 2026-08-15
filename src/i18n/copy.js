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
        description: 'Your commercial process review is booked.',
        ogLocale: 'en_US',
      },
      title: 'Your review is booked.',
      body: "Check your email for the calendar invite. Before we meet, we'll send an inquiry through your own inbound channels and time how long a reply takes, so we can show you exactly where opportunities are being lost today.",
      manageSave: 'Save this link in case the confirmation email does not arrive. It is the only way to cancel or move your call:',
      back: 'Back to home',
      demoLead: 'While you wait, run the agent on your own catalog.',
      demoCta: 'Try the live demo',
    },
    demo: {
      meta: {
        title: 'Live Demo | Anytrail',
        description:
          'See an AI sales agent built on your own website in one minute. It learns your products and sells them back to you, plus your ideal customer profile and 5 matching leads.',
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
      manageSave: 'Guarda este enlace por si el correo de confirmación no llega. Es la única forma de cancelar o mover tu llamada:',
      back: 'Volver al inicio',
      demoLead: 'Mientras tanto, prueba el agente con tu propio catálogo.',
      demoCta: 'Probar la demo',
    },
    demo: {
      meta: {
        title: 'Demo en Vivo | Anytrail',
        description:
          'Mira un agente de ventas con IA construido sobre tu propio sitio web en un minuto. Aprende tus productos y te los vende, más tu perfil de cliente ideal y 5 prospectos.',
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
    manufacturingCrm: '/manufacturing-crm',
    rfqAutomation: '/rfq-automation',
    // English only: it is the privacy notice for the Chrome extension, and the
    // Chrome Web Store listing points at this exact URL. Pages missing from a
    // language are skipped by prerender.js rather than faked.
    privacyCopilot: '/privacy/copilot',
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
  },
}

// Long-form content pages, in the order they appear in the footer. Every page
// on the site links here, which is what gives a new cluster page more than the
// single internal link Semrush flags.
export const CLUSTER_PAGES = ['speedToLead', 'manufacturingCrm', 'rfqAutomation']

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

// Service landing page content — process steps for each service.
//
// CARD IMAGES (homepage service grid):
//   1. Drop your image in public/images/services/cards/
//   2. Uncomment the cardImage line for that service below
//   Blank = animated illustration shows instead
//
// HERO IMAGES (service landing page):
//   Single  → heroImage: '/images/services/.../file.png'
//   Slideshow → heroImages: ['/images/...', '/images/...']
//   Blank   → clean placeholder shows instead

export interface ServiceStep {
  title: string
  text: string
  image?: string
  video?: string
}

export interface ServiceDetail {
  slug: string
  icon: string
  title: string
  intro: string
  steps: ServiceStep[]
  exampleUrl?: string
  exampleLabel?: string
  /**
   * 'timeline' — alternating image/text columns per step
   * 'arrow'    — vertical numbered steps with down-arrows
   */
  stepsLayout?: 'timeline' | 'arrow'
  /** Replaces the animated illustration on the homepage service card */
  cardImage?: string
  /** Single hero image shown below the intro on the service landing page */
  heroImage?: string
  /** Two or more images — renders as an auto-cycling slideshow on the landing page */
  heroImages?: string[]
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: 'web-design-development',
    icon: 'layout',
    title: 'Web Design & Development',
    intro:
      'From first conversation to live website — here is exactly how we take your project from idea to launch.',
    stepsLayout: 'arrow',
    cardImage: '/images/services/cards/Web_Design/Web_Design_Card.jpg',
    heroImage: '/images/services/WEB_DESIGN/Web_Development_Hero_Card.jpg',
    steps: [
      {
        title: 'Discovery',
        text: 'We learn your business, your customers, and your goals. You show us sites you like; we identify what will actually convert for your audience.',
      },
      {
        title: 'Strategy & Wireframes',
        text: 'We map every page and plan the user journey — what visitors see first, where they click, and how they become customers.',
      },
      {
        title: 'Design',
        text: 'Your brand comes to life. We design the look and feel, you review it, and we refine until it is right.',
      },
      {
        title: 'Development',
        text: 'We build the real thing — fast, responsive, accessible, and tested on phones, tablets, and desktops.',
      },
      {
        title: 'Launch & Deployment',
        text: 'Domain, hosting, SSL, analytics — we handle the technical launch end to end. Your site goes live with zero downtime.',
      },
      {
        title: 'Post-Launch Support',
        text: 'We monitor, maintain, and keep improving. Launch day is the start of the relationship, not the end.',
      },
    ],
  },
  {
    slug: 'digital-advertising',
    icon: 'pen-tool',
    title: 'Digital Advertising',
    intro:
      'How we build Meta and Google campaigns that generate qualified leads instead of burning budget.',
    stepsLayout: 'arrow',
    cardImage: '/images/services/cards/Digital_marketing/Digital_Advertising_Card.jpg',
    heroImage: '/images/services/Digital_Advertising/Digital_Advertising_Hero.jpg',
    steps: [
      {
        title: 'Audience Research',
        text: 'We define exactly who your customers are — demographics, interests, behavior — and where to reach them on Meta, Google, and beyond.',
      },
      {
        title: 'Creative & Copy',
        text: 'Scroll-stopping visuals and messaging built for your audience. Every ad is designed to earn the click.',
      },
      {
        title: 'Campaign Setup',
        text: 'Pixel tracking, conversion events, audience targeting, and budget structure — configured properly from day one so every dollar is measurable.',
      },
      {
        title: 'Launch & Monitor',
        text: 'Ads go live and we watch them daily — click-through rates, cost per lead, conversions — catching problems before they cost you.',
      },
      {
        title: 'Optimize & Scale',
        text: 'We cut what underperforms, double down on what works, and scale your winners. Cost per lead drops as the campaign learns.',
      },
    ],
  },
  {
    slug: 'ecommerce-development',
    icon: 'shopping-bag',
    title: 'E-Commerce Development',
    intro:
      'A fully operational online store, built and handed over — you start selling without the technical headache.',
    stepsLayout: 'arrow',
    cardImage: '/images/services/cards/E_Commerce/E_commerce_card.jpg',
    heroImages: [
      '/images/services/E_Commerce_development/OTT_Store.jpg',
      '/images/services/E_Commerce_development/On_gewt_Store.jpg',
    ],
    // exampleUrl: 'https://your-store-url.com',
    // exampleLabel: 'See a store we built',
    steps: [
      {
        title: 'Product & Catalog Planning',
        text: 'We organize your products, variants, pricing, and shipping rules so the store structure matches how you actually sell.',
      },
      {
        title: 'Store Design',
        text: 'Product pages, collections, and a checkout flow designed around your brand — built to turn browsers into buyers.',
      },
      {
        title: 'Build & Payments',
        text: 'We develop the store, connect payment processing, taxes, and shipping, and integrate any tools you need.',
      },
      {
        title: 'Test Orders',
        text: 'We run real end-to-end purchases — cart, checkout, confirmation emails, refunds — until everything works flawlessly.',
      },
      {
        title: 'Launch',
        text: 'Your store goes live on your domain with SSL and analytics. First sale ready from minute one.',
      },
      {
        title: 'Handover & Training',
        text: 'You get complete control and a walkthrough of managing products, orders, and discounts yourself. It is your store — fully.',
      },
    ],
  },
  {
    slug: 'analytics-strategy',
    icon: 'compass',
    title: 'Analytics & Strategy',
    intro: 'We turn your data into decisions — and decisions into growth.',
    stepsLayout: 'arrow',
    cardImage: '/images/services/cards/Analytics/Analytics_Strategy_Card.jpg',
    heroImage: '/images/services/Analytics_Strategy/Analytics_Strategy_Hero.jpg',
    steps: [
      {
        title: 'Audit',
        text: 'We review your current site, ads, and funnel to find what is working, what is leaking, and where the opportunities are.',
      },
      {
        title: 'Tracking Setup',
        text: 'Analytics, conversion events, and dashboards configured so you can see exactly where leads and sales come from.',
      },
      {
        title: 'Insights',
        text: 'We translate the numbers into plain language: what your customers do, where they drop off, and why.',
      },
      {
        title: 'Roadmap',
        text: 'A prioritized action plan — what to fix first, what to test next, and what results to expect.',
      },
      {
        title: 'Iterate',
        text: 'We measure, adjust, and repeat. Strategy is not a document; it is a continuous loop that compounds.',
      },
    ],
  },
  {
    slug: 'consultation',
    icon: 'message-circle',
    title: 'Consultation',
    intro:
      'Clarity before you commit. Here is what a consultation with us actually looks like.',
    stepsLayout: 'arrow',
    cardImage: '/images/services/cards/Consultation/Consultation_Card.jpg',
    heroImage: '/images/services/consultation/Calendar.jpg',
    steps: [
      {
        title: 'Book a Time',
        text: 'Pick a slot that works for you — free, 30 minutes, no obligations and no sales pressure.',
      },
      {
        title: 'Tell Us Your Goals',
        text: 'We listen first: your business, your challenges, what you have tried, and where you want to be.',
      },
      {
        title: 'Get Honest Recommendations',
        text: 'We tell you what we would do in your position — including when the answer is something we do not sell.',
      },
      {
        title: 'Walk Away With a Plan',
        text: 'You leave with clear next steps and a fixed quote if you want our help. Either way, the plan is yours to keep.',
      },
    ],
  },
  {
    slug: 'customer-support',
    icon: 'settings',
    title: 'Customer Support',
    intro:
      'Direct access to the people who built your site — no ticket queues, no disappearing acts.',
    stepsLayout: 'arrow',
    cardImage: '/images/services/cards/Customer_Support/Customer_Support_Card.jpg',
    heroImage: '/images/services/CUSTOMER_SERVICE/Step_1_Reach_Directly.jpg',
    steps: [
      {
        title: 'Reach Us Directly',
        text: 'Phone, video call, or email — you have our direct contact information and a real person answers.',
      },
      {
        title: 'We Assess Quickly',
        text: 'Updates, fixes, questions, or new ideas — we triage same-day and tell you exactly what it takes.',
      },
      {
        title: 'Resolution',
        text: 'We make the change, fix the issue, or ship the improvement — and show you the result.',
      },
      {
        title: 'Follow-Up',
        text: 'We check back to confirm everything works and look for what else could be improved while we are at it.',
      },
    ],
  },
]

export const detailBySlug = (slug: string) => SERVICE_DETAILS.find((d) => d.slug === slug)
export const detailByIcon = (icon: string) => SERVICE_DETAILS.find((d) => d.icon === icon)

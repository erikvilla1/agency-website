// PLACEHOLDER CONTENT — replace with real data when available,
// then move into Supabase tables in Phase 4.
import type { TeamMember, Service, PortfolioItem, FaqItem, PromiseItem } from '../types'

export const AGENCY = {
  name: '\'IWA MEDIA',
  tagline: 'Local Businesses Deserve More Than Just a Website.',
  pitch:
    '\'Iwa Media is a Honolulu-based marketing agency that generates leads, builds websites, and runs campaigns that actually grow your business. We don\'t disappear after launch \- we become part of your team.',
  email: 'contact@iwamedia.com',
  phone: '+1 808 384 7077',
  social: {
    instagram: '#',
    linkedin: '#',
  },
}

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Erik Villa',
    role: 'Software Developer',
    bio: 'Erik graduated from UCSD as an Aerospace engineer, and now helps businesses in designing and shipping software for their needs based in San Diego. At \'Iwa Media, he applies his software engineering skills to architect website automation for clients, create e-commerce websites, and helps with data insights to help where bottlenecks are in your business to grow.',
    image_url: '/images/team/Erik-Villa.jpg',
    order: 1,
  },
  {
    id: '2',
    name: 'Kai Saucedo',
    role: 'Digital Marketing Specialist',
    bio: 'Based out of Waimanalo, Hawai\'i, Kai holds a Bachelor\'s in Mechancial Engineering from UC San Diego and brings a data-driven, systems thinking approach to digital marketing. He has independently grown brands to 1M+ monthly views and 2M+ streams across platforms, earned a feature on EDM.com, and built audiences through organizing short form content on Instagram and TikTok. At \'Iwa Media, he leads paid ad strategy, content creation, and campaign optimization to generate real results for local businesses.',
    image_url: '/images/team/Kai-Saucedo.jpg',
    order: 2,
  },
  {
    id: '3',
    name: 'Kaena Cavasso',
    role: 'Digital Marketing Specialist',
    bio: 'Kaena has garnered over 50M+ views and 40K+ followers across Instagram and TikTok accounts through viral content strategies and authentic self-branding. Out of Waimanalo, Hawai\'i, Kaena combines a deep understanding of local culture and virality with a genuine understanding of the local market to drive engagement and growth for clients.',
    image_url: '/images/team/Kaena-Cavasso.jpg',
    order: 3,
  },
]

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Web Design & Development',
    description: 'Custom websites designed to attract customers, build credibility, and convert visitors into leads. Fast, responsive, and built around your business goals.',
    icon: 'layout',
    order: 1,
  },
  {
    id: '2',
    title: 'Digital Advertising',
    description: 'Targeted advertising campaigns across Meta, Google, and digital platforms that generate qualified leads, increase conversions, and maximize your marketing budget.',
    icon: 'pen-tool',
    order: 2,
  },
  {
    id: '3',
    title: 'E-Commerce Development',
    description: 'Launch a fully operational online store without the complexity of managing inventory. We build & optimize it, then hand you the keys so you can start selling immediately.',
    icon: 'shopping-bag',
    order: 3,
  },
  {
    id: '4',
    title: 'Analytics & Strategy',
    description: 'We analyze your Meta Ads data \- CPL, conversion rates, and engagement \- alongside market research to continuously optimize your ads and website for the highest possible return.',
    icon: 'compass',
    order: 4,
  },
  {
    id: '5',
    title: 'Consultation',
    description: 'One-on-one guidance to help establish and grow your digital presence. From website planning to marketing strategy, we provide clear direction before you invest resources.',
    icon: 'message-circle',
    order: 5,
  },
  {
    id: '6',
    title: 'Customer Support',
    description: 'Ongoing support when you need it. Get direct access through phone or video consultations for updates, troubleshooting, and strategic guidance.',
    icon: 'settings',
    order: 6,
  },
]

// Demo case studies — replace with real projects when available
export const PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modern E-commerce Storefront',
    description: 'Full store build for an emerging streetwear label — product catalog, checkout, and brand-aligned design.',
    image_url: null,
    video_url: null,
    client_name: 'Demo Project',
    category: 'E-commerce',
    order: 1,
  },
  {
    id: '2',
    title: 'Brand Identity System',
    description: 'Logo, typography, and visual language for a boutique consultancy entering a crowded market.',
    image_url: null,
    video_url: null,
    client_name: 'Demo Project',
    category: 'Branding',
    order: 2,
  },
  {
    id: '3',
    title: 'Agency Portfolio Site',
    description: 'Minimal, typography-first website designed to let the work speak for itself.',
    image_url: null,
    video_url: null,
    client_name: 'Demo Project',
    category: 'Web Design',
    order: 3,
  },
]

// Drafted copy — edit freely
export const PROMISES: PromiseItem[] = [
  {
    id: '1',
    title: 'Built around your business',
    text: 'Every project starts with understanding how your business operates. We do not force templates, unnecessary features, or ideas that do not fit your goals. If it matters to you, it matters to us.',
  },
  {
    id: '2',
    title: 'Direct access when you need us',
    text: 'You will have our contact information and can reach out whenever questions come up. We believe good service means being available, not disappearing after the contract is signed.',
  },
  {
    id: '3',
    title: 'Clear communication from start to finish',
    text: 'You will always know where your project stands. We provide regular updates, explain what we need from you, and keep the process transparent every step of the way.',
  },
  {
    id: '4',
    title: 'No pressure, no upselling',
    text: 'We recommend what we believe will help your business, but the final decision is always yours. We will never push services you do not want or make changes you did not approve.',
  },
  {
    id: '5',
    title: 'We stick around after launch',
    text: 'Launching your website is not the end of the relationship. Whether you need updates, advice, troubleshooting, or future improvements, we are here to help long after the project is complete.',
  },
]

// Drafted FAQs — edit freely
export const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'How long does a typical project take?',
    answer:
      'Most websites take 2-4 weeks from kickoff to launch, depending on scope and business. Digital Advertising campaigns typically take 3-5 days to film, edit, and set up - then your ads run continuously, with weekly optimizations to maximize performance every step of the way. E-commerce stores take 3-4 weeks to launch from kickoff. You get a clear timeline before we start.',
  },
  {
    id: '2',
    question: 'What does a project cost?',
    answer:
      'Every project is scoped individually based on what you need. After a free consultation, you receive a fixed quote — no hourly billing surprises and no hidden fees.',
  },
  {
    id: '3',
    question: 'What do you need from me to get started?',
    answer:
      'Your goals, any existing brand materials (logo, colors, photos, videos, etc.). Don\'t worry if you\'re missing pieces - we\'ll create what doesn\'t exist yet.',
  },
  {
    id: '4',
    question: 'Can you redesign my existing website?',
    answer:
      'Yes. We audit what is working, keep what performs, and rebuild what does not. Your site stays live during the entire redesign.',
  },
  {
    id: '5',
    question: 'Do you offer ongoing maintenance?',
    answer:
      'Yes — our Management service covers updates, monitoring, content changes, and continuous improvements so your site keeps performing long after launch.',
  },
  {
    id: '6',
    question: 'Will my website work on phones?',
    answer:
      'Always. Every site we build is designed mobile-first and tested across phones, tablets, and desktops before launch.',
  },
  {
    id: '7',
    question: 'Do I own the website when it is done?',
    answer:
      'Completely. Code, design, content, and accounts are yours. No lock-in — though most clients choose to stay for ongoing management.',
  },
  {
    id: '8',
    question: 'What softwares do you use?',
    answer:
      'Modern, proven tools: React and TypeScript for the front end, Supabase for data, and fast global hosting. The result is quick, secure, and easy to maintain.',
  },
  {
    id: '9',
    question: 'How does the digital advertising process work?',
    answer:
      'We start with a 1-2 hour filming session where we capture everything we need to build multiple high-performing ad creatives. We also design static ads and flyers to run alongside video - giving your campaign more variety and reach. We handle all the editing, set up your full ad account structure, and launch your campaign - no logins necessary.',
  },
  {
    id: '10',
    question: 'How do you measure results and optimize the ads?',
    answer:
      'We track cost per lead, conversion rates, reach, engagement, and closed deals through the Meta Pixel - and share all of it with you. Ads run monthly and we optimize continuously so every dollar works harder as we go.',
  },
  {
    id: '11',
    question: 'Can I work with you even if I\'m outside of Hawai\'i?',
    answer:
      'Yes! We work with businesses everywhere. On-site filming depends on location, but everything else can be handled fully remotely.',
  },
]
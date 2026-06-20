// TypeScript data contracts — mirror SUPABASE_SCHEMA (Phase 4)

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image_url: string | null
  order: number
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  image_url: string | null
  video_url: string | null
  client_name: string | null
  category: 'Web Design' | 'Branding' | 'E-commerce' | 'Strategy'
  order: number
  url?: string | null // live site link — shown in detail modal when present
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface PromiseItem {
  id: string
  title: string
  text: string
}

export interface AppointmentInput {
  client_name: string
  client_email: string
  client_phone: string
  appointment_date: string // ISO timestamp
  notes?: string
}

export interface QuoteRequestInput {
  client_name: string
  client_email: string
  client_phone: string
  project_description: string
  budget_range?: string
  timeline?: string
}

export interface ContactMessageInput {
  name: string
  email: string
  message: string
}

// Multi-step consultation intake questionnaire (pre-booking).
// `budget_alignment` mirrors the Step-4 routing options; `status` distinguishes
// a partial gate-capture from a fully finalized submission.
export interface IntakeLeadInput {
  company_name: string
  website_url?: string | null
  target_audience?: string | null
  customer_location?: string | null
  services: string[] // growth engines selected in Step 2
  has_branding_assets?: string | null
  ad_budget?: string | null
  design_archetype?: string | null
  budget_alignment?: string | null
  email?: string | null
  phone?: string | null
  status: 'partial' | 'finalized'
}

// API layer — Supabase-backed (Phase 4).
// Content reads (team/services/portfolio) fall back to local placeholders
// if the table is empty or the request fails, so the site never renders blank.
import { supabase } from '../supabase'
import type {
  TeamMember,
  Service,
  PortfolioItem,
  AppointmentInput,
  ContactMessageInput,
  IntakeLeadInput,
} from '../types'
import { TEAM, SERVICES, PORTFOLIO } from '../data/placeholders'

async function readWithFallback<T>(table: string, fallback: T[]): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: true })
    if (error || !data || data.length === 0) {
      if (error) console.warn(`[api] ${table} read failed, using placeholders:`, error.message)
      return fallback
    }
    return data as T[]
  } catch {
    return fallback
  }
}

export function getTeam(): Promise<TeamMember[]> {
  return readWithFallback<TeamMember>('team_members', TEAM)
}

export function getServices(): Promise<Service[]> {
  return readWithFallback<Service>('services', SERVICES)
}

export function getPortfolio(): Promise<PortfolioItem[]> {
  return readWithFallback<PortfolioItem>('portfolio_items', PORTFOLIO)
}

export async function createAppointment(input: AppointmentInput): Promise<{ ok: boolean }> {
  const { error } = await supabase.from('appointments').insert({
    client_name: input.client_name,
    client_email: input.client_email,
    client_phone: input.client_phone,
    appointment_date: input.appointment_date,
    notes: input.notes ?? null,
    status: 'pending',
  })
  if (error) {
    console.error('[api] createAppointment failed:', error.message)
    throw new Error(error.message)
  }

  // Fire confirmation + team-notification emails. Non-blocking: the booking is
  // already saved, so an email failure must not surface as a booking error.
  try {
    const { error: fnError } = await supabase.functions.invoke('send-booking-emails', {
      body: {
        client_name: input.client_name,
        client_email: input.client_email,
        appointment_date: input.appointment_date,
        notes: input.notes ?? null,
      },
    })
    if (fnError) console.warn('[api] booking emails failed to send:', fnError.message)
  } catch (e) {
    console.warn('[api] booking emails threw:', e)
  }

  return { ok: true }
}

export async function createContactMessage(input: ContactMessageInput): Promise<{ ok: boolean }> {
  const { error } = await supabase.from('contact_messages').insert({
    name: input.name,
    email: input.email,
    message: input.message,
  })
  if (error) {
    console.error('[api] createContactMessage failed:', error.message)
    throw new Error(error.message)
  }
  return { ok: true }
}

// ─── Intake questionnaire (pre-booking lead capture) ─────────────────────────
// Two-phase persistence so we never lose a lead:
//   1. capturePartialIntake — fired by the Step-3 logic gate. Inserts whatever
//      we have so far and returns the row id. Never throws: a drop-off must not
//      surface as an error in the UI.
//   2. finalizeIntake — fired on final submit. Updates the partial row (by id)
//      or inserts a fresh finalized row if the partial save never landed.
// If Supabase is unreachable or the `intake_leads` table doesn't exist yet, both
// functions degrade to a console "simulated" log so the flow keeps working.

function intakeRow(input: IntakeLeadInput) {
  return {
    company_name: input.company_name,
    website_url: input.website_url ?? null,
    target_audience: input.target_audience ?? null,
    customer_location: input.customer_location ?? null,
    services: input.services,
    has_branding_assets: input.has_branding_assets ?? null,
    ad_budget: input.ad_budget ?? null,
    design_archetype: input.design_archetype ?? null,
    budget_alignment: input.budget_alignment ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    status: input.status,
  }
}

// Fire a lead-alert email to the team. Non-blocking: a lead is already saved in
// Supabase, so an email failure must never surface in the questionnaire UI.
//   event 'new'       — sent once the row is first created (after Step 1, which
//                       always has a valid email) so drop-offs are still reachable.
//   event 'completed' — sent on final submit with the full set of answers.
function notifyIntake(input: IntakeLeadInput, event: 'new' | 'completed') {
  void (async () => {
    try {
      const { error } = await supabase.functions.invoke('send-intake-emails', {
        body: { event, lead: intakeRow(input) },
      })
      if (error) console.warn('[api] intake email failed to send:', error.message)
    } catch (e) {
      console.warn('[api] intake email threw:', e)
    }
  })()
}

// All writes go through the `upsert_intake_lead` SECURITY DEFINER function, so
// the public key can create/update a lead row by id WITHOUT us granting any read
// access to the leads table. The client owns the id (generated below) so the
// same row is updated across the whole flow.
async function upsertIntake(
  id: string | null,
  input: IntakeLeadInput,
  status: IntakeLeadInput['status'],
): Promise<{ id: string | null; ok: boolean }> {
  try {
    const { data, error } = await supabase.rpc('upsert_intake_lead', {
      p_id: id,
      p_payload: intakeRow({ ...input, status }),
      p_status: status,
    })
    if (error) {
      console.warn('[api] upsertIntake simulated (no DB write):', error.message)
      return { id, ok: false }
    }
    // The function returns the row id (the one we passed, or a generated one).
    return { id: typeof data === 'string' ? data : id, ok: true }
  } catch (e) {
    console.warn('[api] upsertIntake threw, simulated:', e)
    return { id, ok: false }
  }
}

export async function capturePartialIntake(input: IntakeLeadInput): Promise<{ id: string | null }> {
  // Generate the id on the client so we can keep updating the same row later.
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : null
  const { id: savedId, ok } = await upsertIntake(id, input, 'partial')
  // Alert the team about the new lead (only when the row actually landed).
  if (ok) notifyIntake(input, 'new')
  return { id: savedId }
}

// Progressive save: refresh the existing partial row as the client advances,
// so a drop-off at any later step keeps the latest data we have (incl. email/
// phone collected early). Status stays 'partial'. No-op if we have no id.
export async function updateIntakeProgress(
  input: IntakeLeadInput,
  id: string | null,
): Promise<{ ok: boolean }> {
  if (!id) return { ok: false }
  const { ok } = await upsertIntake(id, input, 'partial')
  return { ok }
}

export async function finalizeIntake(
  input: IntakeLeadInput,
  partialId: string | null,
): Promise<{ ok: boolean }> {
  const { ok } = await upsertIntake(partialId, input, 'finalized')
  if (ok) notifyIntake(input, 'completed')
  return { ok }
}

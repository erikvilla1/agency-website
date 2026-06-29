// IntakeQuestionnaire — multi-step pre-booking consultation form for 'Iwa Media.
//
// Pipeline (5 phases tracked by the top progress bar):
//   1. Foundation   — business overview
//   2. Ecosystem    — project scope (drives the Step-4 pricing)
//   3. Visual       — design archetype selector (deferred → defaults to "N/A")
//   4. Pricing      — dynamic estimate + budget-alignment routing
//   5. Finalize     — email/phone capture + routed CTA
//
// A LOGIC GATE fires when the user advances past Step 3: it persists a partial
// lead (capturePartialIntake) so a drop-off on the pricing/finalize screens
// never costs us the lead. The final submit calls finalizeIntake.
//
// Styling note: the luxury dark palette below is intentional scaffolding — it
// will be re-skinned later. Logic and structure are the priority here.

import { useState, useMemo, useCallback, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { capturePartialIntake, updateIntakeProgress, finalizeIntake } from '../../lib/api'
import type { IntakeLeadInput } from '../../lib/types'

// ─── Config ──────────────────────────────────────────────────────────────────
// Where to send clients who are ready to book. We use the site's own in-house
// consultation calendar (/book) — no external scheduler. The questionnaire
// answers are passed along in router state so /book can use them if desired.
const BOOKING_ROUTE = '/book'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s()+\-.]{7,}$/

// Service keys are the single source of truth used by the pricing engine.
const SERVICE_SHOPIFY = 'E-Commerce Store'
const SERVICE_WEB = 'Web Design & Maintenance'
const SERVICE_META = 'Meta (FB/IG) Ad Campaigns'
const SERVICE_CONTENT = 'Content Creation & Brand Photography'

const SERVICE_OPTIONS: { key: string; label: string; blurb: string }[] = [
  { key: SERVICE_SHOPIFY, label: 'Shopify E-Commerce', blurb: 'Storefront build, product setup, conversion-ready.' },
  { key: SERVICE_WEB, label: 'Web Design & Maintenance', blurb: 'Custom site design plus ongoing upkeep.' },
  { key: SERVICE_META, label: 'Meta (FB/IG) Ad Campaigns', blurb: 'Paid social strategy, build, and management.' },
  { key: SERVICE_CONTENT, label: 'Content Creation & Brand Photography', blurb: 'Drone, video, photography, ad creative.' },
]

const LOCATION_OPTIONS = [
  'Locally within Hawaii',
  'US Mainland / Out-of-State',
  'Both Local & Mainland',
]

const BRANDING_OPTIONS = [
  'Yes, fully ready',
  'No, we need the agency to produce them',
]

const BUDGET_OPTIONS = ['Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+']

const ARCHETYPES: { key: string; title: string; desc: string }[] = [
  { key: 'Minimal Luxe', title: 'Minimal Luxe', desc: 'Quiet, editorial, lots of breathing room.' },
  { key: 'Bold Tropical', title: 'Bold Tropical', desc: 'High-contrast, vivid, energetic island feel.' },
  { key: 'Modern Corporate', title: 'Modern Corporate', desc: 'Clean, trustworthy, conversion-focused.' },
]

const ALIGNMENT_FITS = 'This pricing fits our investment budget. Let’s book the strategy call.'
const ALIGNMENT_QUESTIONS = 'I have a few questions about the pricing, but I still want to speak with your team.'
const ALIGNMENT_OUT = 'This is outside our budget right now, but save my profile for future updates.'

const STEP_LABELS = ['Foundation', 'Ecosystem', 'Visual', 'Pricing', 'Finalize']
const TOTAL_STEPS = STEP_LABELS.length

// ─── State shape ─────────────────────────────────────────────────────────────
interface FormState {
  companyName: string
  websiteUrl: string
  targetAudience: string
  customerLocation: string
  services: string[]
  hasBrandingAssets: string
  adBudget: string
  designArchetype: string // defaults to "N/A" while Step 3 is deferred
  budgetAlignment: string
  email: string
  phone: string
}

const INITIAL_STATE: FormState = {
  companyName: '',
  websiteUrl: '',
  targetAudience: '',
  customerLocation: '',
  services: [],
  hasBrandingAssets: '',
  adBudget: '',
  designArchetype: 'N/A',
  budgetAlignment: '',
  email: '',
  phone: '',
}

// ─── Pricing engine ──────────────────────────────────────────────────────────
// Pure function so pricing is easy to tweak in one place. Returns up to three
// panels plus any bundle-discount notes. All currency strings are display-ready.
interface PricePanel {
  title: string
  value: string
  note?: string
}

const BUNDLE_DISCOUNT = 0.15
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

function computePricing(services: string[]): {
  panels: PricePanel[]
  empty: boolean
} {
  const has = (k: string) => services.includes(k)
  const panels: PricePanel[] = []

  // ── Panel A: Infrastructure (one-time setup) ──
  const shopify = has(SERVICE_SHOPIFY)
  const web = has(SERVICE_WEB)
  if (shopify || web) {
    if (shopify && web) {
      // Combined range with a 15% bundle discount on the one-time setup.
      const low = (500 + 2000) * (1 - BUNDLE_DISCOUNT)
      const high = (2000 + 6000) * (1 - BUNDLE_DISCOUNT)
      panels.push({
        title: 'Your Infrastructure (One-Time Setup Fee)',
        value: `${money(low)} – ${money(high)}+`,
        note: 'Shopify + Web Design bundle — 15% combined discount applied. Includes $150/mo site maintenance.',
      })
    } else if (shopify) {
      panels.push({
        title: 'Your Infrastructure (One-Time Setup Fee)',
        value: '$500 – $2,000+',
        note: 'Shopify storefront build & product setup.',
      })
    } else {
      panels.push({
        title: 'Your Infrastructure (One-Time Setup Fee)',
        value: '$2,000 – $6,000',
        note: 'Custom web design, then $150/mo ongoing maintenance.',
      })
    }
  }

  // ── Panel B: Growth Engine (monthly retainer + Meta setup) ──
  const meta = has(SERVICE_META)
  if (meta) {
    panels.push({
      title: 'Your Growth Engine (Monthly Retainer)',
      value: '$500 – $2,000/mo',
      note: 'Ad management. One-time $1,000 to build out your entire Meta profile.',
    })
  }

  // ── Panel C: Content Creation ──
  const content = has(SERVICE_CONTENT)
  if (content) {
    if (meta) {
      // Bundled with Meta → 15% discount on the content package.
      const bundled = 1000 * (1 - BUNDLE_DISCOUNT)
      panels.push({
        title: 'Content Creation',
        value: `${money(bundled)}`,
        note: 'Drone, high-quality camera, custom flyer/ad. 15% bundle discount applied with Meta Ads.',
      })
    } else {
      panels.push({
        title: 'Content Creation',
        value: '$1,000',
        note: 'Includes drone shots, high-quality camera, and a custom flyer or ad.',
      })
    }
  }

  return { panels, empty: panels.length === 0 }
}

// ─── Reusable dark-palette field primitives ──────────────────────────────────
const fieldCls =
  'w-full rounded-lg border border-white/10 bg-stone-900/60 px-4 py-3 text-base text-stone-100 ' +
  'placeholder-slate-500 outline-none transition-all duration-300 ' +
  'focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50'

interface LabelProps {
  htmlFor?: string
  children: ReactNode
  required?: boolean
  hint?: string
}

function FieldLabel({ htmlFor, children, required, hint }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-stone-100">
      {children}
      {required && <span className="ml-1 text-emerald-400">*</span>}
      {hint && <span className="ml-2 text-xs font-normal text-slate-500">{hint}</span>}
    </label>
  )
}

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  hint?: string
  type?: string
  error?: string
}

function TextField({ id, label, value, onChange, placeholder, required, hint, type = 'text', error }: TextFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        className={fieldCls}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="mt-1.5 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface TextAreaFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  error?: string
}

function TextAreaField({ id, label, value, onChange, placeholder, required, error }: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        className={`${fieldCls} min-h-28 resize-y`}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="mt-1.5 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface RadioGroupProps {
  legend: string
  name: string
  options: string[]
  value: string
  onChange: (v: string) => void
  required?: boolean
  error?: string
}

function RadioGroup({ legend, name, options, value, onChange, required, error }: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-stone-100">
        {legend}
        {required && <span className="ml-1 text-emerald-400">*</span>}
      </legend>
      <div className="space-y-2.5">
        {options.map((opt) => {
          const selected = value === opt
          return (
            <label
              key={opt}
              className={
                'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-all duration-300 ' +
                (selected
                  ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/40'
                  : 'border-white/10 bg-stone-900/60 hover:border-white/20')
              }
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={selected}
                onChange={() => onChange(opt)}
                className="mt-1 h-4 w-4 accent-emerald-500"
              />
              <span className={selected ? 'text-stone-100' : 'text-slate-300'}>{opt}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

interface CheckboxGroupProps {
  legend: string
  options: { key: string; label: string; blurb: string }[]
  values: string[]
  onToggle: (key: string) => void
  required?: boolean
  error?: string
}

function CheckboxGroup({ legend, options, values, onToggle, required, error }: CheckboxGroupProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-stone-100">
        {legend}
        {required && <span className="ml-1 text-emerald-400">*</span>}
      </legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = values.includes(opt.key)
          return (
            <label
              key={opt.key}
              className={
                'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 transition-all duration-300 ' +
                (selected
                  ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/40'
                  : 'border-white/10 bg-stone-900/60 hover:border-white/20')
              }
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(opt.key)}
                className="mt-1 h-4 w-4 accent-emerald-500"
              />
              <span>
                <span className={'block text-sm font-medium ' + (selected ? 'text-stone-100' : 'text-slate-200')}>
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{opt.blurb}</span>
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  required?: boolean
  error?: string
}

function SelectField({ id, label, options, value, onChange, required, error }: SelectFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <select
        id={id}
        className={`${fieldCls} appearance-none`}
        value={value}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select an option…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-stone-900 text-stone-100">
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function IntakeQuestionnaire() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Id of the saved lead row. A ref (not state) so sequential Next clicks always
  // read the latest value without waiting for a re-render.
  const idRef = useRef<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key as string] ? { ...prev, [key as string]: '' } : prev))
  }, [])

  const toggleService = useCallback((key: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.includes(key)
        ? prev.services.filter((s) => s !== key)
        : [...prev.services, key],
    }))
    setErrors((prev) => (prev.services ? { ...prev, services: '' } : prev))
  }, [])

  const pricing = useMemo(() => computePricing(data.services), [data.services])

  const toInput = useCallback(
    (status: IntakeLeadInput['status']): IntakeLeadInput => ({
      company_name: data.companyName,
      website_url: data.websiteUrl || null,
      target_audience: data.targetAudience || null,
      customer_location: data.customerLocation || null,
      services: data.services,
      has_branding_assets: data.hasBrandingAssets || null,
      ad_budget: data.adBudget || null,
      design_archetype: data.designArchetype || 'N/A',
      budget_alignment: data.budgetAlignment || null,
      email: data.email || null,
      phone: data.phone || null,
      status,
    }),
    [data],
  )

  // Per-step validation. Returns true when the step is clear to advance.
  const validateStep = useCallback(
    (current: number): boolean => {
      const next: Record<string, string> = {}
      if (current === 1) {
        if (!data.companyName.trim()) next.companyName = 'Company name is required.'
        if (!data.customerLocation) next.customerLocation = 'Please choose where your customers are.'
        // Email required early so we can follow up even if they drop off later.
        if (!EMAIL_RE.test(data.email.trim())) next.email = 'Enter a valid email so we can reach you.'
      } else if (current === 2) {
        if (data.services.length === 0) next.services = 'Select at least one growth engine.'
        if (!data.hasBrandingAssets) next.hasBrandingAssets = 'Please let us know about your assets.'
        if (!data.adBudget) next.adBudget = 'Please choose an investment range.'
      } else if (current === 4) {
        if (!data.budgetAlignment) next.budgetAlignment = 'Please choose the option that fits you best.'
      } else if (current === 5) {
        if (!EMAIL_RE.test(data.email.trim())) next.email = 'Enter a valid email address.'
        if (!PHONE_RE.test(data.phone.trim())) next.phone = 'Enter a valid phone number.'
      }
      setErrors(next)
      return Object.keys(next).length === 0
    },
    [data],
  )

  const goNext = useCallback(async () => {
    if (!validateStep(step)) return

    // PROGRESSIVE SAVE: after Step 1 we already have email/phone, so create the
    // lead row immediately, then keep refreshing it on every later Next. This
    // way a drop-off at any point (e.g. the pricing screen) is still a reachable
    // lead with the latest data we collected.
    if (idRef.current === null) {
      const { id } = await capturePartialIntake(toInput('partial'))
      idRef.current = id
    } else {
      await updateIntakeProgress(toInput('partial'), idRef.current)
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }, [step, validateStep, toInput])

  const goBack = useCallback(() => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleFinalSubmit = useCallback(async () => {
    if (!validateStep(5)) return
    setSubmitting(true)
    const result = await finalizeIntake(toInput('finalized'), idRef.current)
    setSubmitting(false)

    const wantsCall =
      data.budgetAlignment === ALIGNMENT_FITS || data.budgetAlignment === ALIGNMENT_QUESTIONS

    if (wantsCall) {
      // Route to the in-house consultation calendar (/book). We pass the
      // questionnaire answers along in router state so the booking page can
      // pre-fill name/email/phone later if we wire that up.
      void result
      navigate(BOOKING_ROUTE, {
        state: {
          fromIntake: true,
          email: data.email,
          phone: data.phone,
          companyName: data.companyName,
          services: data.services,
        },
      })
    } else {
      // Option 3 → silent save + inline thank-you.
      void result
      setSavedProfile(true)
    }
  }, [validateStep, toInput, data.budgetAlignment, data.email, data.phone, data.companyName, data.services, navigate])

  const progressPct = (step / TOTAL_STEPS) * 100
  const wantsCall =
    data.budgetAlignment === ALIGNMENT_FITS || data.budgetAlignment === ALIGNMENT_QUESTIONS

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-stone-950/80 shadow-2xl shadow-black/40 backdrop-blur">
      {/* Ultra-thin progress bar */}
      <div className="h-1 w-full bg-white/5">
        <div
          className="h-full bg-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="p-6 sm:p-8">
        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Step {step} of {TOTAL_STEPS}
          </p>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
            {STEP_LABELS[step - 1]}
          </p>
        </div>

        {savedProfile ? (
          <ThankYouPanel />
        ) : (
          <>
            {step === 1 && (
              <StepShell
                title="The Foundation"
                subtitle="Tell us who you are and who you serve."
              >
                <TextField
                  id="companyName"
                  label="Company Name"
                  required
                  value={data.companyName}
                  onChange={(v) => set('companyName', v)}
                  placeholder="e.g. North Shore Surf Co."
                  error={errors.companyName}
                />
                <TextField
                  id="websiteUrl"
                  label="Current Website URL"
                  hint="optional"
                  value={data.websiteUrl}
                  onChange={(v) => set('websiteUrl', v)}
                  placeholder="https://"
                />
                <TextAreaField
                  id="targetAudience"
                  label="Target Audience / Ideal Customer Profile"
                  value={data.targetAudience}
                  onChange={(v) => set('targetAudience', v)}
                  placeholder="Who are you trying to reach?"
                />
                <RadioGroup
                  legend="Where are your primary customers located?"
                  name="customerLocation"
                  required
                  options={LOCATION_OPTIONS}
                  value={data.customerLocation}
                  onChange={(v) => set('customerLocation', v)}
                  error={errors.customerLocation}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    required
                    value={data.email}
                    onChange={(v) => set('email', v)}
                    placeholder="you@company.com"
                    error={errors.email}
                  />
                  <TextField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    hint="optional"
                    value={data.phone}
                    onChange={(v) => set('phone', v)}
                    placeholder="(808) 555-0123"
                  />
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                title="The Ecosystem"
                subtitle="What should we build and run for you?"
              >
                <CheckboxGroup
                  legend="Which core growth engines do you need?"
                  required
                  options={SERVICE_OPTIONS}
                  values={data.services}
                  onToggle={toggleService}
                  error={errors.services}
                />
                <RadioGroup
                  legend="Do you have existing high-res branding assets, logos, and product photography ready?"
                  name="hasBrandingAssets"
                  required
                  options={BRANDING_OPTIONS}
                  value={data.hasBrandingAssets}
                  onChange={(v) => set('hasBrandingAssets', v)}
                  error={errors.hasBrandingAssets}
                />
                <SelectField
                  id="adBudget"
                  label="Estimated Monthly Ad Budget / Marketing Investment"
                  required
                  options={BUDGET_OPTIONS}
                  value={data.adBudget}
                  onChange={(v) => set('adBudget', v)}
                  error={errors.adBudget}
                />
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                title="The Visual Direction"
                subtitle="A guided design-archetype selector is coming next. For now this step is optional — pick a direction if you like, or continue."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {ARCHETYPES.map((a) => {
                    const selected = data.designArchetype === a.key
                    return (
                      <button
                        type="button"
                        key={a.key}
                        onClick={() => set('designArchetype', selected ? 'N/A' : a.key)}
                        className={
                          'rounded-xl border p-4 text-left transition-all duration-300 ' +
                          (selected
                            ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/40'
                            : 'border-white/10 bg-stone-900/60 hover:border-white/20')
                        }
                      >
                        <span className="block text-sm font-semibold text-stone-100">{a.title}</span>
                        <span className="mt-1 block text-xs text-slate-500">{a.desc}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-500">
                  Current selection:{' '}
                  <span className="font-mono text-emerald-400">{data.designArchetype}</span>
                </p>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell
                title="Your Estimate"
                subtitle="Built live from the engines you selected. Final scope is confirmed on your call."
              >
                {pricing.empty ? (
                  <p className="rounded-lg border border-white/10 bg-stone-900/60 px-4 py-6 text-center text-sm text-slate-400">
                    No services selected yet. Go back to Step 2 to choose your growth engines.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pricing.panels.map((p) => (
                      <div
                        key={p.title}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
                      >
                        <p className="text-sm font-medium text-slate-400">{p.title}</p>
                        <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">{p.value}</p>
                        {p.note && <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.note}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <RadioGroup
                  legend="How does this align with your investment?"
                  name="budgetAlignment"
                  required
                  options={[ALIGNMENT_FITS, ALIGNMENT_QUESTIONS, ALIGNMENT_OUT]}
                  value={data.budgetAlignment}
                  onChange={(v) => set('budgetAlignment', v)}
                  error={errors.budgetAlignment}
                />
              </StepShell>
            )}

            {step === 5 && (
              <StepShell
                title="Confirm Your Details"
                subtitle="Double-check how we reach you, then lock it in."
              >
                <TextField
                  id="email"
                  label="Email Address"
                  type="email"
                  required
                  value={data.email}
                  onChange={(v) => set('email', v)}
                  placeholder="you@company.com"
                  error={errors.email}
                />
                <TextField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  required
                  value={data.phone}
                  onChange={(v) => set('phone', v)}
                  placeholder="(808) 555-0123"
                  error={errors.phone}
                />
              </StepShell>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors duration-300 hover:text-stone-100"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-all duration-300 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-all duration-300 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                >
                  {submitting
                    ? 'Saving…'
                    : wantsCall
                      ? 'Lock in Strategy Review & Open Calendar →'
                      : 'Save My Profile'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Presentational helpers ──────────────────────────────────────────────────
interface StepShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

function StepShell({ title, subtitle, children }: StepShellProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-stone-100">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function ThankYouPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-stone-100">Thank you for sharing your vision.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        We will keep your profile on file should our smaller framework options open up.
      </p>
    </div>
  )
}

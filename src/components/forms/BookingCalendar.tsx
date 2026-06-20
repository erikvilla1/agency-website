import { useState, useMemo, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { createAppointment } from '../../lib/api'

// ─── Availability (Pacific Time) ──────────────────────────────────────────────
const WEEKDAY_SLOTS = buildSlots(20, 23)   // Mon–Fri  8:00 pm – 10:30 pm PT
const WEEKEND_SLOTS = buildSlots(12, 20)   // Sat–Sun 12:00 pm –  7:30 pm PT
// ─────────────────────────────────────────────────────────────────────────────

const TZ_OPTIONS = [
  { label: 'Pacific (PT)',  value: 'America/Los_Angeles' },
  { label: 'Mountain (MT)', value: 'America/Denver'      },
  { label: 'Central (CT)',  value: 'America/Chicago'     },
  { label: 'Eastern (ET)',  value: 'America/New_York'    },
  { label: 'Alaska (AKT)', value: 'America/Anchorage'   },
  { label: 'Hawaii (HT)',  value: 'Pacific/Honolulu'    },
]

const MONTHS     = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_HEADERS = ['SUN','MON','TUE','WED','THU','FRI','SAT']

interface Slot { pacificHour: number; pacificMinute: number }

function buildSlots(startH: number, endH: number): Slot[] {
  const out: Slot[] = []
  for (let h = startH; h < endH; h++)
    for (const m of [0, 30])
      out.push({ pacificHour: h, pacificMinute: m })
  return out
}

function slotsForDate(d: Date): Slot[] {
  const dow = d.getDay()
  return (dow === 0 || dow === 6) ? WEEKEND_SLOTS : WEEKDAY_SLOTS
}

// Convert a Pacific-Time slot on a given calendar date → UTC Date
function slotToUTC(calDate: Date, slot: Slot): Date {
  // Find UTC offset of Pacific at noon on this date (handles DST correctly)
  const noonUTC = new Date(Date.UTC(calDate.getFullYear(), calDate.getMonth(), calDate.getDate(), 12, 0))
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(noonUTC)
  const g = (t: string) => parseInt(parts.find(p => p.type === t)!.value)
  const pacNoon = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'))
  const offsetMs = noonUTC.getTime() - pacNoon // ms that Pacific is behind UTC

  const slotMs = Date.UTC(
    calDate.getFullYear(), calDate.getMonth(), calDate.getDate(),
    slot.pacificHour, slot.pacificMinute,
  )
  return new Date(slotMs + offsetMs)
}

// Format a UTC Date in the visitor's chosen timezone
function fmtTime(utcDate: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(utcDate).toLowerCase()
}

function detectTz(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return TZ_OPTIONS.find(o => o.value === tz)?.value ?? 'America/Los_Angeles'
  } catch { return 'America/Los_Angeles' }
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate()
}
function isAvailable(d: Date) {
  const today = new Date(); today.setHours(0,0,0,0)
  return d >= today
}

type Step = 'calendar' | 'form' | 'success'

export default function BookingCalendar() {
  const today = new Date()
  const [pivot,  setPivot]  = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [picked, setPicked] = useState<Date | null>(null)
  const [slot,   setSlot]   = useState<Slot | null>(null)
  const [tz,     setTz]     = useState('America/Los_Angeles')
  const [step,   setStep]   = useState<Step>('calendar')

  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [busy,  setBusy]  = useState(false)
  const [err,   setErr]   = useState('')

  // Auto-detect on mount
  useEffect(() => { setTz(detectTz()) }, [])

  const yr  = pivot.getFullYear()
  const mo  = pivot.getMonth()
  const firstDow    = new Date(yr, mo, 1).getDay()
  const daysInMonth = new Date(yr, mo + 1, 0).getDate()

  const cells = useMemo(() => {
    const arr: (Date | null)[] = Array(firstDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(yr, mo, d))
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [yr, mo, firstDow, daysInMonth])

  const pickDate = (d: Date) => { if (isAvailable(d)) { setPicked(d); setSlot(null) } }
  const pickSlot = (s: Slot) => { setSlot(s); setStep('form') }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!picked || !slot) return
    setBusy(true); setErr('')
    try {
      await createAppointment({
        client_name:      name.trim(),
        client_email:     email.trim(),
        client_phone:     '',
        appointment_date: slotToUTC(picked, slot).toISOString(),
        notes:            notes.trim() || undefined,
      })
      setStep('success')
    } catch (e) { setErr(e instanceof Error ? e.message : 'Something went wrong') }
    finally { setBusy(false) }
  }

  const reset = () => {
    setStep('calendar'); setPicked(null); setSlot(null)
    setName(''); setEmail(''); setNotes('')
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === 'success') return (
    <div className="flex min-h-[460px] flex-col items-center justify-center gap-5 text-center px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black">
        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-black">You're booked!</h2>
        <p className="mt-2 max-w-sm text-neutral-500">
          We'll send a Google Meet link to <strong>{email}</strong> before the call. Talk soon.
        </p>
      </div>
      <button onClick={reset} className="text-sm font-medium text-neutral-400 underline underline-offset-2 hover:text-black">
        Book another time
      </button>
    </div>
  )

  // ── Form ───────────────────────────────────────────────────────────────────
  if (step === 'form' && slot && picked) {
    const utcSlot = slotToUTC(picked, slot)
    const dateStr = picked.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
    const timeStr = fmtTime(utcSlot, tz)
    const tzLabel = TZ_OPTIONS.find(o => o.value === tz)?.label ?? tz
    const inputCls = 'w-full rounded border border-neutral-200 px-3 py-2.5 text-base text-neutral-900 focus:border-black focus:outline-none'
    return (
      <div className="mx-auto max-w-md">
        <button onClick={() => setStep('calendar')}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-black">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm">
          <p className="font-semibold text-black">IWA MEDIA — Consultation</p>
          <p className="mt-0.5 text-neutral-500">{dateStr} at {timeStr} · {tzLabel}</p>
          <p className="mt-0.5 text-neutral-500">30 minutes · Google Meet</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Name</label>
            <input required value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              About your project <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="What are you looking to build? Goals, timeline, budget?"
              className={`${inputCls} resize-none`} />
          </div>
          {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
          <button type="submit" disabled={busy}
            className="w-full rounded bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60">
            {busy ? 'Confirming…' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    )
  }

  // ── Calendar ───────────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm lg:flex lg:divide-x lg:divide-neutral-200">

      {/* Left — description */}
      <div className="hidden w-64 shrink-0 flex-col p-7 lg:flex">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-black">
          <span className="text-sm font-bold tracking-wide text-white">IW</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">IWA MEDIA</p>
        <h2 className="mt-1.5 text-xl font-bold leading-snug text-black">Book a Consultation</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          Free 30-minute call. We'll learn about your goals and show you exactly how
          we can help — no pressure, no sales pitch.
        </p>
        <Link
          to="/intake"
          className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors hover:border-black"
        >
          <span>
            <span className="block text-sm font-semibold text-black">New here?</span>
            <span className="mt-0.5 block text-xs text-neutral-500">
              Take our 2-minute questionnaire first.
            </span>
          </span>
          <span className="shrink-0 text-neutral-400">→</span>
        </Link>
        <div className="mt-auto space-y-3 pt-8 text-sm text-neutral-500">
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l3.5 2"/>
            </svg>
            30 minutes
          </div>
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h11a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/>
            </svg>
            Google Meet
          </div>
        </div>
      </div>

      {/* Center — month calendar */}
      <div className="flex-1 p-6 lg:p-7">
        <div className="mb-5 flex items-center gap-4">
          <button onClick={() => setPivot(new Date(yr, mo - 1, 1))}
            className="rounded p-1.5 transition-colors hover:bg-neutral-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <span className="flex-1 text-center text-base font-semibold text-black">
            {MONTHS[mo]} <span className="font-normal text-neutral-400">{yr}</span>
          </span>
          <button onClick={() => setPivot(new Date(yr, mo + 1, 1))}
            className="rounded p-1.5 transition-colors hover:bg-neutral-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div className="mb-2 grid grid-cols-7 text-center">
          {DAY_HEADERS.map(d => (
            <span key={d} className="text-xs font-semibold text-neutral-400">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} />
            const avail    = isAvailable(d)
            const selected = picked && isSameDay(d, picked)
            const isToday  = isSameDay(d, today)
            return (
              <button key={`d-${i}`} disabled={!avail} onClick={() => pickDate(d)}
                className={[
                  'mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  selected ? 'bg-black text-white'
                  : avail  ? 'bg-neutral-100 text-black hover:bg-neutral-200'
                           : 'cursor-default text-neutral-300',
                  isToday && !selected ? 'ring-2 ring-offset-1 ring-neutral-300' : '',
                ].filter(Boolean).join(' ')}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right — timezone + time slots */}
      {picked && (
        <div className="border-t border-neutral-200 lg:w-56 lg:border-t-0">
          <div className="p-4 lg:p-5">
            <p className="mb-3 text-sm font-semibold text-black">
              {picked.toLocaleDateString('en-US', { weekday:'short', day:'numeric' })}
            </p>

            {/* Timezone selector */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-neutral-400">Timezone</label>
              <select value={tz} onChange={e => setTz(e.target.value)}
                className="w-full rounded border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-700 focus:border-black focus:outline-none">
                {TZ_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Time slots — displayed in selected timezone */}
            <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {slotsForDate(picked).map(s => {
                const utcDate = slotToUTC(picked, s)
                const label   = fmtTime(utcDate, tz)
                return (
                  <button key={`${s.pacificHour}-${s.pacificMinute}`} onClick={() => pickSlot(s)}
                    className="w-full rounded-lg border border-neutral-200 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-black hover:bg-black hover:text-white">
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

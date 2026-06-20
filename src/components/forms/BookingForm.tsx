import { useMemo, useState, type FormEvent } from 'react'
import { createAppointment } from '../../lib/api'
import Button from '../common/Button'
import { TextField, TextAreaField, FieldWrap, EMAIL_RE } from './FormInputs'

// TODO (booking details from Erik): real availability windows, slot length,
// slots per week. For now: Mon–Fri, 10:00–17:00, 1-hour slots.
const SLOT_HOURS = [10, 11, 12, 13, 14, 15, 16]

type Status = 'idle' | 'submitting' | 'success' | 'error'

function nextBusinessDays(count: number): Date[] {
  const days: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (days.length < count) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

const selectCls =
  'w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-base text-neutral-900 transition-colors duration-200 focus:border-black focus:outline-none'

export default function BookingForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [hour, setHour] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')

  const days = useMemo(() => nextBusinessDays(10), [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Please enter your name.'
    if (!EMAIL_RE.test(email)) e.email = 'Please enter a valid email address.'
    if (!phone.trim()) e.phone = 'Please enter a phone number.'
    if (!date) e.date = 'Please choose a date.'
    if (!hour) e.hour = 'Please choose a time.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    try {
      const dt = new Date(date)
      dt.setHours(Number(hour), 0, 0, 0)
      await createAppointment({
        client_name: name,
        client_email: email,
        client_phone: phone,
        appointment_date: dt.toISOString(),
        notes: notes.trim() || undefined,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded border border-neutral-200 bg-neutral-50 p-10 text-center">
        <h2 className="text-2xl font-semibold text-black">Consultation requested</h2>
        <p className="mt-3 text-neutral-600">
          Thanks, {name.split(' ')[0]}. We've received your request for{' '}
          <strong>
            {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at{' '}
            {Number(hour) > 12 ? `${Number(hour) - 12}:00 PM` : `${hour}:00 ${Number(hour) === 12 ? 'PM' : 'AM'}`}
          </strong>
          . You'll get a confirmation email shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Name"
          id="book-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          label="Email"
          id="book-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />
      </div>
      <TextField
        label="Phone"
        id="book-phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="(555) 555-5555"
        error={errors.phone}
        autoComplete="tel"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldWrap label="Date" htmlFor="book-date" error={errors.date}>
          <select id="book-date" className={selectCls} value={date} onChange={(e) => setDate(e.target.value)}>
            <option value="">Choose a date…</option>
            {days.map((d) => (
              <option key={d.toISOString()} value={d.toISOString()}>
                {d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </option>
            ))}
          </select>
        </FieldWrap>
        <FieldWrap label="Time" htmlFor="book-time" error={errors.hour}>
          <select id="book-time" className={selectCls} value={hour} onChange={(e) => setHour(e.target.value)}>
            <option value="">Choose a time…</option>
            {SLOT_HOURS.map((h) => (
              <option key={h} value={h}>
                {h > 12 ? `${h - 12}:00 PM` : `${h}:00 ${h === 12 ? 'PM' : 'AM'}`}
              </option>
            ))}
          </select>
        </FieldWrap>
      </div>
      <TextAreaField
        label="Tell us about your project (optional)"
        id="book-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What are you looking to build? Budget? Timeline?"
      />
      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
      <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto">
        {status === 'submitting' ? 'Booking…' : 'Request Consultation'}
      </Button>
    </form>
  )
}

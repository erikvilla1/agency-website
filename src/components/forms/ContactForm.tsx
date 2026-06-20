import { useState, type FormEvent } from 'react'
import { createContactMessage } from '../../lib/api'
import Button from '../common/Button'
import { TextField, TextAreaField, EMAIL_RE } from './FormInputs'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Please enter your name.'
    if (!EMAIL_RE.test(email)) e.email = 'Please enter a valid email address.'
    if (message.trim().length < 10) e.message = 'Please tell us a bit more (at least 10 characters).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    try {
      await createContactMessage({ name, email, message })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded border border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="text-lg font-semibold text-black">Message sent.</p>
        <p className="mt-2 text-neutral-600">We'll get back to you within one business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <TextField
        label="Name"
        id="contact-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        error={errors.name}
        autoComplete="name"
      />
      <TextField
        label="Email"
        id="contact-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        error={errors.email}
        autoComplete="email"
      />
      <TextAreaField
        label="Message"
        id="contact-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us about your project..."
        error={errors.message}
      />
      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}

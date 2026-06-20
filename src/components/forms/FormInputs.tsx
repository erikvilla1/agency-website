import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

const inputCls =
  'w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-base text-neutral-900 placeholder-neutral-400 transition-colors duration-200 focus:border-black focus:outline-none'

interface FieldWrapProps {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

export function FieldWrap({ label, htmlFor, error, children }: FieldWrapProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-neutral-900">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
}

export function TextField({ label, id, error, ...rest }: TextFieldProps) {
  return (
    <FieldWrap label={label} htmlFor={id} error={error}>
      <input id={id} className={inputCls} aria-invalid={!!error} {...rest} />
    </FieldWrap>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  id: string
  error?: string
}

export function TextAreaField({ label, id, error, ...rest }: TextAreaFieldProps) {
  return (
    <FieldWrap label={label} htmlFor={id} error={error}>
      <textarea id={id} className={`${inputCls} min-h-32 resize-y`} aria-invalid={!!error} {...rest} />
    </FieldWrap>
  )
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

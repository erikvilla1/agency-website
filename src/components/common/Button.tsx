import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary'

const styles: Record<Variant, string> = {
  primary:
    'bg-black text-white hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
  secondary:
    'border border-black text-black hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
}

const base =
  'inline-flex items-center justify-center rounded px-8 py-3 text-base font-semibold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  to?: string // renders as router Link when provided
  children: ReactNode
}

export default function Button({ variant = 'primary', to, children, className = '', ...rest }: ButtonProps) {
  const cls = `${base} ${styles[variant]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

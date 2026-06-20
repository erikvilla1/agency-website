import type { ReactNode } from 'react'
import Container from './Container'
import Reveal from './Reveal'

interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-20 lg:py-28 ${className}`}>
      <Container>
        {title && (
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 lg:text-4xl">{title}</h2>
            {subtitle && <p className="mt-4 text-lg leading-relaxed text-neutral-500">{subtitle}</p>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  )
}

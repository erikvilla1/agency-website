import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-8 transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${className}`}
    >
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12 ${className}`}>{children}</div>
}

import type { ReactNode } from 'react'

/* Tiny local class joiner — avoids pulling in clsx / tailwind-merge. */
function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

/* ── Inline lucide-style icons (no lucide-react dependency) ─────────────── */
const ICONS = {
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  ),
  lineChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  shoppingBag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
} as const

export interface DisplayCardProps {
  className?: string
  icon?: ReactNode
  step?: string
  title?: string
  description?: string
  date?: string
  meta?: string
}

function DisplayCard({
  className,
  icon = ICONS.layers,
  step = 'Step 1',
  title = 'Featured',
  description = '',
  date = '',
  meta,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        'relative flex h-44 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border border-white/80 bg-white/35 px-5 py-4 shadow-[0_10px_40px_-8px_rgba(74,66,58,0.25)] backdrop-blur-xl transition-all duration-700 hover:bg-white/45 [&>*]:flex [&>*]:items-center [&>*]:gap-3',
        className,
      )}
    >
      {/* top row: white glass emblem + step/title */}
      <div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/40 bg-white/60 text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.6)]">
          {icon}
        </span>
        <span className="flex flex-col items-start gap-0.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">{step}</span>
          <span className="text-xl font-semibold leading-tight text-white">{title}</span>
        </span>
      </div>

      {/* primary metric */}
      <p className="text-3xl font-bold tracking-tight text-white/90">{description}</p>

      {/* footer: date + optional meta on the right */}
      <p className="justify-between text-xs tracking-wide text-white/60">
        <span>{date}</span>
        {meta && <span className="text-white/70">{meta}</span>}
      </p>
    </div>
  )
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[]
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      icon: ICONS.layers,
      step: 'Step 1',
      title: 'Web Design & Development',
      description: '+17%',
      date: 'Jan 14, 2024',
      className: '[grid-area:stack] hover:-translate-y-10',
    },
    {
      icon: ICONS.lineChart,
      step: 'Step 2',
      title: 'Digital Advertising',
      description: '+84%',
      date: 'Dec 25, 2023',
      className: '[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1',
    },
    {
      icon: ICONS.shoppingBag,
      step: 'Step 3',
      title: 'E-Commerce Development',
      description: '+84%',
      date: 'Dec 26, 2024',
      meta: '1:1 deep time',
      className: '[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10',
    },
  ]

  const displayCards = cards ?? defaultCards

  return (
    <div className="grid place-items-center [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  )
}

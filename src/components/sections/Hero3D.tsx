import { useEffect, useState } from 'react'

/* Auto-cycling stack of 3D-tilted browser mockups (CSS 3D, no WebGL).
   Each mockup is a skeleton of a site type we build — swap for real
   screenshots later by replacing MockContent with <img>. */

type Variant = 'web' | 'store' | 'brand'

const SLIDES: { variant: Variant; label: string }[] = [
  { variant: 'web', label: 'Web Design' },
  { variant: 'store', label: 'E-commerce' },
  { variant: 'brand', label: 'Branding' },
]

function MockContent({ variant }: { variant: Variant }) {
  if (variant === 'web') {
    return (
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="h-3 w-24 rounded bg-neutral-300" />
        <div className="h-16 rounded bg-neutral-900 p-3">
          <div className="h-2 w-20 rounded bg-neutral-600" />
          <div className="mt-2 h-2 w-32 rounded bg-neutral-700" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3">
          <div className="rounded bg-neutral-200" />
          <div className="rounded bg-neutral-100" />
          <div className="rounded bg-neutral-200" />
        </div>
        <div className="h-8 w-28 rounded bg-black" />
      </div>
    )
  }
  if (variant === 'store') {
    return (
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-neutral-800" />
          <div className="h-5 w-5 rounded-full bg-neutral-300" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className={`flex-1 rounded ${i % 2 ? 'bg-neutral-100' : 'bg-neutral-200'}`} />
              <div className="h-2 w-3/4 rounded bg-neutral-300" />
              <div className="h-2 w-1/3 rounded bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-5">
      <div className="h-16 w-16 rounded-full border-4 border-black" />
      <div className="h-3 w-28 rounded bg-neutral-900" />
      <div className="h-2 w-36 rounded bg-neutral-300" />
      <div className="mt-2 flex gap-2">
        <div className="h-6 w-6 rounded bg-black" />
        <div className="h-6 w-6 rounded bg-neutral-400" />
        <div className="h-6 w-6 rounded border border-neutral-300 bg-white" />
      </div>
    </div>
  )
}

/* Position presets for stack depth 0 (front) → 2 (back) */
const POSITIONS = [
  'translate-x-0 translate-y-0 scale-100 opacity-100 z-30',
  'translate-x-[12%] -translate-y-[7%] scale-[0.93] opacity-60 z-20',
  'translate-x-[24%] -translate-y-[14%] scale-[0.86] opacity-30 z-10',
]

export default function Hero3D({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="stage-3d relative hidden aspect-[4/3] w-full select-none md:block" aria-hidden="true">
      {SLIDES.map((slide, i) => {
        const depth = (i - active + SLIDES.length) % SLIDES.length
        return (
          <div
            key={slide.variant}
            className={`card-3d absolute inset-0 ${POSITIONS[depth]}`}
            style={{ transform: undefined }}
          >
            <div
              className="h-full w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              style={{ transform: 'rotateY(-14deg) rotateX(4deg)' }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span className="ml-3 h-4 flex-1 rounded bg-white" />
              </div>
              <div className="h-[calc(100%-2.5rem)]">
                <MockContent variant={slide.variant} />
              </div>
            </div>
          </div>
        )
      })}
      {/* Slide label + dots */}
      <div className="absolute -bottom-10 left-0 flex items-center gap-3">
        <span className={`text-xs font-medium uppercase tracking-wide ${theme === 'dark' ? 'text-white/55' : 'text-neutral-400'}`}>
          {SLIDES[active].label}
        </span>
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                i === active
                  ? theme === 'dark' ? 'bg-white' : 'bg-black'
                  : theme === 'dark' ? 'bg-white/30' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

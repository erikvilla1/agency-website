import { useCallback, useEffect, useState } from 'react'
import type { PortfolioItem } from '../../lib/types'
import { getPortfolio } from '../../lib/api'
import Section from '../common/Section'
import Reveal from '../common/Reveal'
import PortfolioModal from './PortfolioModal'

const arrowCls =
  'flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-black transition-colors duration-200 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    getPortfolio().then(setItems)
  }, [])

  const n = items.length
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n])
  const next = useCallback(() => setActive((a) => (a + 1) % n), [n])

  if (n === 0) return null

  /* offset: -1 left, 0 center, +1 right (others hidden) */
  const offsetOf = (i: number) => {
    const d = (i - active + n) % n
    if (d === 0) return 0
    if (d === 1) return 1
    if (d === n - 1) return -1
    return null
  }

  return (
    <Section
      id="work"
      title="Selected Work"
      subtitle="A look at what we build. Click a project to see the full story."
      className="bg-neutral-50"
    >
      <Reveal>
        <div className="relative mx-auto h-96 max-w-3xl" role="group" aria-label="Work carousel">
          {items.map((item, i) => {
            const off = offsetOf(i)
            if (off === null) return null
            const center = off === 0
            return (
              <button
                key={item.id}
                onClick={() => (center ? setSelected(item) : off === 1 ? next() : prev())}
                aria-label={center ? `Open ${item.title}` : `Show ${item.title}`}
                className="card-3d absolute top-1/2 left-1/2 w-4/5 cursor-pointer text-left sm:w-3/5"
                style={{
                  transform: `translate(-50%, -50%) translateX(${off * 55}%) scale(${center ? 1 : 0.78})`,
                  opacity: center ? 1 : 0.45,
                  zIndex: center ? 20 : 10,
                }}
              >
                <div
                  className={`overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow duration-300 ${
                    center ? 'shadow-[0_20px_50px_rgba(0,0,0,0.12)]' : 'shadow-sm'
                  }`}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[16/10] w-full items-center justify-center bg-neutral-200">
                      <span className="text-sm text-neutral-500">{item.category}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-black">{item.title}</h3>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-neutral-400">{item.category}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={prev} className={arrowCls} aria-label="Previous project">
            ←
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  i === active ? 'bg-black' : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
          <button onClick={next} className={arrowCls} aria-label="Next project">
            →
          </button>
        </div>
      </Reveal>

      {selected && <PortfolioModal item={selected} onClose={() => setSelected(null)} />}
    </Section>
  )
}

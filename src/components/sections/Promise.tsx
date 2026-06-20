import { useEffect, useState } from 'react'
import { PROMISES } from '../../lib/data/placeholders'
import Container from '../common/Container'
import Reveal from '../common/Reveal'

const INTERVAL = 5000

// Shared frosted-glass surface (outer container + active card).
const glass = {
  background: 'rgba(255, 255, 255, 0.45)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.6)',
} as const

export default function OurPromise() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = () => setActive((a) => (a + 1) % PROMISES.length)

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section id="promise" className="bg-white py-20 lg:py-28">
      <Container>
        <Reveal>
          <div className="relative mx-auto max-w-2xl">
            {/* soft ambient glow behind the container — creates the section break */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-neutral-300/30 blur-3xl"
            />

            {/* Glass section container — wraps header, subtext, card, and dots */}
            <div
              className="relative rounded-3xl px-6 py-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] sm:px-12"
              style={glass}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Header + subtext (typography unchanged) */}
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 lg:text-4xl">
                Our Promise
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-neutral-500">
                What every client gets, on every project. No exceptions.
              </p>

              {/* Compact glass card — click anywhere to advance to the next slide */}
              <button
                type="button"
                onClick={next}
                aria-label="Next promise"
                className="mt-10 block w-full cursor-pointer text-left"
              >
                <div
                  className="relative min-h-48 rounded-2xl p-8 transition-shadow duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] sm:min-h-44"
                  style={glass}
                >
                  {PROMISES.map((p, i) => (
                    <div
                      key={p.id}
                      aria-hidden={i !== active}
                      className="absolute inset-0 flex flex-col justify-center p-8 transition-opacity duration-500"
                      style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        {String(i + 1).padStart(2, '0')} / {String(PROMISES.length).padStart(2, '0')}
                      </span>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-black">{p.title}</h3>
                      <p className="mt-3 leading-relaxed text-neutral-600">{p.text}</p>
                    </div>
                  ))}
                </div>
              </button>

              {/* Pagination dots */}
              <div className="mt-6 flex justify-center gap-2">
                {PROMISES.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(i)}
                    aria-label={`Promise ${i + 1}: ${p.title}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === active ? 'w-8 bg-black' : 'w-4 bg-neutral-300 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

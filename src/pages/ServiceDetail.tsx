import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { detailBySlug } from '../lib/data/services-detail'
import type { ServiceStep, ServiceDetail as ServiceDetailType } from '../lib/data/services-detail'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import Reveal from '../components/common/Reveal'
import ServiceArt from '../components/sections/ServiceArt'

// ─── Timeline layout helpers ───────────────────────────────────────────────

function StepMedia({ step, icon }: { step: ServiceStep; icon: string }) {
  if (step.video) {
    return (
      <video
        src={step.video}
        autoPlay
        muted
        loop
        playsInline
        className="aspect-video w-full rounded-lg border border-neutral-200 object-cover"
        aria-label={step.title}
      />
    )
  }
  if (step.image) {
    return (
      <img
        src={step.image}
        alt={step.title}
        loading="lazy"
        className="aspect-video w-full rounded-lg border border-neutral-200 object-cover"
      />
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg [&>div]:h-full">
      <ServiceArt icon={icon} />
    </div>
  )
}

function TimelineSteps({ steps, icon }: { steps: ServiceStep[]; icon: string }) {
  return (
    <ol className="mt-10 space-y-16">
      {steps.map((step, i) => (
        <li key={step.title}>
          <Reveal delay={60}>
            <div
              className={`grid items-center gap-8 lg:grid-cols-2 ${
                i % 2 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-neutral-200">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-black">{step.title}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-neutral-600">{step.text}</p>
              </div>
              <StepMedia step={step} icon={icon} />
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

// ─── Hero image / slideshow slot ──────────────────────────────────────────

function HeroImageSlot({ src, slides }: { src?: string; slides?: string[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!slides || slides.length < 2) return
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(id)
  }, [slides])

  // Slideshow — object-contain so neither image is cropped
  if (slides && slides.length >= 2) {
    return (
      <div className="mt-10 overflow-hidden rounded-xl">
        <div className="relative aspect-video w-full bg-neutral-50">
          {slides.map((s, i) => (
            <img
              key={s}
              src={s}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
                i === idx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2" aria-hidden="true">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-4 bg-black' : 'w-1.5 bg-neutral-300'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Single image — natural dimensions, no cropping
  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className="mt-10 w-full rounded-xl"
      />
    )
  }

  // Placeholder — waiting for image
  return (
    <div className="mt-10 h-56 w-full rounded-xl border border-dashed border-neutral-200 bg-neutral-50" />
  )
}

// ─── Arrow layout helpers ──────────────────────────────────────────────────

function ArrowDown() {
  return (
    <div className="flex justify-center py-4" aria-hidden="true">
      <svg width="18" height="28" viewBox="0 0 18 28" fill="none" className="text-neutral-300">
        <line x1="9" y1="0" x2="9" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <polyline
          points="3,14 9,22 15,14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function ArrowSteps({ steps }: { steps: ServiceStep[] }) {
  return (
    <div className="mx-auto mt-10 max-w-xl">
      {steps.map((step, i) => (
        <div key={step.title}>
          <Reveal delay={i * 60}>
            <div className="rounded-xl border border-neutral-100 bg-white px-8 py-7 shadow-sm">
              <div className="flex items-start gap-5">
                <span className="mt-0.5 min-w-[2.25rem] text-3xl font-bold leading-none text-neutral-200">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-black">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-500">{step.text}</p>
                </div>
              </div>
            </div>
          </Reveal>
          {i < steps.length - 1 && <ArrowDown />}
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ServiceDetail() {
  const { slug } = useParams()
  const detail: ServiceDetailType | undefined = slug ? detailBySlug(slug) : undefined

  if (!detail) {
    return (
      <section className="py-28 text-center">
        <Container>
          <h1 className="text-3xl font-semibold text-black">Service not found</h1>
          <p className="mt-4 text-neutral-500">The page you are looking for does not exist.</p>
          <div className="mt-8">
            <Button to="/#services">Back to Services</Button>
          </div>
        </Container>
      </section>
    )
  }

  const isArrow = detail.stepsLayout === 'arrow'
  const hasSlideshow = (detail.heroImages?.length ?? 0) >= 2

  return (
    <>
      {/* Hero */}
      <section className="border-b border-neutral-100 py-20 lg:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <Link
              to="/#services"
              className="text-sm text-neutral-400 transition-colors duration-200 hover:text-black"
            >
              ← All services
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-black lg:text-5xl">
              {detail.title}
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-neutral-500">{detail.intro}</p>
            {detail.exampleUrl && (
              <a
                href={detail.exampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded border border-black px-6 py-2.5 text-sm font-semibold text-black transition-colors duration-200 hover:bg-neutral-100"
              >
                {detail.exampleLabel ?? 'See a live example'} ↗
              </a>
            )}
            {isArrow && (
              <HeroImageSlot
                src={detail.heroImage}
                slides={hasSlideshow ? detail.heroImages : undefined}
              />
            )}
          </Reveal>
        </Container>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-24">
        <Container className={isArrow ? 'max-w-3xl' : 'max-w-4xl'}>
          <Reveal>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Our Process
            </h2>
          </Reveal>
          {isArrow ? (
            <ArrowSteps steps={detail.steps} />
          ) : (
            <TimelineSteps steps={detail.steps} icon={detail.icon} />
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 lg:py-20">
        <Container className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            Ready to start with {detail.title}?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-neutral-400">
            Book a free consultation — we will walk you through this exact process for your project.
          </p>
          <div className="mt-8">
            <Button to="/book" className="!bg-white !text-black hover:!bg-neutral-200">
              Book a Consultation
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

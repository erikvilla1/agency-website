// Iwa Media Hero — glassmorphic redesign
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../common/Container'

/* ──────────────────────────────────────────────────────────────────────────
   Iwa Media — Hero
   Cinematic, glassmorphic redesign.
   - Full-screen looping brand video with a dark gradient mask on the left 40%
   - Headline + vertical keyword rotator
   - White-frosted glass card stack (service steps) on the right
   Self-contained: no external icon/animation dependencies (inline SVG + CSS).
────────────────────────────────────────────────────────────────────────── */

const ROTATING_WORDS = ['WEBSITES', 'LANDING PAGES', 'PERFORMANCE'] as const

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)

  // Respect reduced-motion: hold on the first frame instead of cycling.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const w = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length), 2400)
    return () => clearInterval(w)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Scoped keyframes for the rotator */}
      <style>{`
        @keyframes iwa-word-in {
          0%   { opacity: 0; transform: translateY(110%); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        .iwa-word-in { animation: iwa-word-in 0.6s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .iwa-word-in { animation: none !important; }
        }
      `}</style>

      {/* ── 1. BACKGROUND VIDEO LAYER ─────────────────────────────────── */}
      <img
        src="/images/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        src="/videos/hero-bg.mp4"
        poster="/images/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dark gradient mask — keeps the left ~40% readable, reveals video on the right */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"
        aria-hidden="true"
      />
      {/* Subtle bottom + vignette for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"
        aria-hidden="true"
      />

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center pt-24 pb-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">

            {/* ── 2. LEFT COLUMN — typography & badges ──────────────────── */}
            <div>
              {/* Brand mark */}
              <div className="mb-8 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-white/10">
                  <img src="/favicon.svg" alt="'Iwa Media" className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold tracking-wide text-white">Honolulu, Hawai&lsquo;i</span>
              </div>

              <h1 className="text-4xl font-extrabold uppercase leading-[1.04] tracking-tight text-white sm:text-5xl xl:text-6xl">
                Local Businesses
                <br className="hidden sm:block" /> Deserve More Than
                <br className="hidden sm:block" /> Just&hellip;
              </h1>

              {/* Vertical keyword rotator */}
              <div className="mt-4 h-[1.15em] overflow-hidden text-4xl font-extrabold uppercase tracking-tight sm:text-5xl xl:text-6xl">
                <span
                  key={wordIndex}
                  className="iwa-word-in inline-block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
                >
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-white/90 hover:shadow-[0_8px_40px_rgba(255,255,255,0.3)]"
                >
                  Book a Consultation
                </Link>
                <Link
                  to="/#work"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10"
                >
                  See Our Work
                </Link>
              </div>
            </div>

            {/* ── 3. RIGHT COLUMN — intentionally empty for now ─────────── */}
            <div className="relative hidden lg:block" aria-hidden="true" />

          </div>
        </Container>
      </div>
    </section>
  )
}

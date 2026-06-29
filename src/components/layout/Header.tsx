import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AGENCY } from '../../lib/data/placeholders'
import Container from '../common/Container'

const NAV = [
  { label: 'Services', hash: '#services' },
  // { label: 'Work', hash: '#work' },  // hidden until we have real client work to show
  { label: 'About', hash: '#about' },
  { label: 'FAQ', hash: '#faq' },
  { label: 'Contact', hash: '#contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  const navHref = (hash: string) => (onHome ? hash : `/${hash}`)

  // On home page: transparent at top, solid after scrolling 80px.
  // On all other pages: always solid.
  useEffect(() => {
    if (!onHome) {
      setScrolled(true)
      return
    }
    const check = () => setScrolled(window.scrollY > 80)
    check() // run immediately on mount / route change
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [onHome])

  const transparent = onHome && !scrolled

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        transparent
          ? 'border-b border-white/10 bg-transparent'
          : 'border-b border-neutral-100 bg-white/95 shadow-sm backdrop-blur-sm'
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          to="/"
          className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
            transparent ? 'text-white' : 'text-black'
          }`}
        >
          {AGENCY.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={navHref(item.hash)}
              className={`text-sm transition-colors duration-200 ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-neutral-700 hover:text-neutral-400'
              }`}
            >
              {item.label}
            </a>
          ))}
          <span
            aria-hidden="true"
            className={`hidden h-4 w-px lg:block ${transparent ? 'bg-white/20' : 'bg-neutral-200'}`}
          />
          <a
            href={`tel:${AGENCY.phone.replace(/\s+/g, '')}`}
            className={`hidden items-center gap-1.5 text-sm transition-colors duration-200 lg:flex ${
              transparent ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-neutral-400'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            {AGENCY.phone}
          </a>
          <a
            href={`mailto:${AGENCY.email}`}
            className={`hidden items-center gap-1.5 text-sm transition-colors duration-200 xl:flex ${
              transparent ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-neutral-400'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
            {AGENCY.email}
          </a>
          <Link
            to="/book"
            className={`rounded px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              transparent
                ? 'bg-white text-black hover:bg-neutral-100'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            Book a Consultation
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`flex h-10 w-10 items-center justify-center transition-colors duration-300 md:hidden ${
            transparent ? 'text-white' : 'text-black'
          }`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="text-2xl leading-none">{open ? '×' : '☰'}</span>
        </button>
      </Container>

      {/* Mobile menu — always solid white */}
      {open && (
        <nav className="border-t border-neutral-100 bg-white md:hidden" aria-label="Mobile navigation">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={navHref(item.hash)}
              onClick={() => setOpen(false)}
              className="block border-b border-neutral-100 px-6 py-4 text-neutral-800 hover:bg-neutral-50"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/book"
            onClick={() => setOpen(false)}
            className="block px-6 py-4 font-semibold text-black hover:bg-neutral-50"
          >
            Book a Consultation
          </Link>
          <a
            href={`tel:${AGENCY.phone.replace(/\s+/g, '')}`}
            className="block border-t border-neutral-100 px-6 py-4 text-neutral-700 hover:bg-neutral-50"
          >
            {AGENCY.phone}
          </a>
          <a
            href={`mailto:${AGENCY.email}`}
            className="block px-6 py-4 text-neutral-700 hover:bg-neutral-50"
          >
            {AGENCY.email}
          </a>
        </nav>
      )}
    </header>
  )
}

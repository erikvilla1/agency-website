import { Link } from 'react-router-dom'
import { AGENCY } from '../../lib/data/placeholders'
import Container from '../common/Container'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 py-12">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-bold text-black">{AGENCY.name}</p>
          <p className="mt-1 text-sm text-neutral-500">{AGENCY.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-neutral-500 sm:items-end">
          <a href={`mailto:${AGENCY.email}`} className="hover:text-black">
            {AGENCY.email}
          </a>
          <Link to="/book" className="hover:text-black">
            Book a Consultation
          </Link>
          <p className="text-neutral-400">
            &copy; {new Date().getFullYear()} {AGENCY.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}

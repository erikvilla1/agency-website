import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
import BookingCalendar from '../components/forms/BookingCalendar'

export default function Book() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-4xl">
        {/* Mobile-only questionnaire entry — the calendar's side panel (with the
            same button) is hidden on small screens, so phone clients get it here. */}
        <Link
          to="/intake"
          className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3.5 lg:hidden"
        >
          <span>
            <span className="block text-sm font-semibold text-black">New here?</span>
            <span className="mt-0.5 block text-xs text-neutral-500">
              Take our 2-minute questionnaire so we can prep for your call.
            </span>
          </span>
          <span className="shrink-0 rounded bg-black px-3 py-2 text-xs font-semibold text-white">
            Start →
          </span>
        </Link>
        <BookingCalendar />
      </Container>
    </section>
  )
}

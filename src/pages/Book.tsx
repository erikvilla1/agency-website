import Container from '../components/common/Container'
import BookingCalendar from '../components/forms/BookingCalendar'

export default function Book() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-4xl">
        <BookingCalendar />
      </Container>
    </section>
  )
}

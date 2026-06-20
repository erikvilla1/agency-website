import { AGENCY } from '../../lib/data/placeholders'
import Section from '../common/Section'
import ContactForm from '../forms/ContactForm'

export default function Contact() {
  return (
    <Section
      id="contact"
      title="Get in Touch"
      subtitle="Questions, ideas, or a project in mind? Send us a message."
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <ContactForm />
        <div className="text-neutral-600">
          <p className="text-lg">
            Prefer email?{' '}
            <a href={`mailto:${AGENCY.email}`} className="font-medium text-black underline hover:text-neutral-500">
              {AGENCY.email}
            </a>
          </p>
          <p className="mt-4 leading-relaxed">
            Looking to start a project? The fastest way is to{' '}
            <a href="/book" className="font-medium text-black underline hover:text-neutral-500">
              book a consultation
            </a>{' '}
            — pick a time that works and we'll take it from there.
          </p>
        </div>
      </div>
    </Section>
  )
}

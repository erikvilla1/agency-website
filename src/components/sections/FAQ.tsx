import { useState } from 'react'
import { FAQS } from '../../lib/data/placeholders'
import Section from '../common/Section'
import Reveal from '../common/Reveal'

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <Section
      id="faq"
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about working with us."
      className="bg-neutral-50"
    >
      <div className="mx-auto max-w-3xl">
        {FAQS.map((faq, i) => {
          const isOpen = open === faq.id
          return (
            <Reveal key={faq.id} delay={i * 50}>
              <div className="border-b border-neutral-200">
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200 hover:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <span className="font-medium text-black">{faq.question}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-sm transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div id={`faq-panel-${faq.id}`} className={`faq-panel ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="pb-5 text-sm leading-relaxed text-neutral-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

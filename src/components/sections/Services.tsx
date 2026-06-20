import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Service } from '../../lib/types'
import { getServices } from '../../lib/api'
import { detailByIcon } from '../../lib/data/services-detail'
import Section from '../common/Section'
import Card from '../common/Card'
import Reveal from '../common/Reveal'
import ServiceArt from './ServiceArt'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getServices().then(setServices)
  }, [])

  return (
    <Section
      id="services"
      title="Services"
      subtitle="Everything you need to build, launch, and grow your digital presence. Click a service to see exactly how we work."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const detail = detailByIcon(service.icon)
          const card = (
            <Card className="group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1">
              {detail?.cardImage ? (
                <img
                  src={detail.cardImage}
                  alt={service.title}
                  className="h-40 w-full rounded object-cover"
                />
              ) : (
                <ServiceArt icon={service.icon} />
              )}
              <h3 className="mt-5 text-lg font-semibold text-black">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{service.description}</p>
              {detail && (
                <p className="mt-4 text-sm font-semibold text-black transition-colors duration-200 group-hover:text-neutral-500">
                  See our process →
                </p>
              )}
            </Card>
          )
          return (
            <Reveal key={service.id} delay={i * 80}>
              {detail ? (
                <Link to={`/services/${detail.slug}`} aria-label={`${service.title} — see our process`}>
                  {card}
                </Link>
              ) : (
                card
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

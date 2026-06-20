import { useEffect, useState } from 'react'
import type { TeamMember } from '../../lib/types'
import { getTeam } from '../../lib/api'
import { AGENCY } from '../../lib/data/placeholders'
import Section from '../common/Section'
import Card from '../common/Card'

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    getTeam().then(setTeam)
  }, [])

  return (
    <Section
      id="about"
      title={`About ${AGENCY.name}`}
      subtitle="A small team with sharp focus — design, development, and marketing under one roof. 'Iwa Media is a Honolulu-based marketing agency that generates leads, builds websites, and runs campaigns that actually grow your business. We don't disappear after launch - we become part of your team"
      className="bg-neutral-50"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.id}>
            {member.image_url ? (
              <img
                src={member.image_url}
                alt={`${member.name}, ${member.role}`}
                loading="lazy"
                className="mb-6 aspect-square w-full object-cover"
                style={member.name === 'Erik Villa' ? { filter: 'brightness(1.25) contrast(0.95)' } : undefined}
              />
            ) : (
              <div className="mb-6 flex aspect-square w-full items-center justify-center bg-neutral-100">
                <span className="text-4xl font-semibold text-neutral-300">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
            )}
            <h3 className="text-xl font-semibold text-black">{member.name}</h3>
            <p className="mt-1 text-sm font-medium text-neutral-500">{member.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">{member.bio}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

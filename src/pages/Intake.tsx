import IntakeQuestionnaire from '../components/forms/IntakeQuestionnaire'

// Preview page for the pre-booking intake questionnaire. The dark backdrop is
// scaffolding so the luxury palette reads correctly; final placement/skin TBD.
export default function Intake() {
  return (
    <section className="min-h-screen bg-stone-950 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            'Iwa Media
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-100 sm:text-4xl">
            Start Your Project
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            A few quick questions before we book your strategy call.
          </p>
        </div>
        <IntakeQuestionnaire />
      </div>
    </section>
  )
}

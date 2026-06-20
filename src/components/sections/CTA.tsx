import { lazy, Suspense } from 'react'
import Button from '../common/Button'
import Container from '../common/Container'

// Lazy-loaded so Three.js ships as its own chunk, fetched after the page
// paints instead of bloating the main bundle.
const WebGLShader = lazy(() =>
  import('../ui/web-gl-shader').then((m) => ({ default: m.WebGLShader })),
)

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-black py-20 lg:py-28">
      {/* Animated WebGL shader background */}
      <Suspense fallback={null}>
        <WebGLShader />
      </Suspense>
      {/* Subtle dark overlay keeps the headline readable over the bright wave */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      <Container className="relative z-10 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white lg:text-4xl">
          Ready to take your business to new heights?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
          Book a free consultation and tell us about your project.
        </p>
        <div className="mt-10">
          <Button
            to="/book"
            className="!bg-white !text-black hover:!bg-neutral-200"
          >
            Book a Consultation
          </Button>
        </div>
      </Container>
    </section>
  )
}

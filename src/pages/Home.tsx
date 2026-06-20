import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Services from '../components/sections/Services'
// import Portfolio from '../components/sections/Portfolio'  <- unhide when real work is ready
import OurPromise from '../components/sections/Promise'
import FAQ from '../components/sections/FAQ'
import CTA from '../components/sections/CTA'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      {/* Portfolio hidden until real client work is ready to show */}
      <OurPromise />
      <About />
      <FAQ />
      <CTA />
      <Contact />
    </>
  )
}

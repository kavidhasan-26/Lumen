import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { BlindFunnelSection } from './components/BlindFunnelSection'
import { ThreeSteps } from './components/ThreeSteps'
import { VisionStatement } from './components/VisionStatement'
import { RoadmapSection } from './components/RoadmapSection'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <BlindFunnelSection />
        <ThreeSteps />
        <VisionStatement />
        <RoadmapSection />
      </main>
      <Footer />
    </>
  )
}

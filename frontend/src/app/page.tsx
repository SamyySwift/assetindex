import Hero from '@/components/home/Hero'
import Problem from '@/components/home/Problem'
import Solution from '@/components/home/Solution'
import HowItWorks from '@/components/home/HowItWorks'
import Trust from '@/components/home/Trust'
import CTA from '@/components/home/CTA'
import Footer from '@/components/home/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-white/20">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      {/* <Trust /> */}
      <CTA />
      <Footer />
    </main>
  )
}

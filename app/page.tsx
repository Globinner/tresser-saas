import { HeroSection } from "@/components/hero-section"
import { StatsBar } from "@/components/stats-bar"
import { FeaturesGrid } from "@/components/features-grid"
import { DashboardPreview } from "@/components/dashboard-preview"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background grain overflow-hidden">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <FeaturesGrid />
      <DashboardPreview />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}

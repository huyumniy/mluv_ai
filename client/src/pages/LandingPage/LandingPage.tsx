import "./LandingPage.module.css"
import { ComparisonSection } from "./sections/ComparisonSection"
import { FeaturesStrip } from "./sections/FeaturesStrip"
import { HeroSection } from "./sections/HeroSection"

export function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesStrip />
      <ComparisonSection />
    </main>
  )
}

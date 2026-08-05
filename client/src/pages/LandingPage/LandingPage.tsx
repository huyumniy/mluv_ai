import "./LandingPage.module.css"
import { FeaturesStrip } from "./sections/FeaturesStrip"
import { HeroSection } from "./sections/HeroSection"

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesStrip />
    </>
  )
}

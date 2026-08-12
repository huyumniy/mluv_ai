import styles from "./LandingPage.module.css"
import { ComparisonSection } from "./sections/ComparisonSection"
import { DemoLessonSection } from "./sections/DemoLessonSection"
import { FeatureSection } from "./sections/FeatureShowcase"
import { FeaturesStrip } from "./sections/FeaturesStrip"
import { HeroSection } from "./sections/HeroSection"
import { PricingSection } from "./sections/PricingSection"
import { ProductFilm } from "./sections/ProductFilm"

export function LandingPage() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <FeaturesStrip />
      <ComparisonSection />
      <FeatureSection />
      <ProductFilm />
      <DemoLessonSection />
      <PricingSection />
    </main>
  )
}

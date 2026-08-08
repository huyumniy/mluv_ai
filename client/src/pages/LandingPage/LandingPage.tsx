import styles from "./LandingPage.module.css"
import { ComparisonSection } from "./sections/ComparisonSection"
import { FeatureSection } from "./sections/FeatureShowcase"
import { FeaturesStrip } from "./sections/FeaturesStrip"
import { HeroSection } from "./sections/HeroSection"
import { ProductFilm } from "./sections/ProductFilm"

export function LandingPage() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <FeaturesStrip />
      <ComparisonSection />
      <FeatureSection />
      <ProductFilm />
    </main>
  )
}

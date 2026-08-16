import styles from "./HeroSection.module.css";
import { MagicIcon } from "@/shared/assets/icons/MagicIcon";
import { ArrowLongRightIcon } from "@/shared/assets/icons/ArrowLongRightIcon";
import { Button } from "@/shared/ui/Button";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { CheckCircleIcon } from "@/shared/assets/icons/CheckCircleIcon";
import { LessonCard } from "@/entities/lesson/ui/LessonCard";
import { reflexivePronounsGrammar, restaurantLesson, restaurantTranscript, verbVocabulary } from "@/entities/lesson/model";
import RestaurantIcon from "@/shared/assets/icons/RestaurantIcon";

export function HeroSection() {
  return (
    <section id="hero-section" className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <MagicIcon />
          AI-Powered Audio Lessons
        </div>
        <div className={styles.title}>
          Generate Czech Audio Lessons in Seconds
        </div>
        <div className={styles.description}>
          Create Personalized audio lessons on any topic and level. Listen,
          learn and improve your Czech - anytime, anywhere.
        </div>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            trailingIcon={<ArrowLongRightIcon />}
          >
            Get Started For Free
          </Button>

          <Button variant="ternary" size="lg" leadingIcon={<PlayCircleIcon />}>
            Try an Example
          </Button>
        </div>
        <div className={styles.checkmarks}>
          <div className={styles.checkmark}>
            <CheckCircleIcon /> Save & Download lessons
          </div>
          <div className={styles.checkmark}>
            <CheckCircleIcon /> Works on any device
          </div>
          <div className={styles.checkmark}>
            <CheckCircleIcon /> Structured lesson notes and rules
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <img className={styles.headphones} src="/images/headphones.png" alt="headphones" />
        <LessonCard
          headerIcon={<RestaurantIcon />}
          lesson={restaurantLesson}
          grammar={reflexivePronounsGrammar}
          vocabulary={verbVocabulary}
          transcript={restaurantTranscript}
        />
      </div>
    </section>
  );
}

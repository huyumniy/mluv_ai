import styles from "./HeroSection.module.css";
import { MagicIcon } from "@/shared/assets/icons/MagicIcon";
import { ArrowLongRightIcon } from "@/shared/assets/icons/ArrowLongRightIcon";
import { Button } from "@/shared/ui/Button";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { CheckCircleIcon } from "@/shared/assets/icons/CheckCircleIcon";
import { ContinueLessonCard } from "@/entities/lesson/ui/ContinueLessonCard";
import { restaurantLesson, restaurantTranscript } from "@/entities/lesson/model";
import { reflexivePronounsGrammar } from "@/entities/lesson/model";
import { verbVocabulary } from "@/entities/lesson/model";
import { Tabs } from "@/shared/ui/Tabs";
import { LessonContentCard } from "@/entities/lesson/ui/LessonContentCard/LessonContentCard";

export function HeroSection() {
  return (
    <div className={styles.hero}>
      {/* <div className={styles.content}>
            <div className={styles.eyebrow}>
                <MagicIcon/>
                AI-Powered Audio Lessons
            </div>
            <div className={styles.title}>
                Generate Czech Audio Lessons in Seconds
            </div>
            <div className={styles.description}>
                Create Personalized audio lessons on any topic and level. 
                Listen, learn and improve your Czech - anytime, anywhere.
            </div>
            <div className={styles.actions}>
                <Button variant="primary" size="lg" trailingIcon={<ArrowLongRightIcon />}>
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
        </div> */}
      <div className={styles.content}>
        <LessonContentCard
          lesson={restaurantLesson}
          grammar={reflexivePronounsGrammar}
          vocabulary={verbVocabulary}
          transcript={restaurantTranscript}
        />
      </div>
    </div>
  );
}

import { CardSurface } from "@/shared/ui/CardSurface";
import styles from "./LessonCard.module.css";
import { LessonContentCard } from "../LessonContentCard/LessonContentCard";
import {
  reflexivePronounsGrammar,
  restaurantLesson,
  restaurantTranscript,
  verbVocabulary,
} from "../../model";
import { LessonHeader } from "../LessonHeader";
import { ClockIcon } from "@/shared/assets/icons/ClockIcon";
import { Button } from "@/shared/ui/Button";
import { AudioBar } from "@/shared/ui/AudioBar";

export function LessonCard() {
  return (
    <main>
        <CardSurface orientation="vertical" className={styles.card}>
            <LessonHeader lesson={restaurantLesson} icon={<ClockIcon />}/>
            <AudioBar lesson={restaurantLesson} className={styles.audiobar}/>
            <LessonContentCard
                lesson={restaurantLesson}
                grammar={reflexivePronounsGrammar}
                vocabulary={verbVocabulary}
                transcript={restaurantTranscript}
            />
            <hr />
            <div className={styles.actions}>
                <Button size="lg" variant="secondary" >Download</Button>
                <Button size="lg" variant="primary" >Save Lesson</Button>
            </div>
        </CardSurface>
    </main>
  );
}

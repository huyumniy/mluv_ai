import styles from "./BeforeLearningApp.module.css";
import { AudioIcon } from "@/shared/assets/icons/AudioIcon";

export default function BeforeLessonCard() {
  return (
    <section className={styles.card}>
        <div className={styles.word}>dům</div>
        <AudioIcon className={styles.audioIcon} />
        <div className={styles.wordInfo}>
            <div className={styles.translation}>House</div>
            <div className={styles.result}>1 / 10</div>
        </div>
    </section>
  );
}

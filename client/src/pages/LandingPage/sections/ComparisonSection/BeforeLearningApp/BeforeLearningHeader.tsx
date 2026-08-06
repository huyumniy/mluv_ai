import styles from "./BeforeLearningApp.module.css";
import { StarIcon } from "@/shared/assets/icons/StarIcon";
import fireImage from "@/shared/assets/images/fire.png";

export default function BeforeLearningHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.appTitle}>THE OLD WAY</div>

      <div className={styles.streaks}>
        <div className={styles.streak}>
          <img src={fireImage} alt="fireImage" />
          <div className={styles.streakText}>
            <div className={styles.streakResult}>7</div>
            <div className={styles.streakText}>day streak</div>
          </div>
        </div>
        
        <div className={styles.points}>
          <StarIcon />
          <div className={styles.pointsResult}>866</div>
        </div>
        <div className={styles.lessonCount}>
          <div className={styles.completedLessons}>12 /</div>
          <div className={styles.totalLessons}>22</div>
        </div>
      </div>
    </header>
  );
}

import { SparkleIcon } from "@/shared/assets/icons/SparkleIcon";
import BeforeLearningApp from "./BeforeLearningApp/BeforeLearningApp";
import styles from "./ComparisonSection.module.css";
import { MluvLearningApp } from "./MluvLearningApp";

export function ComparisonSection() {
  return (
    <section id="comparison" className={styles.section}>
      <header>
        <div className={styles.eyebrow}>REAL-LIFE PRACTICE</div>
            <div className={styles.title}>
                Streaks don’t speak Czech.
                <br />
                You will.
            </div>
        </header>  
      <div className={styles.comparison}>
        <BeforeLearningApp />
        <div className={styles.magicCircle}>
          <SparkleIcon />
        </div>
        <MluvLearningApp />
      </div>
    </section>
  );
}

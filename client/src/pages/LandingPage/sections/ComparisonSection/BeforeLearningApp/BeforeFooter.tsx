import styles from "./BeforeLearningApp.module.css";

export default function BeforeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.overallProgress}>
        OverallProgress
        <div className={styles.progressbar}>
          <div className={styles.progressbarInner}></div>
        </div>
      </div>
      <div className={styles.levelProgress}>
        <div className={styles.level}>Level 3</div>
        <div className={styles.experience}>320 / 500 XP</div>
      </div>
    </footer>
  );
}

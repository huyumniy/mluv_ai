import styles from "./BeforeLearningApp.module.css"

import BeforeLearningHeader from "./BeforeLearningHeader";
import BeforeLessonCard from "./BeforeLessonCard";
import BeforeQuiz from "./BeforeQuiz";
import BeforeFooter from "./BeforeFooter";

export default function BeforeLearningApp() {
  return (
    <article className={styles.app}>
        <BeforeLearningHeader />

        <BeforeLessonCard />
        
        <BeforeQuiz />

        <BeforeFooter />
    </article>
  )
}

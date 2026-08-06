import { RadioIcon } from "@/shared/assets/icons/RadioIcon"
import { Button } from "@/shared/ui/Button"
import clsx from "clsx"
import styles from "./BeforeLearningApp.module.css"

export default function BeforeQuiz() {
  return (
    <div className={styles.quiz}>
        <h5>Quick quiz</h5>
        <div className={styles.quizContainer}>
            <div className={styles.quizDescription}>
                What does this word mean?
            </div>
            <div className={styles.option}>
            <Button leadingIcon={<RadioIcon />} variant="secondary" size="sm">
                1. school
            </Button>
            </div>
            <div className={clsx(styles.option, styles.activeOption)}>
            <Button leadingIcon={<RadioIcon />} variant="secondary" size="sm">
                2. house
            </Button>
            </div>
            <div className={styles.option}>
            <Button leadingIcon={<RadioIcon />} variant="secondary" size="sm">
                3. city
            </Button>
            </div>
        </div>
    </div>
  )
}

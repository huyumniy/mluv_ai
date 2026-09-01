import {
  verbConstructionsLesson,
  restaurantLesson,
  pastTenseGrammar,
} from "@/entities/lesson/model";

import styles from "./Dashboard.module.css";

const testLessons = [
  verbConstructionsLesson,
  restaurantLesson,
  pastTenseGrammar
];

export function DashboardPage() {
  return (
    <div className={styles.container}>
      
    </div>
  );
}
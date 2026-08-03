import type { LessonHeaderProps } from "./LessonHeader.types";

import styles from "./LessonHeader.module.css";

export function LessonHeader({
  lesson,
  icon,
  menuAction,
}: LessonHeaderProps) {
  return (
    <header className={styles.header}>
      {icon && (
        <div className={styles.icon}>
          {icon}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            {lesson.title}
          </h3>

          <span className={styles.level}>
            {lesson.level}
          </span>
        </div>

        <p className={styles.meta}>
          {lesson.durationMinutes} min

          <span aria-hidden="true">·</span>

          {lesson.phraseCount} phrases
        </p>
      </div>

      {menuAction && (
        <div className={styles.menu}>
          {menuAction}
        </div>
      )}
    </header>
  );
}
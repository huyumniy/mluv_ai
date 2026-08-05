import type { LessonHeaderProps } from "./LessonHeader.types";

import styles from "./LessonHeader.module.css";
import { LevelBadge } from "@/shared/ui/LevelBadge";

export function LessonHeader({
  lesson,
  icon,
  menuAction,
}: LessonHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
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

          <LevelBadge variant={lesson.level}>{lesson.level}</LevelBadge>
        </div>

        <p className={styles.details}>
          {lesson.durationMinutes} min

          <span aria-hidden="true"> · </span>

          {lesson.phraseCount} phrases
        </p>
      </div>
      </div>

      {menuAction && (
        <div className={styles.menu}>
          {menuAction}
        </div>
      )}
    </header>
  );
}
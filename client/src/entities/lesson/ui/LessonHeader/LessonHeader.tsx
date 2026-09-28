import type { LessonHeaderProps } from "./LessonHeader.types";

import styles from "./LessonHeader.module.css";
import { LevelBadge } from "@/shared/ui/LevelBadge";
import { getLessonFolders } from "@/shared/lib/getLessonFolders";
import { lessonFolders } from "@/entities/folder/model/lesson-folder";
import { ClockIcon } from "@/shared/assets/icons/ClockIcon";
import { formatDate } from "@/shared/lib/formatDate";
import { DocumentIcon } from "@/shared/assets/icons/DocumentIcon";
import { CalendarIcon } from "@/shared/assets/icons/CalendarIcon";
export function LessonHeader({
  lesson,
  icon,
  menuAction,
  isDetailed = false,
}: LessonHeaderProps) {
  const includedFolders = getLessonFolders(lesson, lessonFolders);
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {icon && <div className={styles.icon} data-active={isDetailed === true}>{icon}</div>}

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{lesson.title}</h3>

            <LevelBadge variant={lesson.level}>{lesson.level}</LevelBadge>
          </div>

          <p className={styles.details}>
            {isDetailed && (
              <div className={styles.folders}>
                {includedFolders.map((folder, index) => (
                  <span key={folder.id}>
                    {index > 0 && " • "}
                    {folder.name}
                  </span>
                ))}
              </div>
            )}
            {isDetailed ? (
              <div className={styles.info}>
                <span className={styles.infoItem}>
                  <ClockIcon />
                  {lesson.durationMinutes} min
                </span>
                <span className={styles.infoItem}>
                  <DocumentIcon />
                  {lesson.availableFiles.map((file, index) => (
                    <span key={file}>
                      {index > 0 && " • "}
                      {file.toUpperCase()}
                    </span>
                  ))}
                </span>
                <span className={styles.infoItem}>
                  <CalendarIcon />
                  Last Updated {formatDate(lesson.updatedAt)}
                </span>
              </div>
            ) : (
              <div className={styles.info}>
                <span>{lesson.durationMinutes} min</span>
                <span aria-hidden="true"> • </span>
                <span>{lesson.phraseCount} phrases</span>
              </div>
            )}
          </p>
        </div>
      </div>

      {menuAction && <div className={styles.menu}>{menuAction}</div>}
    </header>
  );
}

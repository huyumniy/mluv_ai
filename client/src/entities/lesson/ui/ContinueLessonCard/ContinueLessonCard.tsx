import clsx from "clsx";

import { Button } from "@/shared/ui/Button";
import { CardSurface } from "@/shared/ui/CardSurface";
import { AudioBar } from "@/shared/ui/AudioBar";
import { LevelBadge } from "@/shared/ui/LevelBadge";
import { EllipsisVerticalIcon } from "@/shared/assets/icons/EllipsisVerticalIcon";

import styles from "./ContinueLessonCard.module.css";
import type { ContinueLessonCardProps } from "./ContinueLessonCard.types";

export function ContinueLessonCard({
  lesson,
  orientation = "horizontal",
  onContinue,
}: ContinueLessonCardProps) {
  return (
    <CardSurface className={clsx(styles.card)} orientation={orientation}>
      <h3 className={styles.heading}>
        Continue Learning
        <Button variant="ternary" size="sm" className={styles.moreButton}>
          <EllipsisVerticalIcon />
        </Button>
      </h3>

      <div className={styles.lesson}>
        {lesson.imageSrc && (
          <img className={styles.image} src={lesson.imageSrc} alt="" />
        )}
        <div className={styles.content}>
          <div className={styles.lessonDetails}>
            <div className={styles.lessonHeading}>
              <h4 className={styles.title}>{lesson.title}</h4>
              <LevelBadge variant={lesson.level}>{lesson.level}</LevelBadge>
            </div>
            <div className={styles.details}>
              {lesson.durationMinutes} min * {lesson.phraseCount} phrases
            </div>
          </div>
          <div className={styles.controls}>
            <AudioBar className={styles.audiobar} lesson={lesson} />
            <div className={styles.actionArea}>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onContinue(lesson.id);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardSurface>
  );
}

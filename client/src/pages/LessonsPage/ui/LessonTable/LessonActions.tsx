import type { LessonSummary } from "@/entities/lesson/model";

import { useLessonPlayer } from "@/features/lesson-player/model";

import { Button } from "@/shared/ui/Button";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { EllipsisVerticalIcon } from "@/shared/assets/icons/EllipsisVerticalIcon";

import styles from "../../LessonsPage.module.css";

interface LessonActionsProps {
  lesson: LessonSummary;

  onPlay: (lesson: LessonSummary) => void;
  onMenu: (lesson: LessonSummary) => void;
}

export function LessonActions({
  lesson,
  onPlay,
  onMenu,
}: LessonActionsProps) {
  const { isPlaying } = useLessonPlayer(lesson);

  return (
    <div className={styles.actionsButtonContainer}>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          onPlay(lesson);
        }}
        className={styles.actionsButton}
        variant="ternary"
        size="sm"
      >
        {isPlaying ? (
          <PauseCircleIcon />
        ) : (
          <PlayCircleIcon />
        )}
      </Button>

      <Button
        onClick={(event) => {
          event.stopPropagation();
          onMenu(lesson);
        }}
        className={styles.actionsButton}
        variant="ternary"
        size="sm"
      >
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
}
import type { LessonSummary } from "@/entities/lesson/model";

import { useLessonPlayer } from "@/features/lesson-player/model";

import { Button } from "@/shared/ui/Button";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { EllipsisVerticalIcon } from "@/shared/assets/icons/EllipsisVerticalIcon";

import styles from "../../LessonsPage.module.css";
import { OpenDetailedIcon } from "@/shared/assets/icons/OpenDetailedIcon";
import { Dropdown } from "@/shared/ui/Dropdown";
interface LessonActionsProps {
  lesson: LessonSummary;

  onOpen: (lesson: LessonSummary) => void;
  onPlay: (lesson: LessonSummary) => void;
}

export function LessonActions({
  lesson,
  onOpen,
  onPlay,

}: LessonActionsProps) {
  const { isPlaying } = useLessonPlayer(lesson);

  const menuItems = [
    {
      id: "rename",
      label: "Rename",
      onClick: () => {},
    },
    {
      id: "mark-listened",
      label: "Mark as listened",
      onClick: () => {},
    },
    {
      id: "delete",
      label: "Delete",
      destructive: true,
      onClick: () => {},
    },
  ];

  return (
    <div className={styles.actionsButtonContainer}>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          onOpen(lesson);
        }}
        className={styles.actionsButton}
        variant="ternary"
        size="sm"
      >
        {<OpenDetailedIcon />}
      </Button>

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

      <div
        className={styles.actionsButton}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Dropdown
          align="right"
          trigger={<EllipsisVerticalIcon />}
          items={menuItems}
        />
      </div>
    </div>
  );
}
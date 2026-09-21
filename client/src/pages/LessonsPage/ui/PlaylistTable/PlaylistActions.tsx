import type { LessonPlaylistSummary } from "@/entities/lesson/model";

import { Button } from "@/shared/ui/Button";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { EllipsisVerticalIcon } from "@/shared/assets/icons/EllipsisVerticalIcon";

import styles from "../../LessonsPage.module.css";

interface PlaylistActionsProps {
  playlist: LessonPlaylistSummary;

  onPlay: (playlist: LessonPlaylistSummary) => void;
  onMenu: (playlist: LessonPlaylistSummary) => void;
}

export function PlaylistActions({
  playlist,
  onPlay,
  onMenu,
}: PlaylistActionsProps) {

  return (
    <div className={styles.actionsButtonContainer}>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          onPlay(playlist);
        }}
        className={styles.actionsButton}
        variant="ternary"
        size="sm"
      >
        <PlayCircleIcon />
      </Button>

      <Button
        onClick={(event) => {
          event.stopPropagation();
          onMenu(playlist);
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

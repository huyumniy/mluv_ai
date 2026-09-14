import type { CSSProperties } from "react";
import type { LessonFolder } from "../../model/lesson-folder";
import styles from "./FolderCard.module.css";
import { FolderClosedIcon } from "@/shared/assets/icons/FolderClosedIcon";

interface FolderCardProps {
  folder: LessonFolder;
  lessonsCount: number;
  isActive: boolean;
  onClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

export function FolderCard({
  folder,
  lessonsCount,
  isActive,
  onClick,
  onRename,
  onDelete,
}: FolderCardProps) {
  return (
    <div data-active={isActive} className={styles.folder} onClick={onClick}>
      <div
        className={styles.folderIcon}
        style={
          {
            "--stroke-color": folder.color,
            "--folder-color": `color-mix(in srgb, ${folder.color} 30%, transparent)`,
          } as CSSProperties
        }
      >
        <FolderClosedIcon />
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{folder.name}</div>
        <div className={styles.count}>{lessonsCount} lessons</div>
      </div>
    </div>
  );
}

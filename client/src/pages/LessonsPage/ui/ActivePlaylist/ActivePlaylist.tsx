import { displayLessonFolders } from "@/entities/folder/model/lesson-folder";
import styles from "../../LessonsPage.module.css"
import type { CSSProperties } from "react";
import type { LessonPlaylistSummary } from "@/entities/lesson/model";

interface ActivePlaylistProps {
    currentPlaylist: LessonPlaylistSummary
}

export function ActivePlaylist({
    currentPlaylist,
}: ActivePlaylistProps) {
  const currentPlaylistFolder = currentPlaylist
    ? displayLessonFolders.find((folder) =>
        currentPlaylist.folderIds.includes(folder.id),
        )
    : undefined;
  return (
    <div className={styles.activePlaylist}>
        <div className={styles.infoContainer}>
        <div
            className={styles.icon}
            style={
                {
                "--lesson-color": currentPlaylistFolder?.color
                    ? `color-mix(in srgb, ${currentPlaylistFolder.color} 30%, transparent)`
                    : "var(--color-primary)",
                } as CSSProperties
            }
            >
            {currentPlaylist.imageSrc && (
            <img src={currentPlaylist.imageSrc} alt={currentPlaylist.title} />
            )}
        </div>

        <div className={styles.info}>
            <div className={styles.title}>{currentPlaylist.title}</div>

            <div className={styles.description}>{currentPlaylist.lessonIds.length} lessons in this folder</div>
        </div>
        </div>
    </div>
  )
}

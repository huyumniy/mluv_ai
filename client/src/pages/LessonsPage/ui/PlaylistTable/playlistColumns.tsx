import type { CSSProperties } from "react";

import type { Column } from "@/shared/ui/DataTable";
import styles from "../../LessonsPage.module.css";
import type { LessonPlaylistSummary } from "@/entities/lesson/model/lesson.types";
import { PlaylistActions } from "./PlaylistActions";
import { displayLessonFolders, type LessonFolder } from "@/entities/folder/model/lesson-folder";

interface CreatePlaylistColumnsParams {
  currentFolder?: LessonFolder;

  onPlaylistMenu: (playlist: LessonPlaylistSummary) => void;
  onPlaylistPlay: (playlist: LessonPlaylistSummary) => void;
}

export function createPlaylistColumns({
  currentFolder,
  onPlaylistMenu,
  onPlaylistPlay,
}: CreatePlaylistColumnsParams): Column<LessonPlaylistSummary>[] {
  return [
    {
      id: "title",
      accessorKey: "title",
      header: "Playlist",

      render: (value, playlist) => {
        const playlistFolders =
          displayLessonFolders.filter((folder) =>
            playlist.folderIds.includes(folder.id),
          );

        const displayFolder =
          currentFolder &&
          playlist.folderIds.includes(currentFolder.id)
            ? currentFolder
            : playlistFolders[0];
        return (
          <div className={styles.infoContainer}>
            <div
                className={styles.icon}
                style={
                  {
                    "--lesson-color": displayFolder?.color
                      ? `color-mix(in srgb, ${displayFolder.color} 30%, transparent)`
                      : "var(--color-primary)",
                  } as CSSProperties
                }
              >
              {playlist.imageSrc && (
                <img src={playlist.imageSrc} alt={playlist.title} />
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.title}>{String(value)}</div>

              <div className={styles.description}>{playlist.topic}</div>
            </div>
          </div>
        )
      },

      visibility: "always",
    },

    {
      id: "lessons",
      header: "Lessons",

      render: (_, playlist) => `${playlist.lessonIds.length} lessons`,

      visibility: "hide-md",
    },

    {
      id: "actions",
      header: "Actions",

      render: (_, playlist) => (
        <PlaylistActions
          playlist={playlist}
          onPlay={onPlaylistPlay}
          onMenu={onPlaylistMenu}
        />
      ),

      visibility: "always",
    },
  ];
}

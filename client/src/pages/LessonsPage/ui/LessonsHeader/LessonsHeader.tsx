import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import styles from "../../LessonsPage.module.css";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";
import type { LessonPlaylistSummary } from "@/entities/lesson/model";

interface LessonsHeaderProps {
  currentFolder?: LessonFolder;
  currentPlaylist?: LessonPlaylistSummary;
}

export function LessonsHeader({
  currentFolder,
  currentPlaylist,
}: LessonsHeaderProps) {
  const breadcrumbItems = [
    {
      label: "Lessons",
      path: currentFolder || currentPlaylist ? "/lessons" : undefined,
    },

    ...(currentFolder
      ? [
          {
            label: currentFolder.name,
          },
        ]
      : []),

    ...(currentPlaylist
      ? [
          {
            label: currentPlaylist.title,
          },
        ]
      : []),
  ];
  return (
    <div className={styles.breadcrumbsContainer}>
      <h2>Lessons Library</h2>
      <Breadcrumbs items={breadcrumbItems} />
    </div>
  );
}

import styles from "../../LessonsPage.module.css";

import { displayLessonFolders, type LessonFolder } from "@/entities/folder/model/lesson-folder";
import { getFolderLessons } from "@/entities/folder/model/lesson-folder/getFolderLessons";
import { FolderCard } from "@/entities/folder/ui/FolderCard";
import { lessonSummaries } from "@/entities/lesson/model";
import { handleHorizontalWheel } from "@/shared/lib/handleHorizontalWheel";

interface FoldersListProps {
    currentFolder: LessonFolder | undefined;
    onFolderClick: (
        folder: LessonFolder,
    ) => void;
}

export function FoldersList({
    currentFolder,
    onFolderClick,
}: FoldersListProps) {
  return (
    <section className={styles.folders} onWheel={handleHorizontalWheel}>
        {displayLessonFolders.map((folder) => {
            const folderLessons = getFolderLessons(folder, lessonSummaries);
            return (
            <FolderCard
                folder={folder}
                lessonsCount={folderLessons.length}
                isActive={folder.id === currentFolder?.id}
                onClick={() => onFolderClick(folder)}
            />
            );
        })}
    </section>
  )
}

import type { LessonSummary } from "@/entities/lesson/model";
import type { LessonFolder } from "./lessonFolder.types";

export function getLessonFolders(
    lesson: LessonSummary,
    folders: LessonFolder[],
) {
    return folders.filter((folder) => 
        lesson.folderIds.includes(folder.id),
    );
}

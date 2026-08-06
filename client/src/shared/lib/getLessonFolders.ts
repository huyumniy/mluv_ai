import type { LessonFolder } from "@/entities/folder/model/lesson-folder";
import type { LessonSummary } from "@/entities/lesson/model";

export function getLessonFolders(
    lesson: LessonSummary,
    folders: LessonFolder[],
): LessonFolder[] {
    return folders.filter((folder) => lesson.folderIds.includes(folder.id))
}

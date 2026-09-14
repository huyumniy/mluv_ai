import type { LessonSummary } from "@/entities/lesson/model";
import type { LessonFolder } from "./lessonFolder.types";

export function getFolderLessons(
    folder: LessonFolder,
    lessons: LessonSummary[],
) {
    if (folder.id === "all-lessons") {
        return lessons;
    }

    return lessons.filter((lesson) => 
        lesson.folderIds.includes(folder.id),
    );
}

import type { LessonPlaylistSummary, LessonSummary } from "./lesson.types";

export function getPlaylistLessons(
  playlist: LessonPlaylistSummary,
  lessons: LessonSummary[],
) {
  return playlist.lessonIds
    .map((lessonId) =>
      lessons.find(
        (lesson) =>
          lesson.id === lessonId,
      ),
    )
    .filter(
      (lesson): lesson is LessonSummary =>
        Boolean(lesson),
    );
}

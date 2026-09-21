import { DataTable } from "@/shared/ui/DataTable";
import type { LessonSummary } from "@/entities/lesson/model";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";

import { createLessonColumns } from "./lessonColumns";

interface LessonTableProps {
  lessons: LessonSummary[];
  currentFolder?: LessonFolder;

  activeLessonId?: string;

  onLessonClick: (lesson: LessonSummary) => void;
  onLessonMenu: (lesson: LessonSummary) => void;
  onLessonPlay: (lesson: LessonSummary) => void;

}

export function LessonTable({
  lessons,
  currentFolder,
  activeLessonId,
  onLessonClick,
  onLessonMenu,
  onLessonPlay,
}: LessonTableProps) {
  const columns = createLessonColumns({
    currentFolder,
    onLessonMenu,
    onLessonPlay,
  });

  return (
    <DataTable
      data={lessons}
      columns={columns}
      onRowClick={onLessonClick}
      activeRowId={activeLessonId}
    />
  );
}
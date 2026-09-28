import { DataTable } from "@/shared/ui/DataTable";
import type { LessonSummary } from "@/entities/lesson/model";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";

import { createLessonColumns } from "./lessonColumns";

interface LessonTableProps {
  lessons: LessonSummary[];
  currentFolder?: LessonFolder;

  activeLessonId?: string;

  onOpen: (lesson: LessonSummary) => void;
  onClick: (lesson: LessonSummary) => void;
  onPlay: (lesson: LessonSummary) => void;

}

export function LessonTable({
  lessons,
  currentFolder,
  activeLessonId,
  onOpen,
  onClick,
  onPlay,
}: LessonTableProps) {
  const columns = createLessonColumns({
    currentFolder,
    onOpen,
    onPlay,
  });

  return (
    <DataTable
      data={lessons}
      columns={columns}
      onRowClick={onClick}
      activeRowId={activeLessonId}
    />
  );
}
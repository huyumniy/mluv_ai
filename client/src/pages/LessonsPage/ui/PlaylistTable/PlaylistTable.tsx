import { DataTable } from "@/shared/ui/DataTable";

import { createPlaylistColumns } from "./playlistColumns";

import type { LessonPlaylistSummary } from "@/entities/lesson/model/lesson.types";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";

interface PlaylistTableProps {
  playlists: LessonPlaylistSummary[];
  currentFolder?: LessonFolder;
  activeLessonId?: string;

  onClick: (playlist: LessonPlaylistSummary) => void;
  onMenu: (playlist: LessonPlaylistSummary) => void;
  onPlay: (playlist: LessonPlaylistSummary) => void;
}

export function PlaylistTable({
  playlists,
  currentFolder,
  onClick,
  onMenu,
  onPlay,
}: PlaylistTableProps) {
  const columns = createPlaylistColumns({
    currentFolder,
    onMenu,
    onPlay,
  });

  return (
    <DataTable
        data={playlists}
        columns={columns}
        onRowClick={onClick}
    />
  );
}
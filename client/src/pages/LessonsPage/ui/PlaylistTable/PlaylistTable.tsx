import { DataTable } from "@/shared/ui/DataTable";

import { createPlaylistColumns } from "./playlistColumns";

import type { LessonPlaylistSummary } from "@/entities/lesson/model/lesson.types";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";

interface PlaylistTableProps {
  playlists: LessonPlaylistSummary[];
  currentFolder?: LessonFolder;
  activeLessonId?: string;

  onPlaylistClick: (playlist: LessonPlaylistSummary) => void;
  onPlaylistMenu: (playlist: LessonPlaylistSummary) => void;
  onPlaylistPlay: (playlist: LessonPlaylistSummary) => void;
}

export function PlaylistTable({
  playlists,
  currentFolder,
  onPlaylistClick,
  onPlaylistMenu,
  onPlaylistPlay,
}: PlaylistTableProps) {
  const columns = createPlaylistColumns({
    currentFolder,
    onPlaylistMenu,
    onPlaylistPlay,
  });

  return (
    <DataTable
        data={playlists}
        columns={columns}
        onRowClick={onPlaylistClick}
    />
  );
}
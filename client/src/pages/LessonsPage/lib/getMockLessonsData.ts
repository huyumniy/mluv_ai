import { displayLessonFolders } from "@/entities/folder/model/lesson-folder/lessonFolder.mock";
import { getPlaylistLessons } from "@/entities/lesson/model/getPlaylistLessons";
import { lessonPlaylists, lessonSummaries } from "@/entities/lesson/model/mocks/lesson.mock";
import type { LessonsQuery } from "../LessonPage.types";

export function getMockLessonsData(query: LessonsQuery,) {  
    const currentFolder = query.folderId
      ? (displayLessonFolders.find(
          (folder) => folder.id === query.folderId)
        )
      : undefined;
    const currentPlaylist = query.playlistId
      ? lessonPlaylists.find(
          (playlist) => playlist.id === query.playlistId,
        )
      : undefined;

    const playlists = currentFolder
        ? lessonPlaylists.filter((playlist) =>
            playlist.folderIds.includes(currentFolder.id),
        )
        : lessonPlaylists;

    const lessons = currentPlaylist
        ? getPlaylistLessons(
            currentPlaylist,
            lessonSummaries,
        )
        : currentFolder
        ? lessonSummaries.filter((lesson) =>
            lesson.folderIds.includes(currentFolder.id),
            )
        : [];

    return {
        currentFolder,
        currentPlaylist,

        playlists,
        lessons,
    }
}

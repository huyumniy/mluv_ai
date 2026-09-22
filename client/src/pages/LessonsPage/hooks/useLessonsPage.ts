import { displayLessonFolders } from "@/entities/folder/model/lesson-folder/lessonFolder.mock";
import { getPlaylistLessons } from "@/entities/lesson/model/getPlaylistLessons";
import { lessonPlaylists, lessonSummaries } from "@/entities/lesson/model/mocks/lesson.mock";
import { useParams } from "react-router";

export function useLessonsPage() {  
    const { folderId, playlistId } = useParams();
    const currentFolder = folderId
      ? (displayLessonFolders.find(
          (folder) => folder.id === folderId)
        )
      : undefined;
    const currentPlaylist = playlistId
      ? lessonPlaylists.find(
          (playlist) => playlist.id === playlistId,
        )
      : undefined;
    
    const isFolderView = Boolean(currentFolder);
    const isPlaylistView = Boolean(currentPlaylist);
    const isRootView = !isFolderView && !isPlaylistView;

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

        isFolderView,
        isPlaylistView,
        isRootView,
    }
}

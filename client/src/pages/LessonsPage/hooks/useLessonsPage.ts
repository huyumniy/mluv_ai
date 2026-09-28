import { useParams, useSearchParams } from "react-router";
import type { LessonsQuery, LessonTab } from "../LessonPage.types";

const lessonTabs: LessonTab[] = [
    "all-lessons",
    "my-library",
    "explore-lessons",
    "saved",
];

function isLessonTab(value: string | null): value is LessonTab {
    return lessonTabs.includes(value as LessonTab)
}

export function useLessonsPage() {  
    const { folderId, playlistId } = useParams();
    const [searchParams] = useSearchParams();
    const viewParam = searchParams.get("view");

    const activeView = isLessonTab(viewParam)
        ? viewParam
        : "all-lessons";
    
    const isFolderView = Boolean(folderId);
    const isPlaylistView = Boolean(playlistId);
    const isRootView = !isFolderView && !isPlaylistView;
    

    const query: LessonsQuery = {
        view: activeView,
        folderId,
        playlistId,
    };

    return {
        query,

        activeView,

        folderId,
        playlistId,

        isFolderView,
        isPlaylistView,
        isRootView,
    }
}

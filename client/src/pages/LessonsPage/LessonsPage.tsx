import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import styles from "./LessonsPage.module.css";

import { useLessonPlayer } from "@/features/lesson-player/model";
import { useLessonsPage } from "./hooks/useLessonsPage";

import { Tabs, type TabItem } from "@/shared/ui/Tabs";

import { LessonCard } from "@/entities/lesson/ui/LessonCard";
import {
  type LessonSummary,
  type LessonPlaylistSummary,
  lessonSummaries,
} from "@/entities/lesson/model";
import { type LessonFolder } from "@/entities/folder/model/lesson-folder";

import { PlaylistTable } from "./ui/PlaylistTable";
import { LessonTable } from "./ui/LessonTable";
import { LessonsHeader } from "./ui/LessonsHeader/LessonsHeader";
import { FoldersList } from "./ui/FoldersList";
import { getPlaylistLessons } from "@/entities/lesson/model/getPlaylistLessons";
import { ActivePlaylist } from "./ui/ActivePlaylist";
import { Pagination, usePagination } from "@/shared/ui/Pagination";
import type { LessonTab } from "./LessonPage.types";
import { getMockLessonsData } from "./lib/getMockLessonsData";

const tabItems: TabItem<LessonTab>[] = [
  {
    value: "all-lessons",
    label: "All Lessons",
  },
  {
    value: "my-library",
    label: "My Library",
  },
  {
    value: "explore-lessons",
    label: "Explore Lessons",
  },
  {
    value: "saved",
    label: "Saved",
  },
];

export function LessonsPage() {
  const [, setSearchParams] = useSearchParams();
  const { activeLesson, playLesson, playQueue } = useLessonPlayer();
  const navigate = useNavigate();

  const {
    query,
    activeView,

    isFolderView,
    isPlaylistView,
    isRootView,
  } = useLessonsPage();

  const { lessons, playlists, currentPlaylist, currentFolder } =
    getMockLessonsData(query);

  const totalItems = isFolderView
    ? playlists.length + lessons.length
    : isPlaylistView
      ? lessons.length
      : playlists.length;

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    firstItemIndex,
    lastItemIndex,
  } = usePagination({ totalItems, itemsPerPage: 8 });

  const currentPlaylists = isRootView
    ? playlists.slice(firstItemIndex, lastItemIndex)
    : isFolderView
      ? playlists.slice(
          firstItemIndex,
          Math.min(lastItemIndex, playlists.length),
        )
      : [];

  const currentLessons = isPlaylistView
    ? lessons.slice(firstItemIndex, lastItemIndex)
    : isFolderView
      ? lessons.slice(
          Math.max(0, firstItemIndex - playlists.length),
          Math.max(0, lastItemIndex - playlists.length),
        )
      : [];

  const handleTabChange = (tab: LessonTab) => {
    if (tab === "all-lessons") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      view: tab,
    });
  };

  const handleFolderClick = (folder: LessonFolder) => {
    if (folder.id === "all-lessons") {
      navigate("/lessons");
      return;
    }

    navigate(`/lessons/folders/${folder.id}`);
  };

  const handlePlaylistClick = (playlist: LessonPlaylistSummary) => {
    navigate(`/lessons/playlists/${playlist.id}`);
  };

  const handleLessonClick = (lesson: LessonSummary) => {
    playLesson(lesson);
  };

  const handleLessonPlay = (lesson: LessonSummary) => {
    if (currentPlaylist) {
      const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);

      playQueue(lessons, lessonIndex);
      return;
    }

    playQueue([lesson]);
  };

  const handleLessonOpen = (lesson: LessonSummary) => {
    const breadcrumbs = [
      {
        label: "Lessons",
        path: "/lessons",
      },

      ...(currentFolder
        ? [
            {
              label: currentFolder.name,
              path: `/lessons/folders/${currentFolder.id}`,
            },
          ]
        : []),

      ...(currentPlaylist
        ? [
            {
              label: currentPlaylist.title,
              path: `/lessons/playlists/${currentPlaylist.id}`,
            },
          ]
        : []),
    ];
    navigate(`/lessons/${lesson.id}`, {
      state: {
        breadcrumbs,
      },
    });
  };

  const handlePlaylistMenu = (playlist: LessonPlaylistSummary) => {
    console.log("menu", playlist);
  };

  const handlePlaylistPlay = (playlist: LessonPlaylistSummary) => {
    const playlistLessons = getPlaylistLessons(playlist, lessonSummaries);

    playQueue(playlistLessons);
    navigate(`/lessons/playlists/${playlist.id}`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [currentFolder?.id, currentPlaylist?.id, setCurrentPage]);

  return (
    <div className={styles.container}>
      <LessonsHeader
        currentFolder={currentFolder}
        currentPlaylist={currentPlaylist}
      />
      <main className={styles.content}>
        <div className={styles.libraryContainer}>
          <Tabs<LessonTab>
            items={tabItems}
            value={activeView}
            onValueChange={handleTabChange}
            ariaLabel="Lesson content"
            className={styles.tabs}
          />
          {!currentFolder && currentPlaylist && (
            <ActivePlaylist currentPlaylist={currentPlaylist} />
          )}
          {(currentFolder || !currentFolder) && !currentPlaylist && (
            <FoldersList
              currentFolder={currentFolder}
              onFolderClick={handleFolderClick}
            />
          )}

          {/* Root /lessons */}
          {!isFolderView && !isPlaylistView && (
            <PlaylistTable
              playlists={currentPlaylists}
              currentFolder={currentFolder}
              onClick={handlePlaylistClick}
              onMenu={handlePlaylistMenu}
              onPlay={handlePlaylistPlay}
            />
          )}

          {/* /lessons/folders/:folderId */}
          {isFolderView && (
            <>
              <PlaylistTable
                playlists={currentPlaylists}
                currentFolder={currentFolder}
                onClick={handlePlaylistClick}
                onMenu={handlePlaylistMenu}
                onPlay={handlePlaylistPlay}
              />

              <LessonTable
                lessons={currentLessons}
                currentFolder={currentFolder}
                activeLessonId={activeLesson?.id}
                onOpen={handleLessonOpen}
                onClick={handleLessonClick}
                onPlay={handleLessonPlay}
              />
            </>
          )}

          {/* /lessons/playlists/:playlistId */}
          {isPlaylistView && (
            <LessonTable
              lessons={currentLessons}
              activeLessonId={activeLesson?.id}
              onOpen={handleLessonOpen}
              onClick={handleLessonClick}
              onPlay={handleLessonPlay}
            />
          )}
          <div className={styles.paginationContainer}>
            <div className={styles.paginationInfo}>
              {(currentPage - 1) * itemsPerPage + 1} {" - "}{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} {" of "}{" "}
              {totalItems}
            </div>
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
        <div className={styles.wideCardContainer}>
          {activeLesson && (
            <LessonCard
              headerIcon={
                <img src={activeLesson?.imageSrc} alt={activeLesson?.title} />
              }
              lesson={activeLesson}
              fixedHeight={false}
              isDetailed={false}
              showActions={false}
            />
          )}
        </div>
      </main>
    </div>
  );
}

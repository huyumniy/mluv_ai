import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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

type LessonTab = "all-lessons" | "my-library" | "explore-lessons" | "saved";

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
  const [activeTab, setActiveTab] = useState<LessonTab>("all-lessons");
  const { activeLesson, playLesson, playQueue } = useLessonPlayer();
  const navigate = useNavigate();

  const {
    currentFolder,
    currentPlaylist,

    playlists,
    lessons,

    isFolderView,
    isPlaylistView,
    isRootView,
  } = useLessonsPage();

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

  const handleLessonMenu = (lesson: LessonSummary) => {
    console.log("menu", lesson);
  };

  const handleLessonPlay = (lesson: LessonSummary) => {
    if (currentPlaylist) {
      const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);

      playQueue(lessons, lessonIndex);
      return;
    }

    playQueue([lesson]);
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
  }, [currentFolder?.id, currentPlaylist?.id]);

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
            value={activeTab}
            onValueChange={setActiveTab}
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
          {/* <Sort /> */}

          {/* Root /lessons */}
          {!isFolderView && !isPlaylistView && (
            <PlaylistTable
              playlists={currentPlaylists}
              currentFolder={currentFolder}
              onPlaylistClick={handlePlaylistClick}
              onPlaylistMenu={handlePlaylistMenu}
              onPlaylistPlay={handlePlaylistPlay}
            />
          )}

          {/* /lessons/folders/:folderId */}
          {isFolderView && (
            <>
              <PlaylistTable
                playlists={currentPlaylists}
                currentFolder={currentFolder}
                onPlaylistClick={handlePlaylistClick}
                onPlaylistMenu={handlePlaylistMenu}
                onPlaylistPlay={handlePlaylistPlay}
              />

              <LessonTable
                lessons={currentLessons}
                currentFolder={currentFolder}
                activeLessonId={activeLesson?.id}
                onLessonClick={handleLessonClick}
                onLessonMenu={handleLessonMenu}
                onLessonPlay={handleLessonPlay}
              />
            </>
          )}

          {/* /lessons/playlists/:playlistId */}
          {isPlaylistView && (
            <LessonTable
              lessons={currentLessons}
              activeLessonId={activeLesson?.id}
              onLessonClick={handleLessonClick}
              onLessonMenu={handleLessonMenu}
              onLessonPlay={handleLessonPlay}
            />
          )}

          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
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

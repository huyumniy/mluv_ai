import { useState, type CSSProperties } from "react";
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
import { displayLessonFolders, type LessonFolder } from "@/entities/folder/model/lesson-folder";

import { PlaylistTable } from "./ui/PlaylistTable";
import { LessonTable } from "./ui/LessonTable";
import { LessonsHeader } from "./ui/LessonsHeader/LessonsHeader";
import { FoldersList } from "./ui/FoldersList";
import { getPlaylistLessons } from "@/entities/lesson/model/getPlaylistLessons";

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
  } = useLessonsPage();
  const currentPlaylistFolder = currentPlaylist
    ? displayLessonFolders.find((folder) =>
        currentPlaylist.folderIds.includes(folder.id),
      )
    : undefined;

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
      const lessonIndex = lessons.findIndex(
        (item) => item.id === lesson.id
      );

      playQueue(lessons, lessonIndex);
      return
    }

    playQueue([lesson]);
  }

  const handlePlaylistMenu = (playlist: LessonPlaylistSummary) => {
    console.log("menu", playlist);
  };

  const handlePlaylistPlay = (playlist: LessonPlaylistSummary) => {
    const playlistLessons = getPlaylistLessons(playlist, lessonSummaries);

    playQueue(playlistLessons);
    navigate(`/lessons/playlists/${playlist.id}`);
  }


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
            <div className={styles.activePlaylist}>
              <div className={styles.infoContainer}>
                <div
                    className={styles.icon}
                    style={
                      {
                        "--lesson-color": currentPlaylistFolder?.color
                          ? `color-mix(in srgb, ${currentPlaylistFolder.color} 30%, transparent)`
                          : "var(--color-primary)",
                      } as CSSProperties
                    }
                  >
                  {currentPlaylist.imageSrc && (
                    <img src={currentPlaylist.imageSrc} alt={currentPlaylist.title} />
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.title}>{currentPlaylist.title}</div>

                  <div className={styles.description}>{currentPlaylist.lessonIds.length} lessons in this folder</div>
                </div>
              </div>
            </div>
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
              playlists={playlists}
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
                playlists={playlists}
                currentFolder={currentFolder}
                onPlaylistClick={handlePlaylistClick}
                onPlaylistMenu={handlePlaylistMenu}
                onPlaylistPlay={handlePlaylistPlay}
              />

              <LessonTable
                lessons={lessons}
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
              lessons={lessons}
              activeLessonId={activeLesson?.id}
              onLessonClick={handleLessonClick}
              onLessonMenu={handleLessonMenu}
              onLessonPlay={handleLessonPlay}
            />
          )}

          {/* <Pagination /> */}
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

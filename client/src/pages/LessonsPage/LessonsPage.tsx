import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import styles from "./LessonsPage.module.css";
import { Tabs, type TabItem } from "@/shared/ui/Tabs";
import { useState } from "react";
import { useLessonPlayer } from "@/features/lesson-player/model";
import { LessonCard } from "@/entities/lesson/ui/LessonCard";
import { FolderCard } from "@/entities/folder/ui/FolderCard";
import {
  allLessonsFolder,
  displayLessonFolders,
} from "@/entities/folder/model/lesson-folder/lessonFolder.mock";
import { getFolderLessons } from "@/entities/folder/model/lesson-folder/getFolderLessons";
import { lessonSummaries } from "@/entities/lesson/model";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";
import { useNavigate, useParams } from "react-router";
import { handleHorizontalWheel } from "@/shared/lib/handleHorizontalWheel";

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
  const { activeLesson } = useLessonPlayer();

  const navigate = useNavigate();
  const { folderId } = useParams();
  const currentFolder = folderId
    ? displayLessonFolders.find((folder) => folder.id === folderId)
    : allLessonsFolder;

  const handleFolderClick = (folder: LessonFolder) => {
    if (folder.id === "all-lessons") {
      navigate("/lessons");
      return;
    }

    navigate(`/lessons/folders/${folder.id}`);
  };

  const breadcrumbItems = [
    {
      label: "Lessons",
      path: "/lessons",
    },
    {
      label: currentFolder?.name,
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbsContainer}>
        <h2>Lessons Library</h2>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <main className={styles.content}>
        <div className={styles.libraryContainer}>
          <Tabs<LessonTab>
            items={tabItems}
            value={activeTab}
            onValueChange={setActiveTab}
            ariaLabel="Lesson content"
            className={styles.tabs}
          />
          <section className={styles.folders} onWheel={handleHorizontalWheel}>
            {displayLessonFolders.map((folder) => {
              const folderLessons = getFolderLessons(folder, lessonSummaries);
              return (
                <FolderCard
                  folder={folder}
                  lessonsCount={folderLessons.length}
                  isActive={folder.id === currentFolder?.id}
                  onClick={() => handleFolderClick(folder)}
                />
              );
            })}
          </section>
          {/* <Sort />
          <Table />
          <Pagination /> */}
        </div>
        <div className={styles.wideCardContainer}>
          {activeLesson && (
            <LessonCard
              headerIcon={
                <img src={activeLesson?.imageSrc} alt={activeLesson?.title} />
              }
              lesson={activeLesson}
              showActions={false}
            />
          )}
        </div>
      </main>
    </div>
  );
}

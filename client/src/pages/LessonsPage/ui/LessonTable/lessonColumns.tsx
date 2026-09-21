import type { CSSProperties } from "react";

import type { Column } from "@/shared/ui/DataTable";
import type { LessonSummary } from "@/entities/lesson/model";
import type { LessonFolder } from "@/entities/folder/model/lesson-folder";

import { displayLessonFolders } from "@/entities/folder/model/lesson-folder/lessonFolder.mock";
import { getLessonFolders } from "@/entities/folder/model/lesson-folder/getLessonsFolder";

import { LevelBadge } from "@/shared/ui/LevelBadge";
import { StatusTag } from "@/shared/ui/StatusTag";

import styles from "../../LessonsPage.module.css";
import { LessonActions } from "./LessonActions";

interface CreateLessonColumnsParams {
  currentFolder?: LessonFolder;
  onLessonMenu: (lesson: LessonSummary) => void;
  onLessonPlay: (lesson: LessonSummary) => void;
}

export function createLessonColumns({
  currentFolder,
  onLessonMenu,
  onLessonPlay,
}: CreateLessonColumnsParams): Column<LessonSummary>[] {
  return [
    {
      id: "title",
      accessorKey: "title",
      header: "Lesson",

      render: (value, lesson) => {
        const lessonFolders = getLessonFolders(
          lesson,
          displayLessonFolders,
        );

        const displayFolder =
          currentFolder &&
          lesson.folderIds.includes(currentFolder.id)
            ? currentFolder
            : lessonFolders[0];

        return (
          <div className={styles.infoContainer}>
            <div
              className={styles.icon}
              style={
                {
                  "--lesson-color": displayFolder?.color
                    ? `color-mix(in srgb, ${displayFolder.color} 30%, transparent)`
                    : "var(--color-primary)",
                } as CSSProperties
              }
            >
              {lesson.imageSrc && (
                <img
                  src={lesson.imageSrc}
                  alt={lesson.title}
                />
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.title}>
                {String(value)}
              </div>

              <div className={styles.description}>
                {lesson.topic}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      id: "duration",
      accessorKey: "durationMinutes",
      header: "Duration",
      render: (value) => `${value} min`,
      visibility: "hide-md",
    },

    {
      id: "level",
      accessorKey: "level",
      header: "Level",

      render: (value) => (
        <LevelBadge variant={value}>
          {value}
        </LevelBadge>
      ),

      visibility: "hide-sm",
    },

    {
      id: "status",
      accessorKey: "status",
      header: "Status",

      render: (value) => (
        <StatusTag variant={value}>
          {value}
        </StatusTag>
      ),

      visibility: "hide-md",
    },

    {
      id: "actions",
      header: "Actions",

      render: (_, lesson) => (
        <LessonActions
          lesson={lesson}
          onPlay={onLessonPlay}
          onMenu={onLessonMenu} 
        />
      ),
      visibility: "always",
    },
  ];
}
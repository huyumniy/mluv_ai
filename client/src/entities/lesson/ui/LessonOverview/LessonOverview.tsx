import styles from "./LessonOverview.module.css";

import type { LessonSummary } from "../../model";

import { FolderIcon } from "@/shared/assets/icons/FolderIcon";
import { ChartsIcon } from "@/shared/assets/icons/ChartsIcon";
import { ClockIcon } from "@/shared/assets/icons/ClockIcon";
import { FilesIcon } from "@/shared/assets/icons/FilesIcon";
import { AlarmClock } from "@/shared/assets/icons/AlarmClockIcon";
import { CalendarIcon } from "@/shared/assets/icons/CalendarIcon";
import { ReadReceiptIcon } from "@/shared/assets/icons/ReadReceiptIcon";

import { StatusTag } from "@/shared/ui/StatusTag";
import { LevelBadge } from "@/shared/ui/LevelBadge";
import { Button } from "@/shared/ui/Button";
import type { CSSProperties } from "react";
import { getLessonFolders } from "@/shared/lib/getLessonFolders";
import { lessonFolders } from "../../model/lesson-folder";
import { ClosedFolderIcon } from "@/shared/assets/icons/ClosedFolderIcon";
import { PlusIcon } from "@/shared/assets/icons/PlusIcon";
import { ShareIcon } from "@/shared/assets/icons/ShareIcon";
import { TrashBoxIcon } from "@/shared/assets/icons/TrashBoxIcon";

interface LessonOverviewProps {
  lesson: LessonSummary;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export function LessonOverview({ lesson }: LessonOverviewProps) {
  const progress = Math.min(100, Math.max(0, lesson.progress ?? 0));
  const folders = getLessonFolders(lesson, lessonFolders)

  const progressStyle = {
    "--progress": `${progress}%`,
  } as CSSProperties;

  const progressTitle =
    progress === 100
      ? "Lesson completed"
      : progress === 0
        ? "Not listened yet"
        : "Lesson in progress";

  const progressDescription =
    progress === 100
      ? "You have completed this lesson."
      : progress === 0
        ? "Mark as listened to track your progress."
        : `You have completed ${progress}% of this lesson.`;

  const details = [
    {
      label: "Level",
      value: <LevelBadge variant={lesson.level}>{lesson.level}</LevelBadge>,
      icon: <ChartsIcon />,
    },
    { label: "Topic", value: lesson.topic, icon: <FolderIcon /> },
    {
      label: "Duration",
      value: `${lesson.durationMinutes} min`,
      icon: <ClockIcon />,
    },
    {
      label: "Created",
      value: formatDate(lesson.createdAt),
      icon: <CalendarIcon />,
    },
    {
      label: "Updated",
      value: formatDate(lesson.updatedAt),
      icon: <AlarmClock />,
    },
    {
      label: "Files",
      value: lesson.availableFiles.join(", ").toUpperCase(),
      icon: <FilesIcon />,
    },
    {
      label: "Status",
      value: <StatusTag variant={lesson.status}>{lesson.status}</StatusTag>,
      icon: <ReadReceiptIcon />,
    },
  ];

  return (
    <div className={styles.container}>
      <p>{lesson.description}</p>
      <div className={styles.items}>
        {details.map((detail) => (
          <div key={detail.label} className={styles.item}>
            <div className={styles.icon}>{detail.icon}</div>
            <div className={styles.label}>{detail.label}</div>
            <div className={styles.value}>{detail.value}</div>
          </div>
        ))}
      </div>
      <hr />
      <div className={styles.progressContainer}>
        <h5>Progress</h5>
        <div className={styles.progress}>
          <div
            className={styles.progressCircle}
            role="progressbar"
            aria-label="Lesson progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div className={styles.outer} style={progressStyle}>
              <div className={styles.inner}>
                <span className={styles.number}>{progress}%</span>
              </div>
            </div>
          </div>
          <div className={styles.progressInfo}>
            <strong>{progressTitle}</strong>
            <span>{progressDescription}</span>
          </div>
        </div>
        <Button variant="primary" size="md">
          Mark as Listened
        </Button>
      </div>
      <hr />
      <div className={styles.foldersContainer}>
        <h5>In Library</h5>
        <div className={styles.folders}>
          {folders.map((folder) => (
            <div className={styles.folder} key={folder.id}>
              <ClosedFolderIcon />
              {folder.name}
            </div>
          ))}
          <div className={styles.folder} key="custom">
            <PlusIcon />
            Add tag
          </div>
        </div>
      </div>
      <hr />
      <div className={styles.actionsContainer}>
        <h5>Actions</h5>
        <div className={styles.actions}>
          <Button className={styles.share} leadingIcon={<ShareIcon />} size="sm" variant="ternary" >Share Lesson</Button>
          <Button className={styles.delete} leadingIcon={<TrashBoxIcon />} size="sm" variant="ternary" >Delete Lesson</Button>
        </div>
      </div>
    </div>
  );
}

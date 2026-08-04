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

interface LessonOverviewProps {
  items: LessonSummary[];
}

export function LessonOverview({ lesson }: LessonOverviewProps) {
  function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  }

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
    </div>
  );
}

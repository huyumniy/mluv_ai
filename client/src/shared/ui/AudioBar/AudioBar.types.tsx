import type { LessonSummary } from "@/entities/lesson/model";

export type AudioBarSize =
  | "big"
  | "card"
  | "table"
  | "mobile";

export interface AudioBarProps {
  lesson: LessonSummary;

  size?: AudioBarSize;

  className?: string;
}
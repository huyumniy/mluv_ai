import type { LessonSummary } from "../../model";

export type ContinueCardOrientation =
  | "horizontal"
  | "vertical";

export interface ContinueLessonCardProps {
  lesson: LessonSummary;
  orientation?: ContinueCardOrientation;

  onContinue: (lessonId: string) => void;
  onPlay?: (lessonId: string) => void;
  onMenuClick?: (lessonId: string) => void;
}
import type { HTMLAttributes } from "react";

export type LessonLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface LevelBadgeProps extends HTMLAttributes<HTMLElement> {
  children: string;
  variant: LessonLevel;
}

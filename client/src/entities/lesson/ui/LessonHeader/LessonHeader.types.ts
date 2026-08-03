import type { ReactNode } from "react";

import type { LessonSummary } from "../../model";

export interface LessonHeaderProps {
  lesson: LessonSummary;
  icon?: ReactNode;
  menuAction?: ReactNode;
}
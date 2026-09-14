import type { ReactNode } from "react";

export type LessonFolderType =
  | "system"
  | "predefined"
  | "custom";


  export type LessonFolderColor = `#${string}`;

export interface LessonFolder {
  id: string;
  name: string;
  type: LessonFolderType;

  color: LessonFolderColor;
  icon?: ReactNode;

  createdAt: string;
  updatedAt: string;
}
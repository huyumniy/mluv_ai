export type LessonFolderType =
  | "predefined"
  | "custom";

export type LessonFolderIcon =
  | "grammar"
  | "verbs"
  | "vocabulary"
  | "conversation"
  | "travel"
  | "work"
  | "custom";

export interface LessonFolder {
  id: string;
  name: string;
  type: LessonFolderType;

  icon: LessonFolderIcon;

  createdAt: string;
  updatedAt: string;
}
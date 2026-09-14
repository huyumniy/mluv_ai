import type { LessonFolder } from "./lessonFolder.types";

export const allLessonsFolder: LessonFolder = {
  id: "all-lessons",
  name: "All Lessons",
  type: "system",
  color: "#ECB914",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

export const predefinedLessonFolders: LessonFolder[] = [
  {
    id: "folder-verbs",
    name: "Verbs",
    type: "predefined",
    color: "#704fa2",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-vocabulary",
    name: "Vocabulary",
    type: "predefined",
    color: "#a29e4f",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-daily-life",
    name: "Daily Life",
    type: "predefined",
    color: "#E57476",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-grammar",
    name: "Grammar",
    type: "predefined",
    color: "#4B8F49",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-work",
    name: "Work",
    type: "predefined",
    color: "#4F6FA2",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

export const customLessonFolders: LessonFolder[] = [
  {
    id: "folder-custom-difficult-phrases",
    name: "Difficult Phrases",
    type: "custom",
    color: "#a2764f",
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "folder-custom-factory-czech",
    name: "Factory Czech",
    type: "custom",
    color: "#a24f4f",
    createdAt: "2026-07-25T15:30:00.000Z",
    updatedAt: "2026-08-01T12:15:00.000Z",
  },
];

export const displayLessonFolders: LessonFolder[] = [
  allLessonsFolder,
  ...predefinedLessonFolders,
  ...customLessonFolders,
];

export const lessonFolders: LessonFolder[] = [
  ...predefinedLessonFolders,
  ...customLessonFolders,
];
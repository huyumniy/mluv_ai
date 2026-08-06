import type { LessonFolder } from "./lessonFolder.types";

export const predefinedLessonFolders: LessonFolder[] = [
  {
    id: "folder-grammar",
    name: "Grammar",
    type: "predefined",
    icon: "grammar",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-verbs",
    name: "Verbs",
    type: "predefined",
    icon: "verbs",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-vocabulary",
    name: "Vocabulary",
    type: "predefined",
    icon: "vocabulary",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-conversations",
    name: "Conversations",
    type: "predefined",
    icon: "conversation",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-travel",
    name: "Travel",
    type: "predefined",
    icon: "travel",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "folder-work",
    name: "Work",
    type: "predefined",
    icon: "work",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

export const customLessonFolders: LessonFolder[] = [
  {
    id: "folder-custom-difficult-phrases",
    name: "Difficult Phrases",
    type: "custom",
    icon: "custom",
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "folder-custom-factory-czech",
    name: "Factory Czech",
    type: "custom",
    icon: "custom",
    createdAt: "2026-07-25T15:30:00.000Z",
    updatedAt: "2026-08-01T12:15:00.000Z",
  },
];

export const lessonFolders: LessonFolder[] = [
  ...predefinedLessonFolders,
  ...customLessonFolders,
];
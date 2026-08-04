export type LessonLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type LessonStatus = "listened" | "continue" | "not-started";

export type LessonFileType = "pdf" | "mp3";

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  level: LessonLevel;
  topic: string;
  durationMinutes: number;
  phraseCount: number;
  progress: number;
  imageSrc?: string;
  availableFiles: LessonFileType[];
  createdAt: string;
  updatedAt: string;
  status: LessonStatus;
}

export interface TranscriptLine {
    id: string;
    original: string;
    translation: string;
}

export interface VocabularyItem {
    id: string;
    title: string;
    word: string;
    translation: string;
    note?: string;
    highlighted?: boolean;
}

export interface GrammarContent {
    title: string;
    paragraphs: string[];
    points?: string[];
}

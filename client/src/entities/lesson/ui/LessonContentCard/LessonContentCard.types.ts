import type { ReactNode } from "react";
import type {
  GrammarContent,
  LessonSummary,
  TranscriptLine,
  VocabularyItem,
} from "../../model";

export interface CustomLessonTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface LessonContentCardProps {
  lesson?: LessonSummary;
  grammar?: GrammarContent;
  vocabulary?: VocabularyItem[];
  transcript?: TranscriptLine[];

  customTabs?: CustomLessonTab[];
}
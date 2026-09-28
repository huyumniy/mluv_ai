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
  placement?: "start" | "end";
}

export interface LessonContentCardProps {
  lesson?: LessonSummary;

  grammar?: GrammarContent;
  vocabulary?: VocabularyItem[];
  transcript?: TranscriptLine[];

  isDetailed?: boolean;
  fixedHeight?: boolean;
  fixedBlockSize?: string;
  customTabs?: CustomLessonTab[];
}
import type {
  GrammarContent,
  LessonSummary,
  TranscriptLine,
  VocabularyItem,
} from "../../model";

export interface LessonContentCardProps {
  lesson: LessonSummary;
  grammar: GrammarContent;
  vocabulary: VocabularyItem[];
  transcript: TranscriptLine[];
}
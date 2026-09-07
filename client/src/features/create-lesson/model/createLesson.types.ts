export type LessonLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1";

export type PhraseCount = 5 | 10 | 15;

export interface LessonGenerationSettings {
    level: LessonLevel,
    phraseCount: PhraseCount;
    mix: boolean;
}

export interface GeneratedPhrase {
    id: string;
    original: string;
    slowed: string;
    translation: string;
}

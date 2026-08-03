export type LessonLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface LessonSummary {
    id: string;
    title: string;
    level: LessonLevel;
    topic: string;
    durationMinutes: number;
    phraseCount: number;
    imageSrc?: string;
    progress?: number;
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

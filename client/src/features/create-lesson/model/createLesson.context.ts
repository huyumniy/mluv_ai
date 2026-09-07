import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  LessonGenerationSettings,
  GeneratedPhrase,
} from "./createLesson.types";

export interface CreateLessonContextValue {
  settings: LessonGenerationSettings;

  setSettings: Dispatch<
    SetStateAction<LessonGenerationSettings>
  >;

  generatedPhrases: GeneratedPhrase[];

  setGeneratedPhrases: Dispatch<
    SetStateAction<GeneratedPhrase[]>
  >;

  resetCreateLesson: () => void;
}

export const CreateLessonContext =
  createContext<CreateLessonContextValue | null>(
    null,
  );
import {
  type ReactNode,
  useState,
} from "react";

import { CreateLessonContext } from "./createLesson.context";

import type {
  LessonGenerationSettings,
  GeneratedPhrase,
} from "./createLesson.types";

interface CreateLessonProviderProps {
  children: ReactNode;
}

const initialSettings: LessonGenerationSettings = {
  level: "A2",
  phraseCount: 10,
  mix: false,
};

export function CreateLessonProvider({
  children,
}: CreateLessonProviderProps) {
  const [settings, setSettings] =
    useState<LessonGenerationSettings>(
      initialSettings,
    );

  const [
    generatedPhrases,
    setGeneratedPhrases,
  ] = useState<GeneratedPhrase[]>([]);

  const resetCreateLesson = () => {
    setSettings(initialSettings);
    setGeneratedPhrases([]);
  };

  return (
    <CreateLessonContext.Provider
      value={{
        settings,
        setSettings,

        generatedPhrases,
        setGeneratedPhrases,

        resetCreateLesson,
      }}
    >
      {children}
    </CreateLessonContext.Provider>
  );
}
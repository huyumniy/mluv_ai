import { useContext } from "react";

import { LessonPlayerContext } from "./lessonPlayer.context";

export function useLessonPlayerContext() {
  const context = useContext(LessonPlayerContext);

  if (!context) {
    throw new Error(
      "useLessonPlayerContext must be used inside LessonPlayerProvider",
    );
  }

  return context;
}
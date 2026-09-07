import { useContext } from "react";

import { CreateLessonContext } from "./createLesson.context";

export function useCreateLesson() {
  const context = useContext(
    CreateLessonContext,
  );

  if (!context) {
    throw new Error(
      "useCreateLesson must be used inside CreateLessonProvider",
    );
  }

  return context;
}
import { createContext } from "react";

import type {
    LessonPlayerContextValue,
} from "./lessonPlayer.types";

export const LessonPlayerContext =
    createContext<LessonPlayerContextValue | null>(null);

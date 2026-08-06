import type { TabItem } from "@/shared/ui/Tabs";

export type LessonTab =
  | "overview"
  | "grammar"
  | "vocabulary"
  | "transcript"
  | "custom"

export const lessonTabs = [
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "grammar",
    label: "Grammar",
  },
  {
    value: "vocabulary",
    label: "Vocabulary",
  },
  {
    value: "transcript",
    label: "Transcript",
  },
] as const satisfies readonly TabItem<LessonTab>[];
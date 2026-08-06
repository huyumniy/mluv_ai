import type { ReactNode } from "react";

import { AudioBar } from "@/shared/ui/AudioBar";
import { Button } from "@/shared/ui/Button";
import { CardSurface } from "@/shared/ui/CardSurface";

import type {
  GrammarContent,
  LessonSummary,
  TranscriptLine,
  VocabularyItem,
} from "../../model";

import type { CustomLessonTab } from "../LessonContentCard/LessonContentCard.types";

import { LessonContentCard } from "../LessonContentCard";
import { LessonHeader } from "../LessonHeader";

import styles from "./LessonCard.module.css";

interface LessonCardProps {
  lesson?: LessonSummary;

  grammar?: GrammarContent;
  vocabulary?: VocabularyItem[];
  transcript?: TranscriptLine[];

  customTabs?: CustomLessonTab[];

  headerIcon?: ReactNode;

  showAudioBar?: boolean;
  showActions?: boolean;

  onDownload?: () => void;
  onSave?: () => void;
}

export function LessonCard({
  lesson,
  grammar,
  vocabulary,
  transcript,
  customTabs,

  headerIcon,

  showAudioBar = true,
  showActions = true,

  onDownload,
  onSave,
}: LessonCardProps) {
  return (
    <CardSurface orientation="vertical" className={styles.card}>
      {lesson && <LessonHeader lesson={lesson} icon={headerIcon} />}

      {lesson && showAudioBar && (
        <AudioBar src={lesson.audioSrc} className={styles.audioBar} />
      )}

      <LessonContentCard
        lesson={lesson}
        grammar={grammar}
        vocabulary={vocabulary}
        transcript={transcript}
        customTabs={customTabs}
      />

      {showActions && (
        <>
          <hr className={styles.divider} />

          <div className={styles.actions}>
            <Button size="lg" variant="secondary" onClick={onDownload}>
              Download
            </Button>

            <Button size="lg" variant="primary" onClick={onSave}>
              Save Lesson
            </Button>
          </div>
        </>
      )}
    </CardSurface>
  );
}

import { useState, useRef } from "react";

import { CardSurface } from "@/shared/ui/CardSurface";
import { Tabs } from "@/shared/ui/Tabs";

import { lessonTabs, type LessonTab } from "../../model";

import { LessonGrammar } from "../LessonGrammar";
import { LessonOverview } from "../LessonOverview";
import { LessonTranscript } from "../LessonTranscript";
import { LessonVocabulary } from "../LessonVocabulary";

import { useOverflow } from "@/shared/hooks/useOverflow";
import type { LessonContentCardProps } from "./LessonContentCard.types";

import styles from "./LessonContentCard.module.css";
import clsx from "clsx";

export function LessonContentCard({
  lesson,
  grammar,
  vocabulary,
  transcript,
}: LessonContentCardProps) {
  const [activeTab, setActiveTab] = useState<LessonTab>("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  const contentInnerRef = useRef<HTMLDivElement>(null);

  const hasOverflow = useOverflow({
    containerRef: contentRef,
    contentRef: contentInnerRef,
    dependency: activeTab,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const handleTabChange = (
    nextTab: LessonTab,
  ) => {
    setActiveTab(nextTab);
    setIsExpanded(false);
  };

  const handleContentClick = () => {
    if (hasOverflow) {
      setIsExpanded(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <LessonOverview lesson={lesson} />;

      case "grammar":
        return <LessonGrammar content={grammar} />;

      case "vocabulary":
        return <LessonVocabulary items={vocabulary} />;

      case "transcript":
        return <LessonTranscript lines={transcript} />;
    }
  };

  return (
    <CardSurface orientation="vertical" className={styles.card}>
      <Tabs<LessonTab>
        items={lessonTabs}
        value={activeTab}
        onValueChange={handleTabChange}
        ariaLabel="Lesson content"
      />

      <div
        ref={contentRef}
        className={clsx(
          styles.content,
          hasOverflow && !isExpanded && styles.hasOverflow,
        )}
        role="tabpanel"
        onClick={handleContentClick}
        id={`lesson-panel-${activeTab}`}
      >
        <div className={styles.contentInner} ref={contentInnerRef}>{renderContent()}</div>
      </div>
    </CardSurface>
  );
}

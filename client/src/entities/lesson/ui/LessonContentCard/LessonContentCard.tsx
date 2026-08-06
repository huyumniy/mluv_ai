import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import clsx from "clsx";

import { Tabs } from "@/shared/ui/Tabs";
import { useOverflow } from "@/shared/hooks/useOverflow";

import {
  lessonTabs,
  type LessonTab,
} from "../../model";

import { LessonGrammar } from "../LessonGrammar";
import { LessonOverview } from "../LessonOverview";
import { LessonTranscript } from "../LessonTranscript";
import { LessonVocabulary } from "../LessonVocabulary";

import type {
  CustomLessonTab,
  LessonContentCardProps,
} from "./LessonContentCard.types";

import styles from "./LessonContentCard.module.css";

type LessonContentTabId =
  | LessonTab
  | `custom:${string}`;

interface AvailableTab {
  value: LessonContentTabId;
  label: string;
}

function getCustomTabId(
  tab: CustomLessonTab,
): `custom:${string}` {
  return `custom:${tab.id}`;
}

export function LessonContentCard({
  lesson,
  grammar,
  vocabulary,
  transcript,
  customTabs = [],
}: LessonContentCardProps) {
  const availableTabs = useMemo<
    AvailableTab[]
  >(() => {
    const builtInTabs = lessonTabs.filter(
      (tab) => {
        switch (tab.value) {
          case "overview":
            return Boolean(lesson);

          case "grammar":
            return Boolean(grammar);

          case "vocabulary":
            return Boolean(
              vocabulary?.length,
            );

          case "transcript":
            return Boolean(
              transcript?.length,
            );

          default:
            return false;
        }
      },
    );

    const additionalTabs = customTabs.map(
      (tab) => ({
        value: getCustomTabId(tab),
        label: tab.label,
      }),
    );

    return [
      ...builtInTabs,
      ...additionalTabs,
    ];
  }, [
    lesson,
    grammar,
    vocabulary,
    transcript,
    customTabs,
  ]);

  const firstAvailableTab =
    availableTabs[0]?.value;

  const [activeTab, setActiveTab] =
    useState<LessonContentTabId>(
      firstAvailableTab ?? "overview",
    );

  const [isExpanded, setIsExpanded] =
    useState(false);

  const contentRef =
    useRef<HTMLDivElement>(null);

  const contentInnerRef =
    useRef<HTMLDivElement>(null);

  const hasOverflow = useOverflow({
    containerRef: contentRef,
    contentRef: contentInnerRef,
    dependency: activeTab,
  });

  useEffect(() => {
    const activeTabExists =
      availableTabs.some(
        (tab) => tab.value === activeTab,
      );

    if (
      !activeTabExists &&
      firstAvailableTab
    ) {
      setActiveTab(firstAvailableTab);
      setIsExpanded(false);
    }
  }, [
    activeTab,
    availableTabs,
    firstAvailableTab,
  ]);

  const handleTabChange = (
    nextTab: LessonContentTabId,
  ) => {
    setActiveTab(nextTab);
    setIsExpanded(false);
  };

  const handleContentClick = () => {
    if (hasOverflow && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const renderBuiltInContent = () => {
    switch (activeTab) {
      case "overview":
        return lesson ? (
          <LessonOverview lesson={lesson} />
        ) : null;

      case "grammar":
        return grammar ? (
          <LessonGrammar content={grammar} />
        ) : null;

      case "vocabulary":
        return vocabulary?.length ? (
          <LessonVocabulary
            items={vocabulary}
          />
        ) : null;

      case "transcript":
        return transcript?.length ? (
          <LessonTranscript
            lines={transcript}
          />
        ) : null;

      default:
        return null;
    }
  };

  const renderCustomContent = () => {
    if (
      !activeTab.startsWith("custom:")
    ) {
      return null;
    }

    const customTabId = activeTab.slice(
      "custom:".length,
    );

    const customTab = customTabs.find(
      (tab) => tab.id === customTabId,
    );

    return customTab?.content ?? null;
  };

  const renderContent = () => {
    if (
      activeTab.startsWith("custom:")
    ) {
      return renderCustomContent();
    }

    return renderBuiltInContent();
  };

  if (!firstAvailableTab) {
    return null;
  }

  return (
    <section className={styles.card}>
      <Tabs<LessonContentTabId>
        items={availableTabs}
        value={activeTab}
        onValueChange={handleTabChange}
        ariaLabel="Lesson content"
      />

      <div
        ref={contentRef}
        className={clsx(
          styles.content,
          hasOverflow &&
            !isExpanded &&
            styles.hasOverflow,
          isExpanded && styles.expanded,
        )}
        role="tabpanel"
        id={`lesson-panel-${activeTab}`}
        onClick={handleContentClick}
      >
        <div
          ref={contentInnerRef}
          className={styles.contentInner}
        >
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
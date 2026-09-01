import { useState } from "react";

import styles from "./MluvLearningApp.module.css";

import { verbConstructionsLesson } from "@/entities/lesson/model";

import { LessonHeader } from "@/entities/lesson/ui/LessonHeader";

import { AaIcon } from "@/shared/assets/icons/AaIcon";
import { AudioBar } from "@/shared/ui/AudioBar";
import { CardSurface } from "@/shared/ui/CardSurface";
import { Tabs, type TabItem } from "@/shared/ui/Tabs";
import { ClosedFolderIcon } from "@/shared/assets/icons/ClosedFolderIcon";
import { DownloadIcon } from "@/shared/assets/icons/DownloadIcon";
import { SoundWave } from "@/shared/assets/icons/SoundWave";
import { ArrosClockwiseIcon } from "@/shared/assets/icons/ArrosClockwiseIcon";
import { Button } from "@/shared/ui/Button";
import { HeadphonesIcon } from "@/shared/assets/icons/HeadphonesIcon";
import { DocumentIcon } from "@/shared/assets/icons/DocumentIcon";

type MluvTab = "overview";

const tabItems: TabItem<MluvTab>[] = [
  {
    value: "overview",
    label: "Overview",
  },
];

const features = [
  {
    icon: <ClosedFolderIcon />,
    title: "Choose a useful topic",
    description: "Real-Lif situations you actually use.",
    trailingDetails: null,
  },
  {
    icon: <SoundWave />,
    title: "Translation > Slow > Natural",
    description: "Listen in three mods to build real understanding.",
    trailingDetails: null,
  },
  {
    icon: <ArrosClockwiseIcon />,
    title: "Smart Repetition",
    description: "Review at the right time to remember longer.",
    trailingDetails: null,
  },
  {
    icon: <DownloadIcon />,
    title: "Save or Download",
    description: "Keep lessons offline and learn anywhere.",
    trailingDetails: (
      <>
        <Button leadingIcon={<DocumentIcon />} variant="secondary" size="sm">
          PDF
        </Button>
        <Button leadingIcon={<HeadphonesIcon />} variant="secondary" size="sm">
          MP3
        </Button>
      </>
    ),
  },
];

export function MluvLearningApp() {
  const [activeTab, setActiveTab] = useState<MluvTab>("overview");

  return (
    <article className={styles.app}>
      <CardSurface orientation="vertical">
        <div className={styles.eyebrow}>THE MLUV WAY</div>

        <LessonHeader lesson={verbConstructionsLesson} icon={<AaIcon />}/>

        <AudioBar className={styles.audiobar} lesson={verbConstructionsLesson} />

        <Tabs<MluvTab>
          items={tabItems}
          value={activeTab}
          onValueChange={setActiveTab}
          ariaLabel="Lesson content"
        />

        <div
          className={styles.tabContent}
          role="tabpanel"
          id={`mluv-panel-${activeTab}`}
        >
          {activeTab === "overview" &&
            features.map((feature) => (
              <div className={styles.option}>
                <div className={styles.icon}>{feature.icon}</div>
                <div className={styles.details}>
                  <div className={styles.title}>{feature.title}</div>
                  <div className={styles.description}>
                    {feature.description}
                  </div>
                </div>
                <div className={styles.trailingDetails}>
                  {feature.trailingDetails}
                </div>
              </div>
            ))}
        </div>
      </CardSurface>
    </article>
  );
}

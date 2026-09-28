import { useLocation, useParams } from "react-router";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import {
  lessonSummaries,
  pastTenseGrammar,
  restaurantTranscript,
  verbVocabulary,
} from "@/entities/lesson/model";
import styles from "./LessonDetailsPage.module.css";
import { LessonOverview } from "@/entities/lesson/ui/LessonOverview";
import { LessonHeader } from "@/entities/lesson/ui/LessonHeader";
import { AudioBar } from "@/shared/ui/AudioBar";
import { LessonContentCard } from "@/entities/lesson/ui/LessonContentCard";
import type { CustomLessonTab } from "@/entities/lesson/ui/LessonContentCard/LessonContentCard.types";
import { LessonIntroductionTab } from "./ui/LessonIntroductionTab";
import segment1 from "@/shared/assets/audios/phrase1.mp3";
import segment2 from "@/shared/assets/audios/phrase2.mp3";
import segment3 from "@/shared/assets/audios/phrase3.mp3";
import { BookmarkIcon } from "@/shared/assets/icons/BookmarkIcon";
import { HeadphonesIcon } from "@/shared/assets/icons/HeadphonesIcon";
import { DocumentIcon } from "@/shared/assets/icons/DocumentIcon";
import { Button } from "@/shared/ui/Button";
import { CheckmarkCircleIcon } from "@/shared/assets/icons/CheckmarkCircleIcon";

export function LessonDetailsPage() {
  const location = useLocation();
  const { lessonId } = useParams();

  const state = location.state;
  const lesson = lessonSummaries.find((ls) => ls.id === lessonId);
  if (!lesson) {
    return <div>Lesson not found</div>
  }
  const customTabs: CustomLessonTab[] = [
    {
      id: "lesson-summary",
      label: "Overview",
      placement: "start",
      content: (
        <LessonIntroductionTab
          description={lesson?.description}
          newPhrases={[
            {
              phrase: "Číst jsem knihu.",
              translation: "I read a book.",
              audioSegmentSrc: segment1,
            },
            {
              phrase: "Včera jsem šel do školy.",
              translation: "Yesterday I went to school.",
              audioSegmentSrc: segment2,
            },
            {
              phrase: "Přečetl jsem článek.",
              translation: "I finished reading the article.",
              audioSegmentSrc: segment3,
            },
          ]}
        />
      ),
    },
  ];
  const breadcrumbItems = [
    ...(state?.breadcrumbs ?? [
      {
        label: "Lessons",
        path: "/lessons",
      },
    ]),

    {
      label: lesson?.title,
      path: lesson?.id,
    },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumbs items={breadcrumbItems} />
      <main className={styles.content}>
        <section className={styles.detailedSection}>
          <LessonHeader
            lesson={lesson}
            icon={<img src={lesson?.imageSrc} />}
            isDetailed={true}
          />
          <AudioBar lesson={lesson} />
          <LessonContentCard
            customTabs={customTabs}
            grammar={pastTenseGrammar}
            vocabulary={verbVocabulary}
            transcript={restaurantTranscript}
            fixedHeight={true}
            fixedBlockSize="500px"
          />
          <section className={styles.commandButtons}>
            <Button
              // onClick={handleDownloadAudio}
              size="md"
              variant="secondary"
              leadingIcon={<HeadphonesIcon />}
            >
              Download MP3
            </Button>
            <Button
              // onClick={handleDownloadDocument}
              size="md"
              variant="secondary"
              leadingIcon={<DocumentIcon />}
            >
              Download PDF
            </Button>
            <Button
              // onClick={handleCheckmark}
              size="md"
              variant="secondary"
              leadingIcon={<CheckmarkCircleIcon />}
            >
              Mark as Listened
            </Button>
            <Button
              // onClick={handleSaveToLibrary}
              size="md"
              variant="primary"
              leadingIcon={<BookmarkIcon />}
            >
              Save Lesson
            </Button>
          </section>
        </section>
        <section className={styles.wideCardContainer}>
          <LessonOverview
            className={styles.widecard}
            lesson={lesson}
            isDetailed={true}
            showDescription={false}
          />
        </section>
      </main>
    </div>
  );
}

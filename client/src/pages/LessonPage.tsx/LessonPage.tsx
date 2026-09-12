import { useEffect, useState, type ReactNode } from "react";

import { useLocation, useNavigate, useParams } from "react-router";

import styles from "./LessonPage.module.css";

import {
  reflexivePronounsGrammar,
  restaurantTranscript,
  verbVocabulary,
  type LessonSummary,
} from "@/entities/lesson/model";

import successImage from "@/shared/assets/images/success.png";

import { Button } from "@/shared/ui/Button";
import { AudioBar } from "@/shared/ui/AudioBar";

import { LessonContentCard } from "@/entities/lesson/ui/LessonContentCard";

import { ArrosClockwiseIcon } from "@/shared/assets/icons/ArrosClockwiseIcon";
import { ArrowLongLeftIcon } from "@/shared/assets/icons/ArrowLongLeftIcon";
import { BookmarkIcon } from "@/shared/assets/icons/BookmarkIcon";
import { HeadphonesIcon } from "@/shared/assets/icons/HeadphonesIcon";
import { DocumentIcon } from "@/shared/assets/icons/DocumentIcon";
import { ClockIcon } from "@/shared/assets/icons/ClockIcon";
import { BookIcon } from "@/shared/assets/icons/BookIcon";
import { LevelIcon } from "@/shared/assets/icons/LevelIcon";
import { RandomIcon } from "@/shared/assets/icons/RandomIcon";

interface LessonPageState {
  lesson: LessonSummary;
}

interface InfoItem {
  id: string;
  label: string;
  value: ReactNode;
  icon: ReactNode;
}

export function LessonPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { lessonId } = useParams();

  const initialLesson = (location.state as LessonPageState | null)?.lesson;

  // initial lesson for development
  const [lesson, setLesson] = useState<LessonSummary | null>(
    initialLesson ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const loadLesson = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("TODO: GET lesson", lessonId);
      } catch (error) {
        console.error(error);

        setError("Failed to load lesson.");
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [lessonId]);

  const handleBack = () => {
    navigate(`/create-lesson/${lesson?.topic}/settings`);
  };
  const handleSaveToLibrary = () => {
    // TODO: save lesson
  };
  const handleRegenerate = () => { 
    // TODO: regenerate lesson
  };
  const handleDownloadAudio = () => {
    // TODO: Download MP3
  };
  const handleDownloadDocument = () => {
    // TODO: Download PDF
  };

  const infoItems: InfoItem[] = [
    {
      id: "topic",
      label: "Topic",
      value: lesson.title,
      icon: <BookIcon />,
    },
    {
      id: "level",
      label: "Level",
      value: lesson.level,
      icon: <LevelIcon />,
    },
    {
      id: "mode",
      label: "Mode",
      value: lesson.mode === "mixed" ? "Old + New" : "New phrases",
      icon: <RandomIcon />,
    },
    {
      id: "length",
      label: "Length",
      value: `${lesson.durationMinutes} min`,
      icon: <ClockIcon />,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.successMessage}>
        <div className={styles.imageContainer}>
          <img src={successImage} alt="success" />
        </div>
        <h2 className={styles.title}>Your lesson is ready!</h2>
        <p className={styles.description}>
          Review the summary below and choose your next action.
        </p>
      </div>

      <main className={styles.content}>
        <section className={styles.infoSection}>
          {infoItems.map((item) => (
            <div key={item.id} className={styles.infoItem}>
              <div className={styles.leftSide}>
                <div className={styles.icon}>{item.icon}</div>
                <div className={styles.label}>{item.label}</div>
              </div>
              <div className={styles.rightSide}>{item.value}</div>
            </div>
          ))}
        </section>

        <section className={styles.contentCardSection}>
          <AudioBar lesson={lesson} className={styles.audiobar} />
          <LessonContentCard
            transcript={restaurantTranscript}
            vocabulary={verbVocabulary}
            grammar={reflexivePronounsGrammar}
          />
        </section>
      </main>

      <div className={styles.commandButtons}>
        <Button
          onClick={handleBack}
          size="md"
          variant="secondary"
          leadingIcon={<ArrowLongLeftIcon />}
        >
          Back
        </Button>
        <Button
          onClick={handleRegenerate}
          size="md"
          variant="secondary"
          leadingIcon={<ArrosClockwiseIcon />}
        >
          Regenerate
        </Button>
        <Button
          onClick={handleSaveToLibrary}
          size="md"
          variant="primary"
          leadingIcon={<BookmarkIcon />}
        >
          Use for final audio
        </Button>
        <Button
          onClick={handleDownloadAudio}
          size="md"
          variant="secondary"
          leadingIcon={<HeadphonesIcon />}
        >
          Download MP3
        </Button>
        <Button
          onClick={handleDownloadDocument}
          size="md"
          variant="secondary"
          leadingIcon={<DocumentIcon />}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}

import styles from "./CreateLessonPhrases.module.css";
import { topics } from "@/entities/topic/model";
import { useParams, useNavigate } from "react-router";
import { useCreateLesson } from "@/features/create-lesson/model";
import { Button } from "@/shared/ui/Button";
import { MagicIcon } from "@/shared/assets/icons/MagicIcon";
import { ArrowLongLeftIcon } from "@/shared/assets/icons/ArrowLongLeftIcon";
import { SoundWaveIcon } from "@/shared/assets/icons/SoundWaveIcon";
import { restaurantTranscript, type LessonSummary } from "@/entities/lesson/model";
import { ArrosClockwiseIcon } from "@/shared/assets/icons/ArrosClockwiseIcon";
import audio from "@/shared/assets/audios/lesson.mp3";
import temp from "@/shared/assets/audios/temp.mp3";


export function CreateLessonPhrasesPage() {
  const { topicId } = useParams();
  const topic = topics.find((topic) => topic.id === topicId);
  if (!topic) {
    return <div>Topic not found</div>;
  }
  const navigate = useNavigate();
  const { settings, setSettings } = useCreateLesson();

  const handleBack = () => {
    navigate(`/create-lesson/${topicId}/settings`);
  };
  const handleCreateLesson = () => {
    const now = new Date().toISOString();

    const lesson: LessonSummary = {
      id: crypto.randomUUID(),

      title: topic.label,
      description: `${topic.label} Czech lesson`,

      level: settings.level,
      topic: topic.id,

      durationMinutes: settings.phraseCount,
      phraseCount: restaurantTranscript.length,

      progress: 0,

      audioSrc: audio,

      availableFiles: ["mp3"],

      createdAt: now,
      updatedAt: now,

      status: "not-started",

      folderIds: [],
    };

    navigate(
      `/lessons/${lesson.id}`,
      {
        state: {
          lesson,
        },
      },
    );
  };
  const handleRegenerate = () => {
    
  }
  return (
    <div className={styles.container}>
      <div className={styles.selectedTopic}>
        <img src={topic?.image} alt={topic?.label} />
        Selected Topic: <span>{topic?.label}</span>
      </div>
      <div className={styles.message}>
        <h1 className={styles.title}>Review your generated phrases</h1>
        <p className={styles.description}>
          This phrases will be used in your final audio lesson.
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <header className={styles.header}>
            <MagicIcon className={styles.magicIcon} />
            <h4>New phrases</h4>
          </header>
          <div className={styles.items}>
            {restaurantTranscript.map((item, index) => (
              <div className={styles.item}>
                <div className={styles.itemNumber}>
                  {index + 1}
                </div>
                <div className={styles.transcript}>
                  <div className={styles.original}>{item.original}</div>
                  <div className={styles.slowed}>{item.originalSlowed}</div>
                  <div className={styles.translation}>{item.translation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.nextStep}>
          <div className={styles.iconContainer}>
            <MagicIcon className={styles.icon} />
          </div>
          <h3 className={styles.title}>Next Step</h3>
          <p className={styles.description}>
            Generate audio from these phrases to create your lesson.
          </p>
        </div>
      </div>
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
          onClick={handleCreateLesson}
          size="md"
          variant="primary"
          leadingIcon={<SoundWaveIcon />}
        >
          Use for final audio
        </Button>
      </div>
    </div>
  );
}

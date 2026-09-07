import type { ReactNode } from "react";
import styles from "./CreateLessonSettings.module.css";
import { RandomIcon } from "@/shared/assets/icons/RandomIcon";
import { useNavigate, useParams } from "react-router";
import { MagicIcon } from "@/shared/assets/icons/MagicIcon";
import { topics } from "@/entities/topic/model";
import { useCreateLesson } from "@/features/create-lesson/model";
import type {
  phraseCount,
  LessonLevel,
} from "@/features/create-lesson/model";
import { Button } from "@/shared/ui/Button";
import { ArrowLongLeftIcon } from "@/shared/assets/icons/ArrowLongLeftIcon";
import { CheckmarkIcon } from "@/shared/assets/icons/CheckmarkIcon";

type OptionGroup =
  | {
      id: "level";
      label: string;
      options: LessonLevel[];
    }
  | {
      id: "phraseCount";
      label: string;
      options: phraseCount[];
    };

const optionGroups: OptionGroup[] = [
  {
    id: "level",
    label: "Level",
    options: ["A1", "A2", "B1", "B2", "C1"],
  },
  {
    id: "phraseCount",
    label: "Lesson duration",
    options: [5, 10, 15],
  },
];

interface LessonMode {
  id: "new" | "mixed";
  icon: ReactNode;
  label: string;
  description: string;
}

export const lessonModes: LessonMode[] = [
  {
    id: "new",
    icon: <MagicIcon />,
    label: "Generate new phrases",
    description: "AI creates fresh, original phrses just for you",
  },
  {
    id: "mixed",
    icon: <RandomIcon />,
    label: "Mix old + new phrases",
    description: "Repetition of already created phrases including fresh ones",
  },
];

export function CreateLessonSettingsPage() {
  const { topicId } = useParams();
  const topic = topics.find((topic) => topic.id === topicId);
  if (!topic) {
    return <div>Topic not found</div>;
  }

  const navigate = useNavigate();
  const { settings, setSettings } = useCreateLesson();
  const selectedMode = settings.mix ? "mixed" : "new";

  const handleModeSelect = (mode: LessonMode["id"]) => {
    setSettings((current) => ({
      ...current,
      mix: mode === "mixed",
    }));
  };

  const handleOptionSelect = <K extends "level" | "phraseCount">(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };
  const handleBack = () => {
    navigate(`/create-lesson`);
  };
  const handleContinue = () => {
    navigate(`/create-lesson/${topicId}/phrases`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.selectedTopic}>
        <img src={topic?.image} alt={topic?.label} />
        Selected Topic: <span>{topic?.label}</span>
      </div>
      <div className={styles.message}>
        <h1 className={styles.title}>Generate new phrases or mix old + new?</h1>
        <p className={styles.description}>
          Choose how you’d like to build this lesson.
        </p>
      </div>
      <div className={styles.modes}>
        {lessonModes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <button
              data-selected={isSelected}
              className={styles.mode}
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
            >
              <div className={styles.icon}>{mode.icon}</div>
              <h3 className={styles.label}>{mode.label}</h3>
              <div className={styles.description}>{mode.description}</div>
            </button>
          );
        })}
      </div>
      <div className={styles.options}>
        {optionGroups.map((group) => (
          <div className={styles.optionContainer} key={group.id}>
            <div className={styles.label}>{group.label}</div>
            <div className={styles.optionValues}>
              {group.options.map((option) => (
                <Button
                  data-active={settings[group.id] === option}
                  key={option}
                  variant="secondary"
                  className={styles.optionValue}
                  size="md"
                  onClick={() => handleOptionSelect(group.id, option)}
                >
                  {option} {group.id === "phraseCount" && "min"}
                </Button>
              ))}
            </div>
          </div>
        ))}
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
          onClick={handleContinue}
          size="md"
          variant="primary"
          leadingIcon={<CheckmarkIcon />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

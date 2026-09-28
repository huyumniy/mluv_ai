import { Button } from "@/shared/ui/Button";
import styles from "./LessonIntroductionTab.module.css";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { useAudio } from "@/shared/hooks/useAudio";

interface newPhrase {
  phrase: string;
  translation: string;
  audioSegmentSrc: string;
}

interface LessonIntroductionTabProps {
  description?: string;
  newPhrases?: newPhrase[];
}

export function LessonIntroductionTab({
  description,
  newPhrases,
}: LessonIntroductionTabProps) {
  const { playingSrc, toggle } = useAudio();

  return (
    <div className={styles.container}>
      <p className={styles.desription}>{description}</p>

      <div className={styles.divider} />

      <section className={styles.phrases}>
        <h3>New phrases</h3>

        <div className={styles.phraseList}>
          {newPhrases &&
            newPhrases.map((item) => {
              const isPlaying = playingSrc === item.audioSegmentSrc;

              return (
                <div key={item.phrase} className={styles.phrase}>
                  <span className={styles.original}>{item.phrase}</span>

                  <span className={styles.translation}>{item.translation}</span>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggle(item.audioSegmentSrc)}
                    className={styles.phraseAction}
                    aria-label={`Practice ${item.phrase}`}
                  >
                    {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
                  </Button>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

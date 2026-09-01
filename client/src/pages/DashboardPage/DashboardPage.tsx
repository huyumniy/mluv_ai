import {
  verbConstructionsLesson,
  restaurantLesson,
  pastTenseGrammar,
} from "@/entities/lesson/model";

import styles from "./Dashboard.module.css";

import { AudioBar } from "@/shared/ui/AudioBar";
import { useLessonPlayer } from "@/features/lesson-player/model";

const testLessons = [
  verbConstructionsLesson,
  restaurantLesson,
];

export function DashboardPage() {
  const {
    queue,
    currentQueueIndex,
    addToQueue,
    removeFromQueue,
    next,
    previous,
  } = useLessonPlayer();

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={previous}>
          Previous
        </button>

        <button onClick={next}>
          Next
        </button>
      </div>

      <div className={styles.lessons}>
        {testLessons.map((lesson) => {
          const isInQueue = queue.some(
            (queueLesson) =>
              queueLesson.id === lesson.id,
          );

          return (
            <div
              key={lesson.id}
              className={styles.lesson}
            >
              <AudioBar
                className={styles.audiobar}
                lesson={lesson}
              />

              <div className={styles.lessonActions}>
                <button
                  onClick={() =>
                    addToQueue(lesson)
                  }
                  disabled={isInQueue}
                >
                  {isInQueue
                    ? "In queue"
                    : "Add to queue"}
                </button>

                <button
                  onClick={() =>
                    removeFromQueue(lesson.id)
                  }
                  disabled={!isInQueue}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.queue}>
        <h3>Queue</h3>

        {queue.length === 0 ? (
          <p>Queue is empty</p>
        ) : (
          queue.map((lesson, index) => (
            <div
              key={lesson.id}
              className={styles.queueItem}
              data-active={
                index === currentQueueIndex
              }
            >
              <span>
                {index + 1}. {lesson.title}
              </span>

              {index === currentQueueIndex && (
                <strong>
                  Playing
                </strong>
              )}

              <button
                onClick={() =>
                  removeFromQueue(lesson.id)
                }
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
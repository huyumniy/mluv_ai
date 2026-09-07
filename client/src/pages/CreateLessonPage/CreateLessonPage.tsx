import styles from "./CreateLessonPage.module.css";
import { Button } from "@/shared/ui/Button";
import type { CSSProperties } from "react";
import type { Topic } from "@/entities/topic/model";
import { topics } from "@/entities/topic/model";
import { useNavigate } from "react-router"

export function CreateLessonPage() {
  const navigate = useNavigate();
  const handleTopicClick = (topic: Topic) => {
    navigate(`/create-lesson/${topic.id}/settings`)
  };
  return (
    <div className={styles.container}>
      <div className={styles.topicsContainer}>
        <div className={styles.topics}>
          <Button key={0} variant="primary" size="md">
            All
          </Button>
          {topics.map((topic, index) => (
            <Button onClick={() => handleTopicClick(topic)} key={index + 1} variant="secondary" size="md">
              {topic.label}
            </Button>
          ))}
        </div>
      </div>
      <div className={styles.scene}>
        <div className={styles.center}>
          <div className={styles.title}>
            Choose Your Topic or create your own.
          </div>
          <div className={styles.description}>
            We have 200+ topics across grammar,conversations, vocabulary and
            everyday practice.
          </div>
          <img className={styles.bookImage} src="/images/book.png" alt="book" />
        </div>
        {topics.map((topic, index) => (
          <Button
            key={topic.id}
            leadingIcon={<img src={topic.image} alt={topic.label} />}
            variant="secondary"
            size="sm"
            aria-label={topic.label}
            className={styles.topic}
            style={
              {
                "--float-delay": `${-(index * 0.37)}s`,
              } as CSSProperties
            }
            topic-index={index + 1}
            onClick={() => handleTopicClick(topic)}
          >
            {topic.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

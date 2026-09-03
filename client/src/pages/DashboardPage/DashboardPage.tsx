import {
  verbConstructionsLesson,
  restaurantLesson,
  pastTenseGrammar,
} from "@/entities/lesson/model";

import styles from "./Dashboard.module.css";
import { Button } from "@/shared/ui/Button";
import { PlusIcon } from "@/shared/assets/icons/PlusIcon";
import { ContinueLessonCard } from "@/entities/lesson/ui/ContinueLessonCard";
import { BookIcon } from "@/shared/assets/icons/BookIcon";
import { HeadphonesIcon } from "@/shared/assets/icons/HeadphonesIcon";
import { BookmarkIcon } from "@/shared/assets/icons/BookmarkIcon";

const testLessons = [
  verbConstructionsLesson,
  restaurantLesson,
  pastTenseGrammar,
];

const cardsInfo = [
  {
    img: <BookIcon />,
    title: "Lessons Created",
    streak: 24,
    statistics: 1,
  },
  {
    img: <HeadphonesIcon />,
    title: "Audio Minutes",
    streak: 382,
    statistics: 58,
  },
  {
    img: <BookmarkIcon />,
    title: "Saved Lessons",
    streak: 18,
    statistics: 156,
  },
  {
    img: <BookIcon />,
    title: "Reviewed Phrases",
    streak: 156,
    statistics: 21,
  },
];

export function DashboardPage() {
  return (
    <div className={styles.container}>
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <div className={styles.title}>Welcome back, Vlad</div>
          <div className={styles.subtitle}>
            Continue learning or create a new Czech Lesson.
          </div>
        </div>
        <img src="/images/prague.png" className={styles.image} alt="prague" />
      </section>

      <div className={styles.continueAndCreate}>
        <section className={styles.createCard}>
          <div className={styles.decorLeft} />
          <div className={styles.decorRight} />

          <div className={styles.plusBadge}>
            <PlusIcon />
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>Create a New Lesson</h2>

            <p className={styles.description}>
              Generate custom Czech lessons
              <br />
              in seconds with AI.
            </p>

            <Button
              leadingIcon={<PlusIcon />}
              variant="primary"
              size="md"
              // onClick={onCreate}
              className={styles.createButton}
            >
              Create Lesson
            </Button>
          </div>

          <img
            className={styles.bookImage}
            src="/images/bookPencil.png"
            alt=""
          />
        </section>
        <section className={styles.continueCard}>
          <ContinueLessonCard
            lesson={verbConstructionsLesson}
            orientation="horizontal"
            onContinue={() => {}}
          />
        </section>
      </div>
      <section className={styles.cards}>
        {cardsInfo.map((card) => (
          <div key={card.title} className={styles.card}>
            <div className={styles.cardImage}>
              {card.img}
            </div>
            <div className={styles.cardInfo}>
              <h5 className={styles.cardTitle}>{card.title}</h5>
              <h4 className={styles.cardStreak}>{card.streak}</h4>
              <small className={styles.cardStatistics}>+{card.statistics} this week</small>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.recentLessons}>

      </section>

      <section className={styles.bottom}>
        Made with Love for Czech learners 
      </section>
    </div>
  );
}

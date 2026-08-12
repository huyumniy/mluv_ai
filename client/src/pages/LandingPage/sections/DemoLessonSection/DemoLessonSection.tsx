import styles from "./DemoLessonSection.module.css";
import { HeadphonesIcon } from "@/shared/assets/icons/HeadphonesIcon";
import { MagicIcon } from "@/shared/assets/icons/MagicIcon";
import dashboardPreview from "@/shared/assets/images/dasahboardPreview.png";
import { PlayIcon } from "@/shared/assets/icons/PlayIcon";
import { Button } from "@/shared/ui/Button";

export function DemoLessonSection() {
  const items = [
    {
      title: "Try the full experience",
      description: "Create a lesson, listen, and explore every part of the app",
      icon: <PlayIcon />,
    },
    {
      title: "No sign up needed",
      description: "Jump right in and explore the demo instantly.",
      icon: <HeadphonesIcon />,
    },
    {
      title: "See how it works",
      description:
        "Understand the flow, features, and the learning experience.",
      icon: <MagicIcon />,
    },
  ];
  
  return (
    <section className={styles.section}>
      <header>
        <div className={styles.eyebrow}>TRY A REAL LESSON</div>
        <div className={styles.title}>
          See Mluv in action.
          <br />
          Start a lesson, feel the flow.
        </div>
        <div className={styles.description}>
          Explore the demo and experience how a personalized audio lessons
          are created, structured, and delivered – all in one simple flow.
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.items}>
            {items.map((item) => (
              <div className={styles.item}>
                <div className={styles.icon}>{item.icon}</div>
                <div className={styles.details}>
                  <div className={styles.detailsTitle}>{item.title}</div>
                  <div className={styles.detailsDescription}>
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.cta}>
              <Button variant="primary" size="lg">
                Explore demo lessons
              </Button>
              
              <div className={styles.demoHint}>
                <div className={styles.demoLabel}>Opens the demo</div>
                <div className={styles.demoVector}>
                  <svg
                    width="113"
                    height="48"
                    viewBox="0 0 113 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M111.067 1C102.416 16.7167 68.7125 46.31 3.10486 38.95"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M18.6763 30.9004L2.06674 38.9504L14.9853 47.0004"
                      stroke="#7B7B7B"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
              </div>
          </div>
        </div>
        <div className={styles.preview}>
          <div className={styles.ellipseLeft} />
          <div className={styles.ellipseBottom} />
          <div className={styles.ellipseRight} />
          <div className={styles.dots} />

          <img
            src={dashboardPreview}
            alt="Mluv dashboard preview"
          />
        </div>
      </div>
    </section>
  );
}

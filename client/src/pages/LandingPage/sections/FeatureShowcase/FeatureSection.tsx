import { useState, useRef } from "react";
import styles from "./FeatureSection.module.css";
import ListenAndRepeat from "@/shared/assets/images/ListenAndRepeat.png";
import SmartReview from "@/shared/assets/images/SmartReview.png";
import BuildYourLesson from "@/shared/assets/images/BuildYourLesson.png";

export function FeatureSection() {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Smart repetition",
      description:
        "Phrases return at exactly the right moment—before they fade, never after they become boring.",
      img: SmartReview,
    },
    {
      title: "A voice you can follow",
      description:
        "Hear natural Czech, slow it down, then bring it back to real conversational speed.",
      img: ListenAndRepeat,
    },
    {
      title: "Lessons that fit your life",
      description:
        "Choose a topic, build a lesson, download the audio, and keep learning away from the screen.",
      img: BuildYourLesson,
    },
  ];

  const handleFeatureClick = (index: number) => {
    setActiveFeatureIdx(index);

    if (window.innerWidth <= 992) {
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };

  return (
    <div className={styles.section}>
      <header>
        <div className={styles.eyebrow}>WHY IT STICKS</div>
        <div className={styles.title}>
          Built for the way you learn,
          <br />
          made for the way you live.
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.preview} ref={previewRef}>
          <img
            key={features[activeFeatureIdx].img}
            src={features[activeFeatureIdx].img}
            alt={features[activeFeatureIdx].title}
          />
        </div>
        <div className={styles.featuresList}>
          {features.map((feature, index) => (
            <div
              onClick={() => handleFeatureClick(index)}
              data-active={activeFeatureIdx === index}
              key={index}
              className={styles.feature}
            >
              <div className={styles.number}>{index + 1}</div>
              <div className={styles.featureInfo}>
                <div className={styles.title}>{feature.title}</div>
                <div className={styles.description}>{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

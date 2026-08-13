import { Button } from "@/shared/ui/Button";
import styles from "./FAQSection.module.css";
import { PlayIcon } from "@/shared/assets/icons/PlayIcon";
import { Accordion } from "@/shared/ui/Accordion";

export function FAQSection() {
  const accordionItems = [
    {
      title: "What makes MLUV different from other language apps?",
      description:
        "Instead of isolated words and short exercises, MLUV teaches complete phrases through audio, context, and smart repetition.",
    },
    {
      title: "Are there ready-made lessons?",
      description:
        "Yes. You can start with structured lessons organized by topic and level, or generate a personalized lesson.",
    },
    {
      title: "What is Smart Repetition?",
      description:
        "Previously learned phrases return in future lessons, mixed with new material, so you keep practicing them until they become familiar. Older phrases gradually appear less often, while newer or more difficult ones are repeated more frequently until they stick.",
    },
    {
      title: "Can I see the lesson text while listening?",
      description:
        "Yes. Each lesson can include a transcript, vocabulary, translations, and useful phrases.",
    },
    {
      title: "Can I choose what I want to learn?",
      description:
        "Yes. You can generate lessons based on topics such as work, travel, restaurants, grammar, daily conversations, and more.",
    },
  ];

  return (
    <section className={styles.section}>
      <header>
        <div className={styles.eyebrow}>FAQ</div>
        <div className={styles.title}>
          Everything you need to know without guessing.
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.cto}>
          <img src="images/headphones.png" alt="headphones" />
          <div className={styles.ctoHeading}>Still deciding?</div>
          <div className={styles.ctoDescription}>
            Try out demo version before creating an account.
          </div>
          <Button
            className={styles.ctoButton}
            leadingIcon={<PlayIcon />}
            size="lg"
            variant="secondary"
          >
            Try Demo
          </Button>
        </div>
        <div className={styles.accordions}>
          {accordionItems.map((accordion) => (
            <Accordion
              title={accordion.title}
              description={accordion.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

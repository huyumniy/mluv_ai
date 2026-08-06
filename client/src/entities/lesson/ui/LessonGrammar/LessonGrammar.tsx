import type { GrammarContent } from "../../model"
import styles from "./LessonGrammar.module.css";

interface LessonGrammarProps {
    content: GrammarContent ;
}

export function LessonGrammar({
    content,
}: LessonGrammarProps) {
  return (
    <article className={styles.container}>
        <h3 className={styles.title}>{content.title}</h3>
        
        {content.paragraphs.map(
            (paragraph) => (
                <p className={styles.item} key={paragraph}>
                    {paragraph}
                </p>
            ),
        )}

        {content.points && (
            <ul className={styles.item}>
                {content.points.map((point) => (
                    <li className={styles.item} key={point}>
                        {point}
                    </li>
                ))}
            </ul>
        )}
    </article>
  );
}

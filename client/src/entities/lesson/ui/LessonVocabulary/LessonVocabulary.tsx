import { useState } from "react";
import type { VocabularyItem } from "../../model";
import styles from "./LessonVocabulary.module.css";

interface LessonVocabularyProps {
  items: VocabularyItem[];
}

export function LessonVocabulary({ items }: LessonVocabularyProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setActiveItemId((currentItemId) => 
        currentItemId === itemId ? null : itemId,
    )
  }

  const activeItem = items.find(
    (item) => item.id === activeItemId,
  );

  const displayedItems = activeItem
    ? [activeItem] : items;

  return (
    <div className={styles.container}>
      <h5>KEY WORDS</h5>
      <div className={styles.items}>
        {displayedItems.map((item) => (
          <article
            key={item.id}
            onClick={() => {
              handleItemClick(item.id);
            }}
            data-active={activeItemId == item.id}
            className={styles.item}
          >
            <p className={styles.original}>{item.word}</p>
            <p className={styles.translation}>{item.translation}</p>

            {item.note && activeItem && <span>{item.note}</span>}
          </article>
        ))}
      </div>
      <span className={styles.tip}>Tip: Learn aspect verbs as pair, not as unrelated words</span>
    </div>
  );
}

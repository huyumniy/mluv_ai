import { useState } from "react";
import styles from "./Accordion.module.css";
import type { AccordionProps } from "./Accordion.types";
import { ArrowDownIcon } from "@/shared/assets/icons/ArrowDownIcon";
import { ArrowUpIcon } from "@/shared/assets/icons/ArrowUpIcon";

export function Accordion({ title, description }: AccordionProps) {
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  return (
    <div
      data-active={isOpenDescription}
      onClick={() => setIsOpenDescription(!isOpenDescription)}
      className={styles.accordion}
    >
      <div className={styles.title}>
        {title}
        {isOpenDescription ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </div>
      {isOpenDescription && (
        <div className={styles.description}>{description}</div>
      )}
    </div>
  );
}

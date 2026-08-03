import clsx from "clsx";

import type { CardSurfaceProps } from "./CardSurface.types";

import styles from "./CardSurface.module.css";

export function CardSurface({
  children,
  orientation,
  className,
  ...articleProps
}: CardSurfaceProps) {
  return (
    <article
      className={clsx(
        styles.card,
        styles[orientation],
        className,
      )}
      {...articleProps}
    >
      {children}
    </article>
  );
}
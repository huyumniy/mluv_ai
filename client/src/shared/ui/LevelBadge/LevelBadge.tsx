import clsx from "clsx";
import type { LevelBadgeProps } from "./LevelBadge.type";
import styles from "./LevelBadge.module.css";

export function LevelBadge({ children, variant, className, ...props }: LevelBadgeProps) {
  return (
    <div data-level={variant} className={clsx(styles.levelBadge, className)} {...props}>
      {children}
    </div>
  );
}

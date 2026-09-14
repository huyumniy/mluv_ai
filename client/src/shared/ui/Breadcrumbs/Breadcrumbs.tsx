import { Link } from "react-router";

import styles from "./Breadcrumbs.module.css";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav
      className={styles.breadcrumbs}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast =
          index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className={styles.item}
          >
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className={styles.link}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={styles.current}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <span
                className={styles.separator}
              >
                /
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
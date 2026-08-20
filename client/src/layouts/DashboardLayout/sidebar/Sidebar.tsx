import { Button } from "@/shared/ui/Button";
import styles from "./Sidebar.module.css";
import { routes } from "@/app/config/routes";
import { Link } from "react-router";
import { useState } from "react";
import { HouseIcon } from "@/shared/assets/icons/HouseIcon";
import { PlusCircleIcon } from "@/shared/assets/icons/PlusCircleIcon";
import { BookOpenedIcon } from "@/shared/assets/icons/BookOpenedIcon";
import { SettingsIcon } from "@/shared/assets/icons/SettingsIcon";
import { ArrowLeftIcon } from "@/shared/assets/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/shared/assets/icons/ArrowRightIcon";

const pages = [
  {
    label: "Dashboard",
    icon: <HouseIcon className={styles.pageIcon} />,
    link: routes.dashboard,
  },
  {
    label: "Create Lesson",
    icon: <PlusCircleIcon className={styles.pageIcon} />,
    link: routes.createLesson,
  },
  {
    label: "Lessons",
    icon: <BookOpenedIcon className={styles.pageIcon} />,
    link: routes.lessons,
  },
  {
    label: "Settings",
    icon: <SettingsIcon className={styles.pageIcon} />,
    link: routes.settings,
  },
];

export function Sidebar() {
  const [isActivePage, setIsActivePage] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div data-active={isCollapsed} className={styles.sidebarWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/images/logo.png" alt="logo" />
          <span className={styles.logoText}>mluv</span>
        </div>
        <div className={styles.content}>
          {pages.map((page, idx) => (
            <Link to={page.link}>
              <Button
                onClick={() => setIsActivePage(idx)}
                data-active={isActivePage === idx}
                leadingIcon={page.icon}
                size="lg"
                variant="ternary"
                className={styles.pageButton}
              >
                {isCollapsed ? null : page.label}
              </Button>
            </Link>
          ))}
        </div>
      </aside>
      <Button
        size="sm"
        variant="primary"
        className={styles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ArrowLeftIcon className={styles.collapseIcon} />
        ) : (
          <ArrowRightIcon className={styles.collapseIcon} />
        )}
      </Button>
    </div>
  );
}

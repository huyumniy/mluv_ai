import clsx from "clsx";
import styles from "./Bottombar.module.css";
import { HouseIcon } from "@/shared/assets/icons/HouseIcon";
import { PlusCircleIcon } from "@/shared/assets/icons/PlusCircleIcon";
import { BookOpenedIcon } from "@/shared/assets/icons/BookOpenedIcon";
import { SettingsIcon } from "@/shared/assets/icons/SettingsIcon";
import { routes } from "@/app/config/routes";
import { Link } from "react-router";
import { Button } from "@/shared/ui/Button";
import { useState } from "react";
import type { LessonSummary } from "@/entities/lesson/model";
import { useLessonPlayer } from "@/features/lesson-player/model";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { formatDuration } from "@/shared/lib/formatDuration";
import { Tabs, type TabItem } from "@/shared/ui/Tabs";
import { ArrowPathIcon } from "@/shared/assets/icons/ArrowPathIcon";
import { RandomIcon } from "@/shared/assets/icons/RandomIcon";
import { PreviousIcon } from "@/shared/assets/icons/PreviousIcon";
import { NextIcon } from "@/shared/assets/icons/NextIcon";
import { SpeedIcon } from "@/shared/assets/icons/SpeedIcon";
import { AddToPlaylistIcon } from "@/shared/assets/icons/AddToPlaylistIcon";
import { EllipsisVerticalIcon } from "@/shared/assets/icons/EllipsisVerticalIcon";
import { Dropdown } from "@/shared/ui/Dropdown";
import { ArrowPathRepeatIcon } from "@/shared/assets/icons/ArrowPathRepeatIcon";

type MobilePlayerTab = "info" | "queue";

const tabItems: TabItem<MobilePlayerTab>[] = [
  {
    value: "queue",
    label: "Queue",
  },
  {
    value: "info",
    label: "Info",
  },
];

export function MobilePlayerExpanded() {
  const {
    activeLesson,
    queue,
    currentQueueIndex,
    next,
    previous,
    removeFromQueue,
    addToQueue,
    shuffleQueue,
    isPlaying,
    speed,
    changeSpeed,
    changeRepeatState,
    repeatQueueState,
    play,
    duration,
    currentTime,
    seek,
    playFromQueue,
  } = useLessonPlayer();

  const [activeTab, setActiveTab] = useState<MobilePlayerTab>("queue");
  const isInQueue = (lesson: LessonSummary) => {
    return queue.some((ln) => ln.id === lesson.id);
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const speeds = [1, 1.2, 1.5, 2] as const;
  const handleChangeSpeed = () => {
    const currentIndex = speeds.indexOf(speed as (typeof speeds)[number]);

    const nextIndex = (currentIndex + 1) % speeds.length;

    changeSpeed(speeds[nextIndex]);
  };
  return (
    <section className={styles.expandedPlayer}>
      <section className={styles.nowPlaying}>
        <img
          className={styles.cover}
          src={activeLesson?.imageSrc}
          alt={activeLesson?.title}
        />
        <div className={styles.lessonMeta}>
          <span className={styles.eyebrow}>NOW PLAYING</span>
          <h4 className={styles.lessonTitle}>{activeLesson?.title}</h4>
          <p className={styles.lessonTopic}>{activeLesson?.topic}</p>
          <div className={styles.quickActions}>
            <Button
              leadingIcon={<SpeedIcon className={styles.quickActionIcon} />}
              className={styles.quickActionButton}
              size="sm"
              variant="ternary"
              onClick={handleChangeSpeed}
            >
              {speed}x speed
            </Button>
            <Button
              leadingIcon={<AddToPlaylistIcon />}
              className={styles.quickActionButton}
              size="sm"
              variant="ternary"
              onClick={() => {
                if (!activeLesson) return;

                if (isInQueue(activeLesson)) {
                  removeFromQueue(activeLesson.id);
                } else {
                  addToQueue(activeLesson);
                }
              }}
            >
              {activeLesson && isInQueue(activeLesson) ? "Delete" : "Save"}
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.progressSection}>
        <input
          className={styles.audioWave}
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={seek}
        />
        <div className={styles.progressTime}>
          <span>{formatDuration(currentTime)}</span>

          <span>{formatDuration(duration)}</span>
        </div>
      </section>

      <section className={styles.playbackControls}>
        <Button
          className={styles.ternaryIcon}
          size="sm"
          variant="ternary"
          onClick={shuffleQueue}
        >
          <RandomIcon />
        </Button>
        <Button
          className={styles.secondaryIcon}
          size="md"
          variant="ternary"
          onClick={previous}
        >
          <PreviousIcon />
        </Button>

        <Button
          size="md"
          variant="primary"
          className={clsx(styles.iconButton, styles.primaryIcon)}
          onClick={play}
        >
          {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
        </Button>

        <Button
          className={styles.secondaryIcon}
          size="md"
          variant="ternary"
          onClick={next}
        >
          <NextIcon />
        </Button>

        <Button
          onClick={changeRepeatState}
          className={styles.ternaryIcon}
          data-active={repeatQueueState}
          size="sm"
          variant="ternary"
        >
          {repeatQueueState === "repeat-lesson" ? (
            <ArrowPathRepeatIcon />
          ) : (
            <ArrowPathIcon />
          )}
        </Button>
      </section>
      <Tabs<MobilePlayerTab>
        items={tabItems}
        value={activeTab}
        onValueChange={setActiveTab}
        ariaLabel="Lesson content"
        className={styles.tabs}
      />

      <div className={styles.tabContent}>
        {activeTab === "queue" && (
          <section className={styles.queue}>
            {queue.map((lesson, index) => {
              const dropdownItems = [
                {
                  id: "remove-from-queue",
                  label: "Delete from Queue",
                  destructive: true,
                  onClick: () => removeFromQueue(lesson.id),
                },
              ];
              return (
                <div
                  key={lesson.id}
                  className={styles.queueItem}
                  data-active={index === currentQueueIndex}
                  onClick={() =>
                    index !== currentQueueIndex && playFromQueue(index)
                  }
                >
                  <img
                    src={lesson.imageSrc}
                    alt=""
                    className={styles.queueImage}
                  />

                  <div className={styles.queueMeta}>
                    <span className={styles.queueTitle}>{lesson.title}</span>

                    <span className={styles.queueTopic}>{lesson.topic}</span>
                  </div>

                  <Button
                    className={styles.queueMoreButton}
                    size="sm"
                    variant="ternary"
                    onClick={(event) => {
                      event.stopPropagation();

                      setActiveDropdown((current) =>
                        current === lesson.id ? null : lesson.id,
                      );
                    }}
                  >
                    <EllipsisVerticalIcon />
                  </Button>
                  {activeDropdown === lesson.id && (
                    <Dropdown
                      className={styles.dropdown}
                      items={dropdownItems}
                      align="right"
                      defaultOpen={true}
                    />
                  )}
                </div>
              );
            })}
          </section>
        )}
        {activeTab === "info" && (
          <Link to={`/lessons/${activeLesson.id}`} className={styles.playerTab}>
            Info
          </Link>
        )}
      </div>
    </section>
  );
}

interface BottombarProps {
  className?: string;
}

const pages = [
  {
    label: "Dashboard",
    icon: <HouseIcon className={styles.pageIcon} />,
    link: routes.dashboard,
  },
  {
    label: "Create",
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

export function Bottombar({ className }: BottombarProps) {
  const { activeLesson, isPlaying, play, duration, currentTime, seek } =
    useLessonPlayer();
  const [isActivePage, setIsActivePage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  return (
    <aside
      className={clsx(styles.bottombar, className)}
      data-expanded={expanded}
    >
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className={styles.swipeHandle}
      />
      {expanded ? (
        <MobilePlayerExpanded />
      ) : (
        <>
          {activeLesson && (
            <div className={styles.lessonPlayer}>
              <div className={styles.lessonInfo}>
                <div className={styles.icon}>
                  <img src={activeLesson.imageSrc} alt={activeLesson.title} />
                </div>
                <div className={styles.content}>
                  <h5 className={styles.title}>{activeLesson.title}</h5>
                  <p className={styles.text}>{activeLesson.topic}</p>
                </div>
              </div>
              <div className={styles.audiobar}>
                <input
                  className={styles.audioWave}
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={seek}
                />

                <button
                  className={clsx(styles.iconButton, styles.playIcon)}
                  onClick={play}
                >
                  {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
                </button>
              </div>
            </div>
          )}

          <nav className={styles.buttons}>
            {pages.map((page, idx) => (
              <Link key={page.link} to={page.link}>
                <Button
                  onClick={() => setIsActivePage(idx)}
                  data-active={isActivePage === idx}
                  leadingIcon={page.icon}
                  size="sm"
                  variant="ternary"
                  className={styles.pageButton}
                >
                  {page.label}
                </Button>
              </Link>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
}

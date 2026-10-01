import { useLessonPlayer } from "@/features/lesson-player/model";
import clsx from "clsx";
import { useState } from "react";
import styles from "./Miniplayer.module.css";
import { Tabs, type TabItem } from "@/shared/ui/Tabs";
import type { LessonSummary } from "@/entities/lesson/model";
import { Button } from "@/shared/ui/Button";
import { SpeedIcon } from "@/shared/assets/icons/SpeedIcon";
import { formatDuration } from "@/shared/lib/formatDuration";
import { RandomIcon } from "@/shared/assets/icons/RandomIcon";
import { PreviousIcon } from "@/shared/assets/icons/PreviousIcon";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { ArrowPathRepeatIcon } from "@/shared/assets/icons/ArrowPathRepeatIcon";
import { NextIcon } from "@/shared/assets/icons/NextIcon";
import { EllipsisVerticalIcon } from "@/shared/assets/icons/EllipsisVerticalIcon";
import { Dropdown } from "@/shared/ui/Dropdown";
import { Link } from "react-router";
import { ArrowPathIcon } from "@/shared/assets/icons/ArrowPathIcon";
import { ExpandIcon } from "@/shared/assets/icons/ExpandIcon";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { XMarkIcon } from "@/shared/assets/icons/XMarkIcon";
import { PlusIcon } from "@/shared/assets/icons/PlusIcon";
import MinusIcon from "@/shared/assets/icons/MinusIcon";
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

interface MiniPlayerExpandedProps {
    setExpanded: (expanded: boolean) => void;
}

export function MiniPlayerExpanded({ setExpanded }: MiniPlayerExpandedProps) {
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isInQueue = (lesson: LessonSummary) => {
    return queue.some((ln) => ln.id === lesson.id);
  };

  const speeds = [1, 1.2, 1.5, 2] as const;
  const handleChangeSpeed = () => {
    const currentIndex = speeds.indexOf(speed as (typeof speeds)[number]);

    const nextIndex = (currentIndex + 1) % speeds.length;

    changeSpeed(speeds[nextIndex]);
  };
  return (
    <div className={styles.expandedPlayer}>
      <div className={styles.playerMain}>
        <div className={styles.activeLessonImage}>
          <img src={activeLesson?.imageSrc} alt={activeLesson?.title} />
        </div>
        <div className={styles.nowPlayingTitle}>now playing</div>
        <div className={styles.activeLessonTitle}>{activeLesson?.title}</div>
        <div className={styles.activeLessonTopic}>{activeLesson?.topic}</div>
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
        <section className={styles.playbackControlsExpanded}>
          <Button
            className={styles.ternaryIcon}
            size="sm"
            variant="ternary"
            onClick={shuffleQueue}
          >
            <RandomIcon />
          </Button>
          <Button
            className={styles.secondaryIconExpanded}
            size="md"
            variant="ternary"
            onClick={previous}
          >
            <PreviousIcon />
          </Button>

          <Button
            size="md"
            variant="primary"
            className={clsx(styles.iconButton, styles.primaryIconExpanded)}
            onClick={play}
          >
            {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
          </Button>

          <Button
            className={styles.secondaryIconExpanded}
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
        <div className={styles.quickActions}>
          <Button
            leadingIcon={<SpeedIcon className={styles.quickActionIcon} />}
            className={styles.quickActionButton}
            size="sm"
            variant="secondary"
            onClick={handleChangeSpeed}
          >
            {speed}x speed
          </Button>
          <Button
            leadingIcon={activeLesson && isInQueue(activeLesson) ? <MinusIcon /> : <PlusIcon />}
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
            {activeLesson && isInQueue(activeLesson) ? "Remove from playlist" : "Add to playlist"}
          </Button>
        </div>
      </div>
      <div className={styles.playerSidebar}>
        <div className={styles.backdropButtons}>
          {/*TODO: onClick close miniplayer and miniplayerExpanded, until new lesson is played. */}
          <Button
            onClick={() => setExpanded(false)}
            className={styles.backdropButton}
            size="sm"
            variant="ternary"
          >
            <XMarkIcon />
          </Button>
          {/* TODO: Add minimize button that setExpanded(false). */}
        </div>
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

                      <div className={styles.queueDuration}>
                        <span>{formatDuration(lesson.durationMinutes * 60)}</span>
                      </div>
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
            <Link
              to={`/lessons/${activeLesson?.id}`}
              className={styles.playerTab}
            >
              Info
            </Link>
          )}
        </div>
        <Button
          className={styles.ternaryIcon}
          size="sm"
          variant="ternary"
          leadingIcon={<RandomIcon />}
          onClick={shuffleQueue}
        >
          Shuffle queue
        </Button>
      </div>
    </div>
  );
}

interface MiniplayerProps {
  className?: string;
}

export function Miniplayer({ className }: MiniplayerProps) {
  const {
    activeLesson,
    seek,
    duration,
    currentTime,
    next,
    previous,
    isPlaying,
    play,
  } = useLessonPlayer();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {activeLesson && (
        <aside
          className={clsx(styles.miniplayer, className)}
          data-expanded={expanded}
        >
          <div className={styles.icon}>
            <img src={activeLesson.imageSrc} alt={activeLesson.title} />
          </div>
          <div className={styles.info}>
            <div className={styles.title}>{activeLesson.title}</div>
            <div className={styles.topic}>{activeLesson.topic}</div>
            <input
              className={styles.progressSlider}
              type="range"
              min={0}
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={seek}
            />
            <div className={styles.time}>
              <span>{formatDuration(currentTime)}</span>

              <span>{formatDuration(duration)}</span>
            </div>

            <div className={styles.time}></div>
          </div>
          <div className={styles.playbackControls}>
            <Button
              className={styles.secondaryIconMini}
              size="md"
              variant="ternary"
              onClick={previous}
            >
              <PreviousIcon />
            </Button>

            <Button
              size="md"
              variant="primary"
              className={clsx(styles.iconButton, styles.primaryIconMini)}
              onClick={play}
            >
              {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
            </Button>

            <Button
              className={styles.secondaryIconMini}
              size="md"
              variant="ternary"
              onClick={next}
            >
              <NextIcon />
            </Button>
          </div>
          <Button
            onClick={() => setExpanded(true)}
            className={styles.expandButton}
            size="sm"
            variant="ternary"
          >
            <ExpandIcon />
          </Button>
        </aside>
      )}

      {activeLesson && expanded && (
        <div className={styles.backdrop}>
          <MiniPlayerExpanded setExpanded={setExpanded} />
        </div>
      )}
    </>
  );
}

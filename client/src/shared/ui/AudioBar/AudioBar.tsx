import clsx from "clsx";

import styles from "./AudioBar.module.css";
import { useLessonPlayer } from "@/features/lesson-player/model";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { SpeakerWaveIcon } from "@/shared/assets/icons/SpeakerWaveIcon";
import { SpeakerWaveMutedIcon } from "@/shared/assets/icons/SpeakerWaveMutedIcon";
import type { AudioBarProps } from "./AudioBar.types";
import { formatDuration } from "@/shared/lib/formatDuration";

export function AudioBar({ lesson, className }: AudioBarProps) {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    play,
    mute,
    seek,
  } = useLessonPlayer(lesson);


  return (
    <div className={clsx(styles.audiobarCard, className)}>
      <button
        className={clsx(styles.iconButton, styles.playIcon)}
        onClick={play}
      >
        {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </button>
      <input
        className={styles.audioWave}
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={seek}
      />

      <div className={styles.trackDuration}>
        <p>{formatDuration(currentTime)}</p>/<p>{formatDuration(duration)}</p>
      </div>

      <button
        className={clsx(styles.iconButton, styles.muteIcon)}
        onClick={mute}
      >
        {isMuted ? <SpeakerWaveMutedIcon /> : <SpeakerWaveIcon />}
      </button>
    </div>
  );
}

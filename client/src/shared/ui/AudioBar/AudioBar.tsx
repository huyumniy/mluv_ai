import React, { useRef, useState, useEffect } from "react";
import clsx from "clsx";

import styles from "./AudioBar.module.css";
import { PlayCircleIcon } from "@/shared/assets/icons/PlayCircleIcon";
import { PauseCircleIcon } from "@/shared/assets/icons/PauseCircleIcon";
import { SpeakerWaveIcon } from "@/shared/assets/icons/SpeakerWaveIcon";
import { SpeakerWaveMutedIcon } from "@/shared/assets/icons/SpeakerWaveMutedIcon";

import temp from "@/shared/assets/audios/temp.mp3";

export function AudioBar({ lesson, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const handleSeek = (event) => {
    const time = Number(event.target.value);

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handlePlay = async () => {
    const audio = audioRef.current;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Cannot play audio:", error));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  function formatDuration(durationSeconds) {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60);
    const formattedSecconds = seconds.toString().padStart(2, "0");

    return `${minutes}:${formattedSecconds}`;
  }

  return (
    <div className={clsx(styles.audiobarCard, className)}>
      <button
        className={clsx(styles.iconButton, styles.playIcon)}
        onClick={handlePlay}
      >
        {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </button>
      <input
        className={styles.audioWave}
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />
      <div className={styles.audioContainer}>
        <audio
          ref={audioRef}
          src={temp}
          onLoadedMetadata={() => {
            setDuration(audioRef.current.duration);
          }}
          onTimeUpdate={() => {
            setCurrentTime(audioRef.current.currentTime);
          }}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      <div className={styles.trackDuration}>
        <p>{formatDuration(currentTime)}</p>/<p>{formatDuration(duration)}</p>
      </div>

      <button
        className={clsx(styles.iconButton, styles.muteIcon)}
        onClick={handleMute}
      >
        {isMuted ? <SpeakerWaveMutedIcon /> : <SpeakerWaveIcon />}
      </button>
    </div>
  );
}

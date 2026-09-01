import { useEffect, useRef, useState, type ReactNode } from "react";

import type { LessonSummary } from "@/entities/lesson/model";

import { LessonPlayerContext } from "./lessonPlayer.context";
import { shuffle } from "@/shared/lib/shuffleArray";
import type { PlaybackSpeed, RepeatQueueStatus } from "./lessonPlayer.types";

interface LessonPlayerProviderProps {
  children: ReactNode;
}

export function LessonPlayerProvider({ children }: LessonPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [activeLesson, setActiveLesson] = useState<LessonSummary | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueueState] = useState<LessonSummary[]>([]);
  const [speed, setSpeed] = useState(1);
  const [repeatQueueState, setRepeatQueueState] =
    useState<RepeatQueueStatus>("repeat-lesson");
  const repeatQueueStateRef = useRef(repeatQueueState);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const queueRef = useRef(queue);
  const currentQueueIndexRef = useRef(currentQueueIndex);

  const seek = (time: number) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const startLesson = async (lesson: LessonSummary) => {
    const audio = audioRef.current;

    if (!lesson.audioSrc) return;

    audio.src = lesson.audioSrc;
    audio.currentTime = 0;

    setActiveLesson(lesson);
    setCurrentTime(0);
    setDuration(0);

    await audio.play();

    setIsPlaying(true);
  };

  const playLesson = async (lesson: LessonSummary) => {
    const audio = audioRef.current;

    const isSameLesson = activeLesson?.id === lesson.id;

    if (isSameLesson) {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }

      return;
    }

    const queueIndex = queue.findIndex((item) => item.id === lesson.id);

    if (queueIndex !== -1) {
      currentQueueIndexRef.current = queueIndex;
      setCurrentQueueIndex(queueIndex);
    }

    await startLesson(lesson);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !activeLesson) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }

    return;
  };

  const setQueue = (lessons: LessonSummary[]) => {
    setQueueState(lessons);

    if (!activeLesson) {
      setCurrentQueueIndex(-1);
      return;
    }

    const index = lessons.findIndex((lesson) => lesson.id === activeLesson.id);

    setCurrentQueueIndex(index);
  };

  const shuffleQueue = () => {
    setQueue(shuffle(queue));
  };

  const changeRepeatState = () => {
    setRepeatQueueState((current) => {
      if (current === "no-repeat") {
        return "repeat-playlist";
      }

      if (current === "repeat-playlist") {
        return "repeat-lesson";
      }

      return "no-repeat";
    });
  };

  const playFromQueue = async (index: number) => {
    const lesson = queue[index];

    if (!lesson) return;

    currentQueueIndexRef.current = index;
    setCurrentQueueIndex(index);

    await startLesson(lesson);
  };

  const addToQueue = (lesson: LessonSummary) => {
    setQueueState((currentQueue) => {
      const alreadyExists = currentQueue.some((item) => item.id === lesson.id);

      if (alreadyExists) {
        return currentQueue;
      }

      return [...currentQueue, lesson];
    });
  };

  const removeFromQueue = (lessonId: string) => {
    setQueueState((currentQueue) =>
      currentQueue.filter((lesson) => lesson.id !== lessonId),
    );
  };

  const playNext = async () => {
    if (queue.length === 0) return;

    const nextIndex = currentQueueIndex + 1;

    if (nextIndex >= queue.length) {
      setIsPlaying(false);
      return;
    }

    const nextLesson = queue[nextIndex];

    currentQueueIndexRef.current = nextIndex;
    setCurrentQueueIndex(nextIndex);

    await startLesson(nextLesson);
  };

  const playPrevious = async () => {
    if (queue.length === 0) return;

    const previousIndex = currentQueueIndex - 1;

    if (previousIndex < 0) {
      return;
    }

    const previousLesson = queue[previousIndex];

    setCurrentQueueIndex(previousIndex);

    await startLesson(previousLesson);
  };

  const clear = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.src = "";
    }

    setActiveLesson(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const changeSpeed = (speed: PlaybackSpeed) => {
    audioRef.current.playbackRate = speed;
    setSpeed(speed);
  }

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentQueueIndexRef.current = currentQueueIndex;
  }, [currentQueueIndex]);

  useEffect(() => {
    repeatQueueStateRef.current = repeatQueueState;
  }, [repeatQueueState]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = async () => {
      const currentQueue = queueRef.current;
      const currentIndex = currentQueueIndexRef.current;
      const repeatState = repeatQueueStateRef.current;

      let nextIndex = currentIndex + 1;

      if (repeatState === "repeat-lesson") {
        nextIndex = currentIndex;
      }

      const isLastLesson =
        currentIndex === -1 || nextIndex >= currentQueue.length;
      if (repeatState === "repeat-playlist" && isLastLesson) {
        nextIndex = 0;
      } else if (repeatState === "no-repeat" && isLastLesson) {
        setIsPlaying(false);
        return;
      }

      const nextLesson = currentQueue[nextIndex];

      currentQueueIndexRef.current = nextIndex;
      setCurrentQueueIndex(nextIndex);

      await startLesson(nextLesson);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();

      audio.removeEventListener("timeupdate", handleTimeUpdate);

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <LessonPlayerContext.Provider
      value={{
        activeLesson,
        queue,
        currentQueueIndex,
        isPlaying,
        isMuted,
        currentTime,
        duration,

        playLesson,
        togglePlay,

        setQueue,
        addToQueue,
        removeFromQueue,
        playFromQueue,
        shuffleQueue,
        repeatQueueState,
        changeRepeatState,
        speed,
        changeSpeed,

        playNext,
        playPrevious,

        seek,
        clear,
        toggleMute,
      }}
    >
      {children}
    </LessonPlayerContext.Provider>
  );
}

import type { LessonSummary } from "@/entities/lesson/model";

export type RepeatQueueStatus =
  | "repeat-playlist"
  | "no-repeat"
  | "repeat-lesson";

export type PlaybackSpeed = 1 | 1.2 | 1.5 | 2;

export interface LessonPlayerState {
    activeLesson: LessonSummary | null;
    queue: LessonSummary[];
    currentQueueIndex: number;
    isPlaying: boolean;
    isMuted: boolean;
    currentTime: number;
    duration: number;
    speed: number;
    changeRepeatState: RepeatQueueStatus;
}

export interface LessonPlayerActions {
    playLesson: (lesson: LessonSummary) => Promise<void>;

    setQueue: (lesson: LessonSummary[]) => void;
    addToQueue: (lesson: LessonSummary[]) => void;
    removeFromQueue: (lesson: LessonSummary[]) => void;

    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    playFromQueue: (index: number) => Promise<void>;
    shuffleQueue: () => void;
    repeatQueueState: () => void;
    changeSpeed: (speed: number) => void;
    togglePlay: () => Promise<void>;
    toggleMute: () => void;
    seek: (time: number) => void;
    clear: () => void;
}

export type LessonPlayerContextValue =
    LessonPlayerState & LessonPlayerActions;

import { useContext } from "react";

import {
    LessonPlayerContext,
} from "./lessonPlayer.context";
import type { LessonSummary } from "@/entities/lesson/model";

export function useLessonPlayer(lesson?: LessonSummary) {
    const context = useContext(LessonPlayerContext);
    
        if (!context) {
            throw new Error(
                "useLessonPlayer must be used inside LessonPlayerProvider",
            )
        }

        const isActive = lesson
            ? context.activeLesson?.id === lesson.id
            : true;

        return {
            activeLesson: context.activeLesson,
            queue: context.queue,
            currentQueueIndex: context.currentQueueIndex,
            isPlaying: isActive && context.isPlaying,
            isMuted: isActive && context.isMuted,
            currentTime: isActive ? context.currentTime : 0,
            duration: isActive ? context.duration : lesson ? lesson.durationMinutes * 60 : 0,
            speed: context.speed,
            repeatQueueState: context.repeatQueueState,
            play: () => {
                if (lesson) {
                    context.playLesson(lesson);
                    return;
                };

                context.togglePlay();
            },
            
            next: context.playNext,
            previous: context.playPrevious,
            playFromQueue: context.playFromQueue,

            addToQueue: context.addToQueue,
            removeFromQueue: context.removeFromQueue,
            setQueue: context.setQueue,
            shuffleQueue: context.shuffleQueue,
            changeRepeatState: context.changeRepeatState,
            changeSpeed: context.changeSpeed,
            
            mute: () => {
                if (isActive) {
                    context.toggleMute();
                }
            },
            seek: (time: React.ChangeEvent<HTMLInputElement>) => {
                if (isActive) {
                    context.seek(Number(time.target.value));
                }
            },
        }
}

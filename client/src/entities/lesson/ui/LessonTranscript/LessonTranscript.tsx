import type { TranscriptLine } from "../../model";

interface LessonTranscriptProps {
    lines: TranscriptLine[];
}
import styles from "./LessonTranscript.module.css"

export function LessonTranscript({
    lines,
}: LessonTranscriptProps) {
    return (
        <div className={styles.container}>
            {lines.map((line) => (
                <div key={line.id} className={styles.item}>
                    <p className={styles.original}>{line.original}</p>
                    <p className={styles.translation}>{line.translation}</p>
                </div>
            ))}
        </div>
    )
}

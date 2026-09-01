export function formatDuration(durationSeconds: number) {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60);
    const formattedSecconds = seconds.toString().padStart(2, "0");

    return `${minutes}:${formattedSecconds}`;
}

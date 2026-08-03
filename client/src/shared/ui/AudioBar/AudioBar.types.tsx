import type {
  AudioHTMLAttributes,
  CSSProperties,
} from "react";

export type AudioBarSize =
  | "big"
  | "card"
  | "table"
  | "mobile";

export interface AudioBarProps
  extends Omit<
    AudioHTMLAttributes<HTMLAudioElement>,
    "src"
  > {
  src: string;

  size?: AudioBarSize;
  barCount?: number;

  className?: string;
  style?: CSSProperties;

  onPlayChange?: (isPlaying: boolean) => void;
  onProgressChange?: (
    currentTime: number,
    duration: number,
  ) => void;
}
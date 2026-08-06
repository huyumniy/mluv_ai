import type {
  AudioHTMLAttributes,
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
  src: string | undefined;

  size?: AudioBarSize;

  className?: string;
}
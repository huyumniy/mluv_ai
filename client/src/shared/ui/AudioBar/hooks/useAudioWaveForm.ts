import { useMemo } from "react";

interface UseAudioWaveformOptions {
  src: string;
  barCount: number;
}

export function useAudioWaveform({
  src,
  barCount,
}: UseAudioWaveformOptions): number[] {
  return useMemo(() => {
    let seed = 0;

    for (let index = 0; index < src.length; index += 1) {
      seed =
        (seed * 31 + src.charCodeAt(index)) %
        2_147_483_647;
    }

    const random = () => {
      seed = (seed * 48_271) % 2_147_483_647;

      return seed / 2_147_483_647;
    };

    return Array.from(
      { length: barCount },
      () => {
        return 0.2 + random() * 0.8;
      },
    );
  }, [barCount, src]);
}
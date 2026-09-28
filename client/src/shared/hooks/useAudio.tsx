import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playingSrc, setPlayingSrc] =
    useState<string | null>(null);

  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;

    setPlayingSrc(null);
  }, []);

  const toggle = useCallback(
    async (src: string) => {
      if (playingSrc === src) {
        stop();
        return;
      }

      stop();

      const audio = new Audio(src);

      audioRef.current = audio;

      audio.onended = () => {
        audioRef.current = null;
        setPlayingSrc(null);
      };

      await audio.play();

      setPlayingSrc(src);
    },
    [playingSrc, stop],
  );

  useEffect(() => {
    return stop;
  }, [stop]);

  return {
    playingSrc,
    toggle,
  };
}
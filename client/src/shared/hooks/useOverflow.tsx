import {
  useLayoutEffect,
  useState,
} from "react";

import type { RefObject } from "react";

interface UseOverflowOptions {
  containerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  dependency?: unknown;
}

export function useOverflow({
  containerRef,
  contentRef,
  dependency,
}: UseOverflowOptions): boolean {
  const [hasOverflow, setHasOverflow] =
    useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
      return;
    }

    const checkOverflow = () => {
      setHasOverflow(
        content.scrollHeight >
          container.clientHeight + 1,
      );
    };

    checkOverflow();

    const observer = new ResizeObserver(
      checkOverflow,
    );

    observer.observe(container);
    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [
    containerRef,
    contentRef,
    dependency,
  ]);

  return hasOverflow;
}
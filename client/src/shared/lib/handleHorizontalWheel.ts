import type { WheelEvent } from "react";

export const handleHorizontalWheel = (
  event: WheelEvent<HTMLElement>,
) => {
  const container = event.currentTarget;

  const maxScrollLeft =
    container.scrollWidth -
    container.clientWidth;

  const scrollingRight =
    event.deltaY > 0 &&
    container.scrollLeft < maxScrollLeft;

  const scrollingLeft =
    event.deltaY < 0 &&
    container.scrollLeft > 0;

  if (
    scrollingRight ||
    scrollingLeft
  ) {
    event.preventDefault();

    container.scrollLeft +=
      event.deltaY;
  }
};

import type { HTMLAttributes } from "react";

export type StatusType = "listened" | "not-started" | "continue";

export interface StatusTagProps extends HTMLAttributes<HTMLElement> {
  children: string;
  variant: StatusType;
}

import type { ReactNode } from "react";

export interface DropdownItem {
  id: string;

  label: ReactNode;
  icon?: ReactNode;

  onClick?: () => void;

  destructive?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];

  align?: "left" | "right";

  className?: string;
}
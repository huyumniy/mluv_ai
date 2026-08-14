import type { ReactNode } from "react";

export interface SelectOption<
  TValue extends string = string,
> {
  value: TValue;
  label: ReactNode;

  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<
  TValue extends string = string,
> {
  value: TValue;
  options: readonly SelectOption<TValue>[];

  onValueChange: (value: TValue) => void;

  placeholder?: string;

  align?: "left" | "right";

  className?: string;
}
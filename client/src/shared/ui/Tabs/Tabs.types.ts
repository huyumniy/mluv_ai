import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export interface TabItem<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<TValue extends string = string> {
  items: readonly TabItem<TValue>[];
  value: TValue;

  onValueChange: (value: TValue) => void;

  ariaLabel?: string;
  className?: string;

  tabButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "value" | "onClick"
  >;
}
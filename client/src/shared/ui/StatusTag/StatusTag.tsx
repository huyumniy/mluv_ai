import clsx from "clsx";
import type { StatusTagProps } from "./StatusTag.type";
import styles from "./StatusTag.module.css";
import { CheckCircleIcon } from "@/shared/assets/icons/CheckCircleIcon";

export function StatusTag({
  children,
  variant,
  className,
  ...props
}: StatusTagProps) {
  return (
    <div
      data-level={variant}
      className={clsx(styles.statusTag, className)}
      {...props}
    >
      {variant === "listened" && <CheckCircleIcon />}
      {children}
    </div>
  );
}

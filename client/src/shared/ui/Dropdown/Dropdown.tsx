import { useCallback, useRef, useState } from "react";

import clsx from "clsx";

import type { DropdownProps } from "./Dropdown.types";

import styles from "./Dropdown.module.css";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

export function Dropdown({
  trigger,
  items,
  align = "left",
  className,
  defaultOpen = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setIsOpen(false)
  }, []);
  
  useClickOutside(dropdownRef, handleClickOutside)

  const handleItemClick = (item: DropdownProps["items"][number]) => {
    if (item.disabled) {
      return;
    }

    item.onClick?.();

    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={clsx(styles.dropdown, className)}>
      {trigger && (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {trigger}
        </button>
      )}

      {isOpen && (
        <div
          className={clsx(styles.menu, align === "right" && styles.alignRight)}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={clsx(
                styles.item,
                item.destructive && styles.destructive,
              )}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}

              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

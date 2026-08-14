import { useCallback, useRef, useState } from "react";

import clsx from "clsx";

import type { SelectOption, SelectProps } from "./Select.types";

import styles from "./Select.module.css";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

export function Select<TValue extends string>({
  value,
  options,
  onValueChange,

  placeholder = "Select",
  align = "left",

  className,
}: SelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
        const rect =
        triggerRef.current.getBoundingClientRect();

        const spaceBelow =
        window.innerHeight - rect.bottom;

        setOpenUpward(spaceBelow < 250);
    }

    setIsOpen((current) => !current);
  };

  const handleSelect = (option: SelectOption<TValue>) => {
    if (option.disabled) {
      return;
    }

    onValueChange(option.value);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback(() => {
    setIsOpen(false)
  }, []);

  useClickOutside(selectRef, handleClickOutside)

  return (
    <div ref={selectRef} className={clsx(styles.select, className)}>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        ref={triggerRef}
      >
        <span className={styles.selectedContent}>
          {selectedOption?.icon && (
            <span className={styles.icon}>{selectedOption.icon}</span>
          )}

          <span>{selectedOption?.label ?? placeholder}</span>
        </span>

        <span className={styles.chevron} data-open={isOpen} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className={clsx(styles.menu, openUpward && styles.openUpward, align === "right" && styles.alignRight)}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                className={styles.option}
                data-selected={isSelected}
                onClick={() => handleSelect(option)}
              >
                {option.icon && (
                  <span className={styles.icon}>{option.icon}</span>
                )}

                <span className={styles.label}>{option.label}</span>

                {isSelected && <span className={styles.check}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

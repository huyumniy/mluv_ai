import clsx from "clsx";
import type {
    TabItem,
    TabsProps,
} from "./Tabs.types";

import styles from "./Tabs.module.css";

export function Tabs<TValue extends string>({
    items,
    value,
    onValueChange,
    ariaLabel = "Tabs",
    className,
}: TabsProps<TValue>) {
    return (
        <div
            className={clsx(styles.tabs, className)}
            role="tablist"
            aria-label={ariaLabel}
        >
            {items.map((item) => {
                const isActive = item.value === value;

                return (
                    <button
                        key={item.value}
                        type="button"
                        className={styles.tab}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        disabled={item.disabled}
                        data-active={isActive}
                        onClick={() => {
                            onValueChange(item.value);
                        }}
                    >
                        {item.label}
                    </button>
                )
            })}

        </div>
    );
}

import clsx from "clsx";
import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

export function Button({
    children,
    variant = "primary",
    size = "md",
    leadingIcon = null,
    trailingIcon = null,
    disabled = false,
    loading = false,
    className,
    ...buttonProps
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                className,
            )}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            {...buttonProps}
        >
            {loading && (
                <span
                    className={styles.spinner}
                    aria-hidden="true"
                />
            )}

            {!loading && leadingIcon && (
                <span
                    className={styles.icon}
                    aria-hidden="true"
                >
                    {leadingIcon}
                </span>
            )}

            <span className={styles.label}>
                {children}
            </span>

            {!loading && trailingIcon && (
                <span
                    className={styles.icon}
                    aria-hidden="true"
                    >
                        {trailingIcon}
                    </span>
            )}
        </button>
    )
}

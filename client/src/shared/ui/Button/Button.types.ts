import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react"

export type ButtonVariant = 
| "primary"
| "secondary"
| "ternary"
| "disabled";

export type ButtonSize =
| "sm"
| "md"
| "lg";

export interface ButtonProps
extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;

    variant?: ButtonVariant;
    size?: ButtonSize;

    fullWidth?: boolean;
    loading?: boolean;

    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
}

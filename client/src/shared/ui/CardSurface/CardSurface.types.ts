import type {
    HTMLAttributes,
    ReactNode,
} from "react";

export interface CardSurfaceProps
    extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    orientation: string;
}

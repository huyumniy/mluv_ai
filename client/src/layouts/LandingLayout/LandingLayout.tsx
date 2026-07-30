import { Outlet } from "react-router";

import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";

import styles from "./LandingLayout.module.css"

export function LandingLayout() {
    return (
        <div className={styles.layout}>
            <LandingHeader />

            <main className={styles.main}>
                <Outlet />
            </main>

            <LandingFooter />
        </div>
    )
}
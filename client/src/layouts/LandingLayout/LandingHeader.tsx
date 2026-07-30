import { Link, NavLink } from "react-router";
import { routes } from "@/app/config/routes";
import styles from "./LandingHeader.module.css";
import { Button } from "@/shared/ui/Button";

export function LandingHeader() {
  return (
    <header className={styles.header}>
        <div className={styles.container}>
            <Link 
                to={routes.landing}
                className={styles.logo}
                aria-label="Mluv home"
            >
                Mluv
            </Link>

            <nav 
                className={styles.navigation}
                aria-label="Main navigation"
            >
                <a href="/#features">Features</a>
                <a href="/#how-it-works">How it works</a>
                <a href="/#pricing">Pricing</a>
                <a href="/#faq">FAQ</a>
            </nav>

            <div className={styles.actions}>
                <NavLink to={routes.login}>
                    <Button variant="secondary" size="md">Log In</Button>
                </NavLink>

                <NavLink to={routes.register}>
                    <Button variant="primary" size="md">Get Started Free</Button>
                </NavLink>
            </div>
        </div>
    </header>
  )
}

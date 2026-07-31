import { Link, NavLink } from "react-router";
import { routes } from "@/app/config/routes";
import styles from "./LandingHeader.module.css";
import { Button } from "@/shared/ui/Button";
import { MenubarIcon } from "@/shared/assets/icons/MenubarIcon";
import { XMarkIcon } from "@/shared/assets/icons/XMarkIcon";
import { useState, useEffect } from "react";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((currentValue) => !currentValue);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMenu}
          >
            <MenubarIcon className={styles.menubarIcon} />
          </button>
          <img className={styles.logoIcon} src="/images/logo.png" alt="Logo" />
          <Link
            to={routes.landing}
            className={styles.logo}
            aria-label="Mluv home"
          >
            MLUV AI
          </Link>
        </div>
        <div className={styles.mobileMenu} data-open={isMenuOpen}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <XMarkIcon />
          </button>
          <nav
            id="mobile-navigation"
            className={styles.mobileNavigation}
            aria-label="MobileNavigation"
          >
            <NavLink to="/features" onClick={closeMenu}>
              Features
            </NavLink>

            <NavLink to="/how-it-works" onClick={closeMenu}>
              How it works
            </NavLink>

            <NavLink to="/pricing" onClick={closeMenu}>
              Pricing
            </NavLink>

            <NavLink to="/faq" onClick={closeMenu}>
              FAQ
            </NavLink>
          </nav>
        </div>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
        </nav>

        <div className={styles.actions}>
          <NavLink to={routes.login}>
            <Button className={styles.headerButton} variant="secondary" size="lg">
              Log In
            </Button>
          </NavLink>

          <NavLink to={routes.register}>
            <Button className={styles.headerButton} variant="primary" size="lg">
              Get Started Free
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

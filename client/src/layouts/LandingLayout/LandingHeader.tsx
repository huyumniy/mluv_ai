import { Link } from "react-router";
import { routes } from "@/app/config/routes";
import styles from "./LandingHeader.module.css";
import { Button } from "@/shared/ui/Button";
import { MenubarIcon } from "@/shared/assets/icons/MenubarIcon";
import { XMarkIcon } from "@/shared/assets/icons/XMarkIcon";
import { useState, useEffect } from "react";

const navigationItems = [
  {
    label: "How it works",
    href: routes.howItWorks,
  },
  {
    label: "Features",
    href: routes.features,
  },
  {
    label: "Pricing",
    href: routes.pricing,
  },
  {
    label: "FAQ",
    href: routes.faq,
  },
];

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
    <header className={styles.header} data-active={isMenuOpen}>
      <div className={styles.container}>
        <div className={styles.headerStart}>
          <Link
            to={routes.landing}
            className={styles.brand}
            aria-label="Mluv home"
          >
            <img
              className={styles.logoIcon}
              src="/images/logo.png"
              alt="Logo"
            />
            <span className={styles.logo}>MLUV AI</span>
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <XMarkIcon className={styles.menuIcon} />
            ) : (
              <MenubarIcon className={styles.menuIcon} />
            )}
          </button>
        </div>

        <nav className={styles.navigation} aria-label="navigation">
          {navigationItems.map((item) => (
            <a onClick={closeMenu} key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a href={routes.login}>
            <Button
              className={styles.headerButton}
              variant="secondary"
              size="lg"
            >
              Log In
            </Button>
          </a>

          <a href={routes.register}>
            <Button className={styles.headerButton} variant="primary" size="lg">
              Sign up
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

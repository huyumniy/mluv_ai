import { footerGroups } from "./footer.data";
import styles from "./LandingFooter.module.css";
import { Link } from "react-router";

import {
  Select,
  type SelectOption,
} from "@/shared/ui/Select";

import { UAFlagIcon } from "@/shared/assets/icons/UAFlagIcon";
import { useState } from "react";
import { UKFlagIcon } from "@/shared/assets/icons/UKFlagIcon";

type Language = "en" | "ua" | "cs"


const languages: SelectOption<Language>[] = [
  {
    value: "ua",
    label: "Ukrainian",
    icon: <UAFlagIcon />,
  },
  {
    value: "en",
    label: "English",
    icon: <UKFlagIcon />,
  },
];

export function LandingFooter() {
  const [language, setLanguage] = useState<Language>("en")
  return (
    <div className={styles.footer}>
      <main className={styles.main}>
        <div className={styles.brand}>
          <img src="images/logo.png" alt="logo" />
          <div className={styles.text}>
            <div className={styles.title}>MLUV AI</div>
            <div className={styles.description}>
              The modern way to learn Czech online.
            </div>
          </div>
        </div>
        <div className={styles.linksContainer}>
          {footerGroups.map((group) => (
            <div key={group.title} className={styles.links}>
              <h3>{group.title}</h3>

              {group.links.map((link) => (
                <Link key={link.label} to={link.path} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </main>
      <div className={styles.dividerContainer}>
        <div className={styles.divider}></div>
      </div>
      <div className={styles.rights}>
        2026 MLUV AI. All rights reserved.
        <Select value={language} options={languages} onValueChange={setLanguage}/>
      </div>
    </div>
  );
}

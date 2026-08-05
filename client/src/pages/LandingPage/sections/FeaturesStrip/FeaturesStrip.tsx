import styles from './FeaturesStrip.module.css';

import { BoltIcon } from '@/shared/assets/icons/BoltIcon';
import { HeadphonesIcon } from '@/shared/assets/icons/HeadphonesIcon';
import { DownloadIcon } from '@/shared/assets/icons/DownloadIcon';
import { BookIcon } from '@/shared/assets/icons/BookIcon';


export function FeaturesStrip() {
  const items = [
    {
        label: "AI Generated",
        description: "Advanced AI creates natural and useful lessons.",
        icon: <BoltIcon />
    },
    {
        label: "High Quality Audio",
        description: "Clear, natural sounding Czech Speach.",
        icon: <HeadphonesIcon />
    },
    {
        label: "For Every Level",
        description: "CLessons for A1-B2 - From beginners to advanced.",
        icon: <DownloadIcon />
    },
    {
        label: "Listen Anywhere",
        description: "Download lessons and listen offline anytime.",
        icon: <BookIcon />
    },

  ]

  return (
    <div className={styles.container}>
        <div className={styles.block}>
            {items.map((item) => (
                <div className={styles.item} key={item.label}>
                    <div className={styles.icon}>
                        {item.icon}
                    </div>
                    <div className={styles.container}>
                        <div className={styles.label}>
                        {item.label}
                        </div>
                        <div className={styles.description}>
                            {item.description}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

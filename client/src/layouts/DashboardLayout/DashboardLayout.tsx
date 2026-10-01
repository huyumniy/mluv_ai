import { Outlet } from 'react-router'

import styles from "./DashboardLayout.module.css"
import { Sidebar } from './sidebar'
import { Bottombar } from './bottombar'
import { Miniplayer } from './miniplayer'

export function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar className={styles.desktopSidebar} />
      <Bottombar className={styles.mobileBottombar}/>
      <Miniplayer className={styles.miniplayer} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

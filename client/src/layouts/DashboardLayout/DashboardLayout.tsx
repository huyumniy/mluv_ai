import { Outlet } from 'react-router'

import styles from "./DashboardLayout.module.css"
import { Sidebar } from './sidebar'
import { Bottombar } from './bottombar'

export function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar className={styles.desktopSidebar} />
      <Bottombar className={styles.mobileBottombar}/>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

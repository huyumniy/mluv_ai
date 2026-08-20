import { Outlet } from 'react-router'

import styles from "./DashboardLayout.module.css"
import { Sidebar } from './sidebar'

export function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

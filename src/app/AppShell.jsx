import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-surface-alt text-text">
      <Topbar />
      <div className="flex min-h-screen pt-0">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

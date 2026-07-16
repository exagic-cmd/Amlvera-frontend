import { Outlet } from 'react-router-dom'

export default function SelfServiceLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  )
}

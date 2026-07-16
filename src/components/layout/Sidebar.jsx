import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, Link2, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    to: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Profile',
    to: '/app/profile',
    icon: User,
  },
]

export default function Sidebar() {
  const [deepLinkOpen, setDeepLinkOpen] = useState(true)

  const menuClass = useMemo(
    () => 'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200',
    [],
  )

  return (
    <aside className="sticky top-0 z-20 h-screen w-64 border-r border-border bg-surface px-3 py-4 shadow-sm">
      <div className="mb-6 flex items-center gap-3 px-1">
        <img src="/amlvera.png" alt="Amlvera" className="h-9 w-auto rounded-md bg-white/10 p-1" />
      </div>

      <div className="mb-6 rounded-3xl border border-border bg-surface p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Jane Doe</p>
            <p className="text-xs text-text-muted">Online</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  menuClass,
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-text hover:bg-surface-alt',
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 rounded-3xl border border-border bg-surface p-3">
        <button
          type="button"
          onClick={() => setDeepLinkOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-text transition hover:bg-surface-alt"
        >
          <span className="inline-flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Deep Link Onboarding
          </span>
          {deepLinkOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {deepLinkOpen && (
          <nav className="mt-3 space-y-1">
            <NavLink
              to="/app/deep-link/individual"
              className={({ isActive }) =>
                cn(
                  menuClass,
                  'rounded-2xl pl-9',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-text hover:bg-surface-alt',
                )
              }
            >
              Individual Onboarding
            </NavLink>
            <NavLink
              to="/app/deep-link/company"
              className={({ isActive }) =>
                cn(
                  menuClass,
                  'rounded-2xl pl-9',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-text hover:bg-surface-alt',
                )
              }
            >
              Company Onboarding
            </NavLink>
          </nav>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-surface p-3">
        <button
          type="button"
          onClick={() => setDeepLinkOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-text transition hover:bg-surface-alt"
        >
          <span className="inline-flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Self Service Onboarding
          </span>
          {deepLinkOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {deepLinkOpen && (
          <nav className="mt-3 space-y-1">
            <NavLink
              to="/app/self-service/individual"
              className={({ isActive }) =>
                cn(
                  menuClass,
                  'rounded-2xl pl-9',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-text hover:bg-surface-alt',
                )
              }
            >
              Individual Onboarding
            </NavLink>
            <NavLink
              to="/app/self-service/company"
              className={({ isActive }) =>
                cn(
                  menuClass,
                  'rounded-2xl pl-9',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-text hover:bg-surface-alt',
                )
              }
            >
              Company Onboarding
            </NavLink>
          </nav>
        )}
      </div>
    </aside>
  )
}

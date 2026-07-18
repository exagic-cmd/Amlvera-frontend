import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PieChart, CircleUser, Link, ChevronDown, ChevronRight, Settings2, User } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    to: '/app/dashboard',
    icon: PieChart,
  },
  {
    label: 'Profile',
    to: '/app/profile',
    icon: CircleUser,
  },
]

export default function Sidebar() {
  const [deepLinkOpen, setDeepLinkOpen] = useState(true)
  const [selfServiceOpen, setSelfServiceOpen] = useState(true)

  const menuClass = useMemo(
    () => 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
    [],
  )

  return (
    <aside className="z-20 flex h-full w-64 flex-col border-r border-border bg-surface flex-shrink-0">
      <div className="flex h-[69px] flex-shrink-0 items-center px-6 border-b border-border">
        <img src="/amlvera.png" alt="Amlvera" className="h-8 w-auto rounded-md bg-white/10 p-0.5" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
          Overview
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
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <div>
            <button
              type="button"
              onClick={() => setDeepLinkOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-text transition hover:bg-surface-alt"
            >
              <span className="inline-flex items-center gap-3">
                <Link className="h-[18px] w-[18px] text-text-muted" />
                Deep Link
              </span>
              {deepLinkOpen ? <ChevronDown className="h-[18px] w-[18px] text-text-muted" /> : <ChevronRight className="h-[18px] w-[18px] text-text-muted" />}
            </button>

            {deepLinkOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  to="/app/deep-link/individual"
                  className={({ isActive }) =>
                    cn(
                      menuClass,
                      'pl-[42px] text-sm',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-text-muted hover:bg-surface-alt hover:text-text',
                    )
                  }
                >
                  Individual
                </NavLink>
                <NavLink
                  to="/app/deep-link/company"
                  className={({ isActive }) =>
                    cn(
                      menuClass,
                      'pl-[42px] text-sm',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-text-muted hover:bg-surface-alt hover:text-text',
                    )
                  }
                >
                  Company
                </NavLink>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSelfServiceOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-text transition hover:bg-surface-alt"
            >
              <span className="inline-flex items-center gap-3">
                <Settings2 className="h-[18px] w-[18px] text-text-muted" />
                Self Service
              </span>
              {selfServiceOpen ? <ChevronDown className="h-[18px] w-[18px] text-text-muted" /> : <ChevronRight className="h-[18px] w-[18px] text-text-muted" />}
            </button>

            {selfServiceOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  to="/app/self-service/individual"
                  className={({ isActive }) =>
                    cn(
                      menuClass,
                      'pl-[42px] text-sm',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-text-muted hover:bg-surface-alt hover:text-text',
                    )
                  }
                >
                  Individual
                </NavLink>
                <NavLink
                  to="/app/self-service/company"
                  className={({ isActive }) =>
                    cn(
                      menuClass,
                      'pl-[42px] text-sm',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-text-muted hover:bg-surface-alt hover:text-text',
                    )
                  }
                >
                  Company
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="border-t border-border flex-shrink-0 p-3">
        <div className="flex items-center gap-3 rounded-xl hover:bg-surface-alt transition cursor-pointer p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white flex-shrink-0">
            <User className="h-[18px] w-[18px]" aria-hidden="true" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-text">Jane Doe</p>
            <p className="truncate text-xs text-text-muted">Online</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

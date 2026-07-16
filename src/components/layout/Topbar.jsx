import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Lock, LogOut, Search, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        buttonRef.current &&
        menuRef.current &&
        !buttonRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const navigateTo = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-5 py-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search menus..."
              className="w-full rounded-2xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <Button type="button" variant="outline" size="sm" className="rounded-2xl px-3 py-2">
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-text transition hover:border-brand-500 hover:text-brand-600"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="relative">
            <Button
              ref={buttonRef}
              variant="outline"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2"
              type="button"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
                <User className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="hidden items-center gap-1 text-sm sm:inline-flex">
                <span className="font-medium text-text">Jane Doe</span>
                <ChevronDown className="h-4 w-4 text-text-muted" />
              </span>
            </Button>

            {open && (
              <div
                ref={menuRef}
                className={cn(
                  'absolute right-0 top-full mt-2 w-60 rounded-3xl border border-border bg-white p-2 shadow-xl',
                  'ring-1 ring-black ring-opacity-5',
                )}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('/app/profile/update')}
                  className="flex w-full items-center gap-2 rounded-2xl px-4 py-2 text-left text-sm text-text transition hover:bg-surface-alt"
                >
                  <User className="h-4 w-4 text-text-muted" />
                  <span>Update profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/app/profile/change-password')}
                  className="flex w-full items-center gap-2 rounded-2xl px-4 py-2 text-left text-sm text-text transition hover:bg-surface-alt"
                >
                  <Lock className="h-4 w-4 text-text-muted" />
                  <span>Change password</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/login')}
                  className="mt-2 flex w-full items-center gap-2 rounded-2xl bg-danger/10 px-4 py-2 text-left text-sm text-danger transition hover:bg-danger/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

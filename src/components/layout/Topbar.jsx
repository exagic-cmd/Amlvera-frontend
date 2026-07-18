import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Lock, LogOut, User } from 'lucide-react'
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
    <header className="z-30 flex-shrink-0 border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-end gap-2 px-6 h-[69px]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-alt hover:text-text"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative flex items-center">
            <button
              ref={buttonRef}
              className="inline-flex h-[36px] items-center gap-2 rounded-lg px-2 transition hover:bg-surface-alt"
              type="button"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
                <User className="h-[14px] w-[14px]" aria-hidden="true" />
              </span>
              <span className="hidden items-center gap-1.5 text-sm sm:inline-flex">
                <span className="font-medium text-text">Jane Doe</span>
                <ChevronDown className="h-[14px] w-[14px] text-text-muted" />
              </span>
            </button>

            {open && (
              <div
                ref={menuRef}
                className={cn(
                  'absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-white p-1.5 shadow-sm',
                )}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('/app/profile/update')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-text transition hover:bg-surface-alt"
                >
                  <User className="h-[18px] w-[18px] text-text-muted" />
                  <span>Update profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/app/profile/change-password')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-text transition hover:bg-surface-alt"
                >
                  <Lock className="h-[18px] w-[18px] text-text-muted" />
                  <span>Change password</span>
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => navigateTo('/login')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition hover:bg-danger/10"
                >
                  <LogOut className="h-[18px] w-[18px]" />
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

import { Card } from '../../components/ui/Card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">Welcome to the admin dashboard.</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          <p className="text-sm text-text-muted">This is a placeholder dashboard page. Use the sidebar to navigate between Profile and Deep Link Onboarding.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <p className="text-sm text-text-muted">Profiles</p>
              <p className="mt-2 text-3xl font-semibold">24</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <p className="text-sm text-text-muted">Individual links</p>
              <p className="mt-2 text-3xl font-semibold">8</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <p className="text-sm text-text-muted">Company links</p>
              <p className="mt-2 text-3xl font-semibold">5</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

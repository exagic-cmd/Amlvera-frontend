import { Card } from '../../components/ui/Card'

const profileRows = [
  { name: 'Sajid Manzoor', email: 'sajid@example.com', role: 'Admin', status: 'Active' },
  { name: 'Nadia Khan', email: 'nadia@example.com', role: 'Editor', status: 'Active' },
  { name: 'Aamir Ali', email: 'aamir@example.com', role: 'Viewer', status: 'Inactive' },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">Review and manage profile records in the table below.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-surface-alt text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {profileRows.map((row) => (
                <tr key={row.email} className="hover:bg-surface-alt">
                  <td className="px-4 py-4">{row.name}</td>
                  <td className="px-4 py-4">{row.email}</td>
                  <td className="px-4 py-4">{row.role}</td>
                  <td className="px-4 py-4 text-sm text-text-muted">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

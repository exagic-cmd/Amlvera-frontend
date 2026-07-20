import { DataTable } from '../../components/ui/data-table'
import { Button } from '../../components/ui/Button'

const data = [
  {
    id: '1001',
    name: 'Sajid Manzoor',
    country: 'United Arab Emirates',
    category: 'Individual',
    associatedCompany: 'Amlvera LLC',
    registrationDate: '2023-10-12',
    onboardedBy: 'System',
    uaePass: 'Linked',
    status: 'Active',
  },
  {
    id: '1002',
    name: 'Nadia Khan',
    country: 'United Kingdom',
    category: 'Corporate',
    associatedCompany: 'Tech Corp',
    registrationDate: '2023-11-05',
    onboardedBy: 'Admin',
    uaePass: 'Pending',
    status: 'In Progress',
  },
  {
    id: '1003',
    name: 'Aamir Ali',
    country: 'Saudi Arabia',
    category: 'Individual',
    associatedCompany: 'None',
    registrationDate: '2023-12-20',
    onboardedBy: 'Self',
    uaePass: 'Not Linked',
    status: 'Inactive',
  },
]

const columns = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: 'NAME',
  },
  {
    accessorKey: 'country',
    header: 'COUNTRY',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'associatedCompany',
    header: 'Associated Company',
  },
  {
    accessorKey: 'registrationDate',
    header: 'REGISTRATION DATE',
  },
  {
    accessorKey: 'onboardedBy',
    header: 'Onboarded By',
  },
  {
    accessorKey: 'uaePass',
    header: 'UAE PASS',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status')
      const colorClass = 
        status === 'Active' ? 'text-brand-600 bg-brand-50' : 
        status === 'Inactive' ? 'text-danger bg-danger/10' : 
        'text-navy-600 bg-navy-50'
        
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
        View
      </Button>
    )
  },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">Review and manage profile records in the table below.</p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search profiles by name..."
      />
    </div>
  )
}

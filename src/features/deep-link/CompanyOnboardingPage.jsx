import { Card } from '../../components/ui/Card'

export default function CompanyOnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Company Onboarding</h1>
        <p className="mt-1 text-sm text-text-muted">Complete the company onboarding form on this page.</p>
      </div>

      <Card className="p-6">
        <p className="text-sm text-text-muted">This page will contain the company onboarding form fields you provide later.</p>
      </Card>
    </div>
  )
}

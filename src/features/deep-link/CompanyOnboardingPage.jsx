import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData } from 'country-list'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/input'
import { SearchableSelect } from '../../components/ui/SearchableSelect'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { companySchema } from './company-schema'

const departmentDivisions = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Shipping/Delivery']
const industries = ['Banking', 'Retail', 'Technology', 'Healthcare', 'Manufacturing', 'Logistics']
const productTypes = ['Loan', 'Savings', 'Investments', 'Insurance', 'Other']
const priorityOptions = ['Extra Dispatch', 'Priority', 'Standard']

export default function CompanyOnboardingPage() {
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
      email: '',
      departmentDivision: '',
      companyRegistrationNumber: '',
      website: '',
      phone: '',
      contactEmail: '',
      firstName: '',
      lastName: '',
      postalCode: '',
      dialingCode: '',
      enterPhoneNumber: '',
      industry: '',
      productType: '',
      priority: '',
      faceToFaceDeclaration: 'no',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Company onboarding submitted:', data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Company Onboarding</h1>
        <p className="mt-1 text-sm text-text-muted">Fill in all fields to generate the onboarding link for the company.</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
            <section className="grid gap-6 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentDivision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department / Division</FormLabel>
                    <SearchableSelect
                      options={departmentDivisions.map((v) => ({ label: v, value: v }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select department"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="companyRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company registration number / ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
              <h3 className="font-semibold text-sm">Contact Information</h3>
              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dialingCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dialing code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enterPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter phone number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
              <h3 className="font-semibold text-sm">Profile Information</h3>
              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Industry</FormLabel>
                      <SearchableSelect
                        options={industries.map((v) => ({ label: v, value: v }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select industry"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Product Type Offered to Customer</FormLabel>
                      <SearchableSelect
                        options={productTypes.map((v) => ({ label: v, value: v }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select product type"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <SearchableSelect
                        options={priorityOptions.map((v) => ({ label: v, value: v }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select priority"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-surface-alt p-5">
              <FormField
                control={form.control}
                name="faceToFaceDeclaration"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Face to Face Declaration</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-6"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? 'Saving…' : 'Save company onboarding'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

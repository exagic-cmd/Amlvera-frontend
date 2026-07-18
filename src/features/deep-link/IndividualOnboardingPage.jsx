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
import { individualSchema } from './individual-schema'

const residentStatuses = ['Resident', 'Non-resident', 'Visitor']
const genders = ['Male', 'Female', 'Other']
const citizenshipOptions = ['Yes', 'No']
const workTypes = ['Full-time', 'Part-time', 'Contract']
const industries = ['Banking', 'Retail', 'Technology', 'Healthcare', 'Manufacturing']
const productTypes = ['Loan', 'Savings', 'Investments', 'Insurance', 'Other']
const stateOptions = [
  { code: 'NY', label: 'New York' },
  { code: 'CA', label: 'California' },
  { code: 'TX', label: 'Texas' },
  { code: 'FL', label: 'Florida' },
]

export default function IndividualOnboardingPage() {
  const form = useForm({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      fullName: '',
      email: '',
      residentStatus: '',
      gender: '',
      dateOfBirth: '',
      nationality: '',
      countryOfResidence: '',
      doYouHaveCitizenship: '',
      specificOtherNationality: '',
      passportNumber: '',
      passportExpiry: '',
      externalReferenceNumber: '',
      placeOfBirth: '',
      phoneNumber: '',
      address: '',
      state: '',
      townCity: '',
      zipCode: '',
      contactNumber: '',
      workType: '',
      industry: '',
      productTypeOffered: '',
      productOffered: '',
      companyName: '',
      positionInCompany: '',
      faceToFaceDeclaration: 'no',
    },
  })

  const { isSubmitting } = form.formState

  const countryOptions = useMemo(
    () => getData().map((country) => ({ value: country.code, label: country.name })),
    [],
  )

  const nationalityOptions = countryOptions

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Individual onboarding submitted:', data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Individual Onboarding</h1>
        <p className="mt-1 text-sm text-text-muted">Fill in all fields to generate the onboarding link for the individual.</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
            <section className="grid gap-6 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
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
                name="residentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resident status</FormLabel>
                    <SearchableSelect
                      options={residentStatuses.map((v) => ({ label: v, value: v }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select resident status"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <SearchableSelect
                      options={genders.map((v) => ({ label: v, value: v }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select gender"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <SearchableSelect
                      options={nationalityOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select nationality"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="countryOfResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of residence</FormLabel>
                    <SearchableSelect
                      options={countryOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select country"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doYouHaveCitizenship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have citizenship?</FormLabel>
                    <SearchableSelect
                      options={citizenshipOptions.map((v) => ({ label: v, value: v }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select option"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specificOtherNationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify other nationality</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passportExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport expiry</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalReferenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External reference number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <section className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <SearchableSelect
                        options={stateOptions.map(s => ({ label: s.label, value: s.code }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select state"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="townCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town / City</FormLabel>
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
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip code / Postal code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact number</FormLabel>
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
              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work type</FormLabel>
                      <SearchableSelect
                        options={workTypes.map((v) => ({ label: v, value: v }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select work type"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
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
                  name="productTypeOffered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product type offered</FormLabel>
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
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="productOffered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product offered</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="positionInCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position in company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                {isSubmitting ? 'Saving…' : 'Save individual onboarding'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData } from 'country-list'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Select } from '../../components/ui/Select'
import { individualSchema } from './individual-schema'

const residentStatuses = ['Resident', 'Non-resident', 'Visitor']
const genders = ['Male', 'Female', 'Other']
const citizenshipOptions = ['Yes', 'No']
const workTypes = ['Full-time', 'Part-time', 'Contract']
const industries = ['Banking', 'Retail', 'Technology', 'Healthcare', 'Manufacturing']
const productTypes = ['Loan', 'Savings', 'Investments', 'Insurance', 'Other']
const stateOptions = [
  { code: '', label: 'Select state' },
  { code: 'NY', label: 'New York' },
  { code: 'CA', label: 'California' },
  { code: 'TX', label: 'Texas' },
  { code: 'FL', label: 'Florida' },
]

export default function IndividualOnboardingPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
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

  const selectedCitizenship = watch('doYouHaveCitizenship')

  const countryOptions = useMemo(
    () => [
      { code: '', name: 'Select country' },
      ...getData().map((country) => ({ code: country.code, name: country.name })),
    ],
    [],
  )

  const nationalityOptions = useMemo(
    () => [
      { code: '', name: 'Select nationality' },
      ...getData().map((country) => ({ code: country.code, name: country.name })),
    ],
    [],
  )

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

      <Card className="space-y-8 p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
          <section className="grid gap-6 xl:grid-cols-3">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register('fullName')} error={!!errors.fullName} />
              {errors.fullName && <p className="mt-1 text-sm text-danger">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} error={!!errors.email} />
              {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="residentStatus">Resident status</Label>
              <Select id="residentStatus" {...register('residentStatus')} error={!!errors.residentStatus}>
                <option value="">Select resident status</option>
                {residentStatuses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              {errors.residentStatus && <p className="mt-1 text-sm text-danger">{errors.residentStatus.message}</p>}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select id="gender" {...register('gender')} error={!!errors.gender}>
                <option value="">Select gender</option>
                {genders.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              {errors.gender && <p className="mt-1 text-sm text-danger">{errors.gender.message}</p>}
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} error={!!errors.dateOfBirth} />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-danger">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Select id="nationality" {...register('nationality')} error={!!errors.nationality}>
                {nationalityOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.nationality && <p className="mt-1 text-sm text-danger">{errors.nationality.message}</p>}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div>
              <Label htmlFor="countryOfResidence">Country of residence</Label>
              <Select id="countryOfResidence" {...register('countryOfResidence')} error={!!errors.countryOfResidence}>
                {countryOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.countryOfResidence && (
                <p className="mt-1 text-sm text-danger">{errors.countryOfResidence.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="doYouHaveCitizenship">Do you have citizenship?</Label>
              <Select id="doYouHaveCitizenship" {...register('doYouHaveCitizenship')} error={!!errors.doYouHaveCitizenship}>
                <option value="">Select option</option>
                {citizenshipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              {errors.doYouHaveCitizenship && (
                <p className="mt-1 text-sm text-danger">{errors.doYouHaveCitizenship.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="specificOtherNationality">Specify other nationality</Label>
              <Input id="specificOtherNationality" {...register('specificOtherNationality')} error={!!errors.specificOtherNationality} />
              {errors.specificOtherNationality && (
                <p className="mt-1 text-sm text-danger">{errors.specificOtherNationality.message}</p>
              )}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div>
              <Label htmlFor="passportNumber">Passport number</Label>
              <Input id="passportNumber" {...register('passportNumber')} error={!!errors.passportNumber} />
              {errors.passportNumber && <p className="mt-1 text-sm text-danger">{errors.passportNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="passportExpiry">Passport expiry</Label>
              <Input id="passportExpiry" type="date" {...register('passportExpiry')} error={!!errors.passportExpiry} />
              {errors.passportExpiry && <p className="mt-1 text-sm text-danger">{errors.passportExpiry.message}</p>}
            </div>
            <div>
              <Label htmlFor="externalReferenceNumber">External reference number</Label>
              <Input id="externalReferenceNumber" {...register('externalReferenceNumber')} error={!!errors.externalReferenceNumber} />
              {errors.externalReferenceNumber && (
                <p className="mt-1 text-sm text-danger">{errors.externalReferenceNumber.message}</p>
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
            <div className="grid gap-6 xl:grid-cols-3">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} error={!!errors.address} />
                {errors.address && <p className="mt-1 text-sm text-danger">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select id="state" {...register('state')} error={!!errors.state}>
                  {stateOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.state && <p className="mt-1 text-sm text-danger">{errors.state.message}</p>}
              </div>
              <div>
                <Label htmlFor="townCity">Town / City</Label>
                <Input id="townCity" {...register('townCity')} error={!!errors.townCity} />
                {errors.townCity && <p className="mt-1 text-sm text-danger">{errors.townCity.message}</p>}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div>
                <Label htmlFor="zipCode">Zip code / Postal code</Label>
                <Input id="zipCode" {...register('zipCode')} error={!!errors.zipCode} />
                {errors.zipCode && <p className="mt-1 text-sm text-danger">{errors.zipCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact number</Label>
                <Input id="contactNumber" {...register('contactNumber')} error={!!errors.contactNumber} />
                {errors.contactNumber && <p className="mt-1 text-sm text-danger">{errors.contactNumber.message}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
            <div className="grid gap-6 xl:grid-cols-3">
              <div>
                <Label htmlFor="workType">Work type</Label>
                <Select id="workType" {...register('workType')} error={!!errors.workType}>
                  <option value="">Select work type</option>
                  {workTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {errors.workType && <p className="mt-1 text-sm text-danger">{errors.workType.message}</p>}
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select id="industry" {...register('industry')} error={!!errors.industry}>
                  <option value="">Select industry</option>
                  {industries.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {errors.industry && <p className="mt-1 text-sm text-danger">{errors.industry.message}</p>}
              </div>
              <div>
                <Label htmlFor="productTypeOffered">Product type offered</Label>
                <Select id="productTypeOffered" {...register('productTypeOffered')} error={!!errors.productTypeOffered}>
                  <option value="">Select product type</option>
                  {productTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {errors.productTypeOffered && (
                  <p className="mt-1 text-sm text-danger">{errors.productTypeOffered.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div>
                <Label htmlFor="productOffered">Product offered</Label>
                <Input id="productOffered" {...register('productOffered')} error={!!errors.productOffered} />
                {errors.productOffered && <p className="mt-1 text-sm text-danger">{errors.productOffered.message}</p>}
              </div>
              <div>
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" {...register('companyName')} error={!!errors.companyName} />
                {errors.companyName && <p className="mt-1 text-sm text-danger">{errors.companyName.message}</p>}
              </div>
              <div>
                <Label htmlFor="positionInCompany">Position in company</Label>
                <Input id="positionInCompany" {...register('positionInCompany')} error={!!errors.positionInCompany} />
                {errors.positionInCompany && <p className="mt-1 text-sm text-danger">{errors.positionInCompany.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-surface-alt p-5">
            <Label className="mb-4 block text-sm font-semibold text-text">Face to Face Declaration</Label>
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" value="yes" {...register('faceToFaceDeclaration')} className="h-4 w-4 accent-brand-600" />
                Yes
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" value="no" {...register('faceToFaceDeclaration')} className="h-4 w-4 accent-brand-600" />
                No
              </label>
            </div>
            {errors.faceToFaceDeclaration && (
              <p className="mt-3 text-sm text-danger">{errors.faceToFaceDeclaration.message}</p>
            )}
          </section>

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Saving…' : 'Save individual onboarding'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

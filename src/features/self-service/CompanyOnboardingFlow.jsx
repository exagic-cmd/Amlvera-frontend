import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData } from 'country-list'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { SearchableSelect } from '../../components/ui/SearchableSelect'
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from '../../components/ui/attachment'
import { FileText, X, Check } from 'lucide-react'
import { selfServiceCompanySchema } from './company-schema'

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const isImageFile = (file) => file?.type?.startsWith('image/')

const steps = ['Upload documents', 'Setup profile', 'Stakeholders Information', 'Preview', 'Finish']

const industries = ['Banking', 'Retail', 'Technology', 'Healthcare', 'Manufacturing', 'Logistics', 'Energy']
const entityTypes = ['Individual', 'Organization', 'Trust', 'Partnership']
const workTypes = ['Full-time', 'Part-time', 'Contract', 'Director']

const formatPreviewValue = (value) => {
  if (value === undefined || value === null || value === '') return 'N/A'
  if (value === false) return 'N/A'
  if (value === true) return 'true'
  return value
}

const PreviewField = ({ label, value }) => (
  <div className="py-1.5">
    <p className="text-xs text-text-muted">{label}</p>
    <p className="text-sm font-medium text-text">{formatPreviewValue(value)}</p>
  </div>
)

const stakeholderPreviewFields = (entry = {}, { includeEntityDetails = false } = {}) => {
  const rows = []
  if (includeEntityDetails) rows.push(['Entity Type', entry.entityType])
  rows.push(['Name', entry.name])
  rows.push([includeEntityDetails ? 'Date of Birth/Incorporation' : 'Date of Birth', entry.dateOfBirth])
  rows.push(['Date of Appointment', entry.dateOfAppointment])
  rows.push(['Date of Termination', entry.dateOfTermination])
  if (includeEntityDetails) rows.push(['% of Shares Held', entry.percentOfSharesHeld])
  rows.push([includeEntityDetails ? 'Country of Residence / Domicile' : 'Country of Domicile', entry.countryOfResidence])
  rows.push([includeEntityDetails ? 'Nationality / Country of Operation' : 'Country of Operation', entry.nationality])
  rows.push([includeEntityDetails ? 'ID Front / Company Registration Document' : 'ID Front', entry.idFront])
  rows.push(['ID Back', entry.idBack])
  rows.push([includeEntityDetails ? 'National Id Number / Company Registration Number' : 'National Id Number', entry.nationalIdNumber])
  rows.push([includeEntityDetails ? 'National ID Expiry / Company Registration Expiry' : 'National ID Expiry', entry.nationalIdExpiry])
  rows.push(['Passport Document', entry.passportDocument])
  rows.push(['Passport Number', entry.passportNumber])
  rows.push(['Passport Expiry', entry.passportExpiry])
  rows.push(['Screen and Onboard', entry.screenAndOnboard])
  rows.push(['Work Type', entry.workType])
  rows.push(['Industries', entry.industries])
  rows.push(['Product Type Offered to Customer', entry.productTypeOfferedToCustomer])
  return rows
}

const StakeholderPreview = ({ title, entry, includeEntityDetails }) => (
  <div>
    <h4 className="text-sm font-semibold text-brand-700 mb-3">{title.toUpperCase()}</h4>
    <div className="divide-y divide-border">
      {stakeholderPreviewFields(entry, { includeEntityDetails }).map(([label, value]) => (
        <PreviewField key={label} label={label} value={value} />
      ))}
    </div>
  </div>
)

export default function CompanyOnboardingFlow() {
  const [step, setStep] = useState(0)
  const [tradeLicense, setTradeLicense] = useState(null)
  const [registrationCert, setRegistrationCert] = useState(null)
  const [memorandumAssociation, setMemorandumAssociation] = useState(null)
  const [certificateIncorporation, setCertificateIncorporation] = useState(null)
  const [certificateIncumbency, setCertificateIncumbency] = useState(null)
  const [certificateGoodStanding, setCertificateGoodStanding] = useState(null)
  const [uboStructure, setUboStructure] = useState(null)
  const [otherDocuments, setOtherDocuments] = useState([])
  const [formError, setFormError] = useState('')
  
  const form = useForm({
    resolver: zodResolver(selfServiceCompanySchema),
    defaultValues: {
      companyName: '',
      email: '',
      companyRelationship: '',
      dateOfIncorporation: '',
      countryOfOperation: '',
      countryOfDomicile: '',
      operateInOtherCountries: 'no',
      specifyOtherCountries: '',
      businessRegistrationNumber: '',
      businessLicenseExpiry: '',
      address: '',
      state: '',
      townCity: '',
      postalCode: '',
      dialingCode: '',
      contactNumber: '',
      industryType: '',
      productTypeOffered: '',
      productOffered: '',
      faceToFaceDeclaration: 'no',
      companyShareholders: [{ entityType: '', name: '', dateOfBirth: '', dateOfAppointment: '', dateOfTermination: '', percentOfSharesHeld: '', countryOfResidence: '', nationality: '', idFront: '', idBack: '', nationalIdNumber: '', nationalIdExpiry: '', passportDocument: '', passportNumber: '', passportExpiry: '', screenAndOnboard: false, workType: '', industries: '', productTypeOfferedToCustomer: '' }],
      authorizedPersons: [{ entityType: '', name: '', dateOfBirth: '', dateOfAppointment: '', dateOfTermination: '', percentOfSharesHeld: '', countryOfResidence: '', nationality: '', idFront: '', idBack: '', nationalIdNumber: '', nationalIdExpiry: '', passportDocument: '', passportNumber: '', passportExpiry: '', screenAndOnboard: false, workType: '', industries: '', productTypeOfferedToCustomer: '' }],
      companyDirectors: [{ entityType: '', name: '', dateOfBirth: '', dateOfAppointment: '', dateOfTermination: '', percentOfSharesHeld: '', countryOfResidence: '', nationality: '', idFront: '', idBack: '', nationalIdNumber: '', nationalIdExpiry: '', passportDocument: '', passportNumber: '', passportExpiry: '', screenAndOnboard: false, workType: '', industries: '', productTypeOfferedToCustomer: '' }],
      executiveManagement: [{ entityType: '', name: '', dateOfBirth: '', dateOfAppointment: '', dateOfTermination: '', percentOfSharesHeld: '', countryOfResidence: '', nationality: '', idFront: '', idBack: '', nationalIdNumber: '', nationalIdExpiry: '', passportDocument: '', passportNumber: '', passportExpiry: '', screenAndOnboard: false, workType: '', industries: '', productTypeOfferedToCustomer: '' }],
      ultimateBeneficialOwner: [{ entityType: '', name: '', dateOfBirth: '', dateOfAppointment: '', dateOfTermination: '', percentOfSharesHeld: '', countryOfResidence: '', nationality: '', idFront: '', idBack: '', nationalIdNumber: '', nationalIdExpiry: '', passportDocument: '', passportNumber: '', passportExpiry: '', screenAndOnboard: false, workType: '', industries: '', productTypeOfferedToCustomer: '' }],
      sourceOfFunds: '',
    },
  })

  const countryOptions = useMemo(
    () => getData().map((country) => ({ value: country.code, label: country.name })),
    [],
  )

  const nationalityOptions = countryOptions
  const values = form.watch()
  const { isSubmitting } = form.formState
  const { handleSubmit, trigger, watch } = form

  const handleFileUpload = (event, setterFn) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setterFn({ file, url })
    }
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((value) => value + 1)
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep((value) => value - 1)
    }
  }

  const handleContinue = async () => {
    if (step === 0) {
      if (!tradeLicense && !registrationCert && !memorandumAssociation && !certificateIncorporation && !certificateIncumbency && !certificateGoodStanding && !uboStructure && otherDocuments.length === 0) {
        setFormError('Please upload at least one document to continue.')
        return
      }
      setFormError('')
      handleNext()
      return
    }

    if (step === 1) {
      setFormError('')
      const valid = await trigger([
        'companyName',
        'email',
        'companyRelationship',
        'dateOfIncorporation',
        'countryOfOperation',
        'countryOfDomicile',
        'operateInOtherCountries',
        'businessRegistrationNumber',
        'businessLicenseExpiry',
        'address',
        'state',
        'townCity',
        'postalCode',
        'dialingCode',
        'contactNumber',
        'industryType',
        'productTypeOffered',
        'productOffered',
        'faceToFaceDeclaration',
      ])
      if (!valid) {
        setFormError('Please fill in all required fields.')
        return
      }
      handleNext()
      return
    }

    if (step === 2) {
      setFormError('')
      const valid = await trigger(['sourceOfFunds'])
      if (!valid) {
        setFormError('Please describe the source of funds.')
        return
      }
      handleNext()
      return
    }

    if (step === 3) {
      handleNext()
      return
    }
  }

  const onSubmit = async (data) => {
    if (step === 3) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log('Self service company data:', data)
      handleNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Self Service Company Onboarding</h1>
            <p className="mt-1 text-sm text-text-muted">Complete the onboarding flow in a few easy steps.</p>
          </div>
          <div className="flex gap-2">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                  index === step ? 'bg-brand-600 text-white' : 'bg-surface-alt text-text-muted'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="rounded-3xl p-6">
        <div className="mb-8 relative z-0 flex w-full justify-between">
          <div className="absolute left-0 top-4 -z-10 h-[2px] w-full -translate-y-1/2 bg-surface-alt" />
          <div 
            className="absolute left-0 top-4 -z-10 h-[2px] -translate-y-1/2 bg-brand-600 transition-all duration-300"
            style={{ width: `${(Math.max(step, 0) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  index < step
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : index === step
                    ? 'border-brand-600 bg-surface text-brand-600'
                    : 'border-surface-alt bg-surface text-text-muted'
                }`}
              >
                {index < step ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <p
                className={`hidden w-20 text-center text-xs font-semibold leading-tight sm:block ${
                  index <= step ? 'text-brand-600' : 'text-text-muted'
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 0: Upload Documents */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-surface-alt p-4 text-sm text-text-muted">
                  <p>NOTE: OCR IS NOT CURRENTLY PERFORMED ON COMPANY DOCUMENTATION.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                      <p className="text-sm font-semibold text-text">TRADE LICENSE / REGISTRATION CERTIFICATE</p>
                      <label className="mt-6 inline-flex cursor-pointer items-center justify-center text-sm text-brand-600 transition hover:text-brand-700">
                        <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => handleFileUpload(event, setTradeLicense)} />
                        <span className="font-semibold">BROWSE</span>
                      </label>
                      {tradeLicense && (
                        <Attachment className="mt-4 w-full text-left">
                          <AttachmentMedia variant={isImageFile(tradeLicense.file) ? 'image' : 'icon'}>
                            {isImageFile(tradeLicense.file) ? (
                              <img src={tradeLicense.url} alt={tradeLicense.file.name} />
                            ) : (
                              <FileText />
                            )}
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{tradeLicense.file.name}</AttachmentTitle>
                            <AttachmentDescription>{formatFileSize(tradeLicense.file.size)}</AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction
                              aria-label="Remove trade license"
                              onClick={() => setTradeLicense(null)}
                            >
                              <X />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      )}
                    </div>

                    <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                      <p className="text-sm font-semibold text-text">SAMPLE DOCUMENT</p>
                      <p className="mt-2 text-xs text-text-muted">Sample document reference image</p>
                      <div className="mt-4 h-48 rounded-2xl border border-border bg-surface-alt p-2 text-center text-sm text-text-muted">
                        <p>Sample document preview</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                      <p className="text-sm font-semibold text-text">MEMORANDUM OF ASSOCIATION</p>
                      <label className="mt-6 inline-flex cursor-pointer items-center justify-center text-sm text-brand-600 transition hover:text-brand-700">
                        <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => handleFileUpload(event, setMemorandumAssociation)} />
                        <span className="font-semibold">BROWSE</span>
                      </label>
                      {memorandumAssociation && (
                        <Attachment className="mt-4 w-full text-left">
                          <AttachmentMedia variant={isImageFile(memorandumAssociation.file) ? 'image' : 'icon'}>
                            {isImageFile(memorandumAssociation.file) ? (
                              <img src={memorandumAssociation.url} alt={memorandumAssociation.file.name} />
                            ) : (
                              <FileText />
                            )}
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{memorandumAssociation.file.name}</AttachmentTitle>
                            <AttachmentDescription>{formatFileSize(memorandumAssociation.file.size)}</AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction
                              aria-label="Remove memorandum"
                              onClick={() => setMemorandumAssociation(null)}
                            >
                              <X />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      )}
                    </div>

                    <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                      <p className="text-sm font-semibold text-text">CERTIFICATE OF INCORPORATION</p>
                      <label className="mt-6 inline-flex cursor-pointer items-center justify-center text-sm text-brand-600 transition hover:text-brand-700">
                        <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => handleFileUpload(event, setCertificateIncorporation)} />
                        <span className="font-semibold">BROWSE</span>
                      </label>
                      {certificateIncorporation && (
                        <Attachment className="mt-4 w-full text-left">
                          <AttachmentMedia variant={isImageFile(certificateIncorporation.file) ? 'image' : 'icon'}>
                            {isImageFile(certificateIncorporation.file) ? (
                              <img src={certificateIncorporation.url} alt={certificateIncorporation.file.name} />
                            ) : (
                              <FileText />
                            )}
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{certificateIncorporation.file.name}</AttachmentTitle>
                            <AttachmentDescription>{formatFileSize(certificateIncorporation.file.size)}</AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction
                              aria-label="Remove certificate of incorporation"
                              onClick={() => setCertificateIncorporation(null)}
                            >
                              <X />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                      <p className="text-sm font-semibold text-text">CERTIFICATE OF INCUMBENCY</p>
                      <label className="mt-6 inline-flex cursor-pointer items-center justify-center text-sm text-brand-600 transition hover:text-brand-700">
                        <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => handleFileUpload(event, setCertificateIncumbency)} />
                        <span className="font-semibold">BROWSE</span>
                      </label>
                      {certificateIncumbency && (
                        <Attachment className="mt-4 w-full text-left">
                          <AttachmentMedia variant={isImageFile(certificateIncumbency.file) ? 'image' : 'icon'}>
                            {isImageFile(certificateIncumbency.file) ? (
                              <img src={certificateIncumbency.url} alt={certificateIncumbency.file.name} />
                            ) : (
                              <FileText />
                            )}
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{certificateIncumbency.file.name}</AttachmentTitle>
                            <AttachmentDescription>{formatFileSize(certificateIncumbency.file.size)}</AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction
                              aria-label="Remove certificate of incumbency"
                              onClick={() => setCertificateIncumbency(null)}
                            >
                              <X />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      )}
                    </div>

                    <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                      <p className="text-sm font-semibold text-text">CERTIFICATE OF GOOD STANDING</p>
                      <label className="mt-6 inline-flex cursor-pointer items-center justify-center text-sm text-brand-600 transition hover:text-brand-700">
                        <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => handleFileUpload(event, setCertificateGoodStanding)} />
                        <span className="font-semibold">BROWSE</span>
                      </label>
                      {certificateGoodStanding && (
                        <Attachment className="mt-4 w-full text-left">
                          <AttachmentMedia variant={isImageFile(certificateGoodStanding.file) ? 'image' : 'icon'}>
                            {isImageFile(certificateGoodStanding.file) ? (
                              <img src={certificateGoodStanding.url} alt={certificateGoodStanding.file.name} />
                            ) : (
                              <FileText />
                            )}
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{certificateGoodStanding.file.name}</AttachmentTitle>
                            <AttachmentDescription>{formatFileSize(certificateGoodStanding.file.size)}</AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction
                              aria-label="Remove certificate of good standing"
                              onClick={() => setCertificateGoodStanding(null)}
                            >
                              <X />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                    <p className="text-sm font-semibold text-text">UBO/SHAREHOLDER STRUCTURE</p>
                    <label className="mt-6 inline-flex cursor-pointer items-center justify-center text-sm text-brand-600 transition hover:text-brand-700">
                      <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => handleFileUpload(event, setUboStructure)} />
                      <span className="font-semibold">BROWSE</span>
                    </label>
                    {uboStructure && (
                      <Attachment className="mt-4 w-full text-left">
                        <AttachmentMedia variant={isImageFile(uboStructure.file) ? 'image' : 'icon'}>
                          {isImageFile(uboStructure.file) ? (
                            <img src={uboStructure.url} alt={uboStructure.file.name} />
                          ) : (
                            <FileText />
                          )}
                        </AttachmentMedia>
                        <AttachmentContent>
                          <AttachmentTitle>{uboStructure.file.name}</AttachmentTitle>
                          <AttachmentDescription>{formatFileSize(uboStructure.file.size)}</AttachmentDescription>
                        </AttachmentContent>
                        <AttachmentActions>
                          <AttachmentAction
                            aria-label="Remove UBO structure"
                            onClick={() => setUboStructure(null)}
                          >
                            <X />
                          </AttachmentAction>
                        </AttachmentActions>
                      </Attachment>
                    )}
                  </div>

                  <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                    <p className="text-sm font-semibold text-text mb-2">PLEASE UPLOAD ALL RELEVANT DOCUMENTS</p>
                    <p className="text-xs text-text-muted mb-4">Upload other DOC, DOCX, PDF, PNG, JPG (5MB MAX)</p>
                    <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-3xl border border-dashed border-border px-4 py-16 text-sm text-text-muted transition hover:border-brand-500 hover:text-brand-600">
                      <input type="file" className="sr-only" accept="image/*,.pdf,.doc,.docx" multiple onChange={(event) => {
                        const files = Array.from(event.target.files || [])
                        const newFiles = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
                        setOtherDocuments((prev) => [...prev, ...newFiles])
                      }} />
                      <span>Drop file here or Select file</span>
                    </label>
                    {otherDocuments.length > 0 && (
                      <div className="mt-4 space-y-2 text-left">
                        {otherDocuments.map((item, index) => (
                          <Attachment key={`${item.file.name}-${index}`}>
                            <AttachmentMedia variant={isImageFile(item.file) ? 'image' : 'icon'}>
                              {isImageFile(item.file) ? (
                                <img src={item.url} alt={item.file.name} />
                              ) : (
                                <FileText />
                              )}
                            </AttachmentMedia>
                            <AttachmentContent>
                              <AttachmentTitle>{item.file.name}</AttachmentTitle>
                              <AttachmentDescription>{formatFileSize(item.file.size)}</AttachmentDescription>
                            </AttachmentContent>
                            <AttachmentActions>
                              <AttachmentAction
                                aria-label={`Remove ${item.file.name}`}
                                onClick={() => setOtherDocuments((prev) => prev.filter((_, i) => i !== index))}
                              >
                                <X />
                              </AttachmentAction>
                            </AttachmentActions>
                          </Attachment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {formError ? (
                  <div className="rounded-3xl border border-danger bg-danger/10 p-4 text-sm text-danger">
                    {formError}
                  </div>
                ) : null}
              </div>
            )}

            {/* Step 1: Setup Profile */}
            {step === 1 && (
              <div className="space-y-6">
                {formError ? (
                  <div className="rounded-3xl border border-danger bg-danger/10 p-4 text-sm text-danger">
                    {formError}
                  </div>
                ) : null}

                {/* Company Info Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Company Name" {...field} />
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
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company relationship</FormLabel>
                        <SearchableSelect
                          options={[
                            { label: 'Customer', value: 'customer' },
                            { label: 'Partner', value: 'partner' },
                            { label: 'Vendor', value: 'vendor' },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Company Relationship"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="dateOfIncorporation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of incorporation</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="countryOfOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of operation</FormLabel>
                        <SearchableSelect
                          options={countryOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Country"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="countryOfDomicile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of domicile</FormLabel>
                        <SearchableSelect
                          options={countryOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Country"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="operateInOtherCountries"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Do you operate in any other countries?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
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
                  {watch('operateInOtherCountries') === 'yes' && (
                    <FormField
                      control={form.control}
                      name="specifyOtherCountries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify other countries</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter countries" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="businessRegistrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business registration number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessLicenseExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company registration / Trade license expiry date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
                  <h3 className="text-sm font-semibold">Contact Information</h3>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" {...field} />
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
                            options={[
                              { label: 'NY', value: 'NY' },
                              { label: 'CA', value: 'CA' },
                              { label: 'TX', value: 'TX' },
                              { label: 'FL', value: 'FL' },
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select State"
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
                            <Input placeholder="Enter Town/City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip code / Postal code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Zip Code / Postal Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dialingCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dialing code</FormLabel>
                          <FormControl>
                            <Input placeholder="Dialing code" {...field} />
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
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="space-y-4 rounded-3xl border border-border bg-surface-alt p-5">
                  <h3 className="text-sm font-semibold">Profile Information</h3>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="industryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <SearchableSelect
                            options={industries.map((v) => ({ label: v, value: v }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Industry"
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
                          <FormLabel>Product type offered to customer</FormLabel>
                          <SearchableSelect
                            options={[
                              { label: 'Product', value: 'product' },
                              { label: 'Service', value: 'service' },
                              { label: 'Both', value: 'both' },
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Product Type Offered to Customer"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productOffered"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product offered</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Product Offered" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Face to Face Declaration Section */}
                <div className="space-y-4 rounded-3xl border border-border bg-surface p-5">
                  <FormField
                    control={form.control}
                    name="faceToFaceDeclaration"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Customer met face-to-face?</FormLabel>
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
                </div>
              </div>
            )}

            {/* Step 2: Shareholders */}
            {/* Step 2: Stakeholders Information */}
            {step === 2 && (
              <div className="space-y-6">
                {formError ? (
                  <div className="rounded-3xl border border-danger bg-danger/10 p-4 text-sm text-danger">
                    {formError}
                  </div>
                ) : null}

                {/* Company Shareholders */}
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold mb-4">Company Shareholders</h3>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.entityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entity type</FormLabel>
                            <SearchableSelect
                              options={entityTypes.map((v) => ({ label: v, value: v }))}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select entity type"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of birth/incorporation</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.dateOfAppointment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of appointment</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.dateOfTermination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of termination</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.percentOfSharesHeld"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>% of shares held</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter percentage" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.countryOfResidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country of residence / domicile</FormLabel>
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
                        name="companyShareholders.0.nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality / country of operation</FormLabel>
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
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.idFront"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID front / company registration document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.idBack"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID back</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID number / company registration number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.nationalIdExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID expiry / company registration expiry</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.passportDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.passportNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passport number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.passportExpiry"
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
                    </div>

                    {/* Row 6 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.screenAndOnboard"
                        render={({ field }) => (
                          <FormItem className="flex items-end gap-2">
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-border text-brand-600"
                            />
                            <FormLabel className="cursor-pointer font-normal">Screen and onboard</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.workType"
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
                        name="companyShareholders.0.industries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industries</FormLabel>
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
                    </div>

                    {/* Row 7 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyShareholders.0.productTypeOfferedToCustomer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product type offered to customer</FormLabel>
                            <FormControl>
                              <Input placeholder="Select product type offered to customer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Authorized Persons */}
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold mb-4">Authorized Persons</h3>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.dateOfBirth"
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
                        name="authorizedPersons.0.dateOfAppointment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of appointment</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.dateOfTermination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of termination</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.countryOfResidence"
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
                        name="authorizedPersons.0.nationality"
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
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.idFront"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID front / company registration document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.idBack"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID back</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID number / company registration number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.nationalIdExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID expiry / company registration expiry</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.passportDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.passportNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passport number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.passportExpiry"
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
                        name="authorizedPersons.0.screenAndOnboard"
                        render={({ field }) => (
                          <FormItem className="flex items-end gap-2">
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-border text-brand-600"
                            />
                            <FormLabel className="cursor-pointer font-normal">Screen and onboard</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.workType"
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
                    </div>

                    {/* Row 6 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="authorizedPersons.0.industries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industries</FormLabel>
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
                        name="authorizedPersons.0.productTypeOfferedToCustomer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product type offered to customer</FormLabel>
                            <FormControl>
                              <Input placeholder="Select product type offered to customer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Directors */}
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold mb-4">Company Directors</h3>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.dateOfBirth"
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
                        name="companyDirectors.0.dateOfAppointment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of appointment</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.dateOfTermination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of termination</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.countryOfResidence"
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
                        name="companyDirectors.0.nationality"
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
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.idFront"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID front / company registration document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.idBack"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID back</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID number / company registration number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.nationalIdExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID expiry / company registration expiry</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.passportDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.passportNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passport number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.passportExpiry"
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
                        name="companyDirectors.0.screenAndOnboard"
                        render={({ field }) => (
                          <FormItem className="flex items-end gap-2">
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-border text-brand-600"
                            />
                            <FormLabel className="cursor-pointer font-normal">Screen and onboard</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.workType"
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
                    </div>

                    {/* Row 6 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="companyDirectors.0.industries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industries</FormLabel>
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
                        name="companyDirectors.0.productTypeOfferedToCustomer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product type offered to customer</FormLabel>
                            <FormControl>
                              <Input placeholder="Select product type offered to customer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Executive Management */}
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold mb-4">Company Executive Management</h3>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.dateOfBirth"
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
                        name="executiveManagement.0.dateOfAppointment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of appointment</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.dateOfTermination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of termination</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.countryOfResidence"
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
                        name="executiveManagement.0.nationality"
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
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.idFront"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID front / company registration document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.idBack"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID back</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID number / company registration number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.nationalIdExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID expiry / company registration expiry</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.passportDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.passportNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passport number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.passportExpiry"
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
                        name="executiveManagement.0.screenAndOnboard"
                        render={({ field }) => (
                          <FormItem className="flex items-end gap-2">
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-border text-brand-600"
                            />
                            <FormLabel className="cursor-pointer font-normal">Screen and onboard</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.workType"
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
                    </div>

                    {/* Row 6 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="executiveManagement.0.industries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industries</FormLabel>
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
                        name="executiveManagement.0.productTypeOfferedToCustomer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product type offered to customer</FormLabel>
                            <FormControl>
                              <Input placeholder="Select product type offered to customer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Ultimate Beneficial Owner */}
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold mb-4">Company Ultimate Beneficial Owner</h3>
                  <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.dateOfBirth"
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
                        name="ultimateBeneficialOwner.0.dateOfAppointment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of appointment</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.dateOfTermination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of termination</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.countryOfResidence"
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
                        name="ultimateBeneficialOwner.0.nationality"
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
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.idFront"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID front / company registration document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.idBack"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID back</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID number / company registration number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.nationalIdExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID expiry / company registration expiry</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.passportDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport document</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="Select scan copy (JPG, PNG, or PDF file)" readOnly value={field.value ? field.value.split('/').pop() : ''} className="bg-surface-alt" />
                                <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0]
                                      if (file) {
                                        field.onChange(file.name)
                                      }
                                    }}
                                  />
                                  <span>BROWSE</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.passportNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passport number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passport number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.passportExpiry"
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
                        name="ultimateBeneficialOwner.0.screenAndOnboard"
                        render={({ field }) => (
                          <FormItem className="flex items-end gap-2">
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-border text-brand-600"
                            />
                            <FormLabel className="cursor-pointer font-normal">Screen and onboard</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.workType"
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
                    </div>

                    {/* Row 6 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="ultimateBeneficialOwner.0.industries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industries</FormLabel>
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
                        name="ultimateBeneficialOwner.0.productTypeOfferedToCustomer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product type offered to customer</FormLabel>
                            <FormControl>
                              <Input placeholder="Select product type offered to customer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Source of Funds */}
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-text">Source of funds</p>
                  <FormField
                    control={form.control}
                    name="sourceOfFunds"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormControl>
                          <textarea
                            {...field}
                            rows={4}
                            placeholder="Describe the source of funds"
                            className="w-full rounded-2xl border border-border bg-surface-alt px-3 py-2 text-sm shadow-xs outline-none placeholder:text-text-muted focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text">Preview Profile</h2>
                  <Button type="button" onClick={() => window.print()} className="bg-brand-600 text-white hover:bg-brand-700">
                    Export as PDF
                  </Button>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <div className="grid gap-x-8 sm:grid-cols-2">
                    <PreviewField label="Company Name" value={values.companyName} />
                    <PreviewField label="Email" value={values.email} />
                    <PreviewField label="Company Relationship" value={values.companyRelationship} />
                    <PreviewField label="Date of Incorporation" value={values.dateOfIncorporation} />
                    <PreviewField label="Country of Operation" value={values.countryOfOperation} />
                    <PreviewField label="Country of Domicile" value={values.countryOfDomicile} />
                    <PreviewField label="Do you operate in other countries?" value={values.operateInOtherCountries} />
                    <PreviewField label="Specify other countries" value={values.specifyOtherCountries} />
                    <PreviewField label="Company Registration / Trade License Number" value={values.businessRegistrationNumber} />
                    <PreviewField label="Company Registration / Trade License expiry date" value={values.businessLicenseExpiry} />
                  </div>

                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="text-sm font-semibold text-text mb-2">Contact Information</h3>
                    <div className="grid gap-x-8 sm:grid-cols-2">
                      <PreviewField label="Address" value={values.address} />
                      <PreviewField label="State" value={values.state} />
                      <PreviewField label="City" value={values.townCity} />
                      <PreviewField label="Zip Code / Postal Code" value={values.postalCode} />
                      <PreviewField label="Contact Number" value={values.dialingCode || values.contactNumber ? `${values.dialingCode || ''} ${values.contactNumber || ''}`.trim() : ''} />
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="text-sm font-semibold text-text mb-2">Profile Information</h3>
                    <div className="grid gap-x-8 sm:grid-cols-2">
                      <PreviewField label="Industry" value={values.industryType} />
                      <PreviewField label="Product Type Offered to Customer" value={values.productTypeOffered} />
                      <PreviewField label="Product Offered" value={values.productOffered} />
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-6">
                    <h3 className="text-sm font-semibold text-text mb-2">Face to Face Declaration</h3>
                    <div className="grid gap-x-8 sm:grid-cols-2">
                      <PreviewField label="Customer Met Face-To-Face?" value={values.faceToFaceDeclaration} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <div className="grid gap-x-8 gap-y-6 lg:grid-cols-2">
                    <StakeholderPreview title="Company Shareholders" entry={values.companyShareholders?.[0]} includeEntityDetails />
                    <StakeholderPreview title="Authorised Persons" entry={values.authorizedPersons?.[0]} />
                  </div>
                  <div className="mt-6 grid gap-x-8 gap-y-6 border-t border-border pt-6 lg:grid-cols-2">
                    <StakeholderPreview title="Company Directors" entry={values.companyDirectors?.[0]} />
                    <StakeholderPreview title="Company Executive Management" entry={values.executiveManagement?.[0]} />
                  </div>
                  <div className="mt-6 grid gap-x-8 gap-y-6 border-t border-border pt-6 lg:grid-cols-2">
                    <StakeholderPreview title="Company Ultimate Beneficial Owner" entry={values.ultimateBeneficialOwner?.[0]} />
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold text-text mb-2">Source Of Funds</h3>
                  <PreviewField label="Enter details of Company's Source of Funds" value={values.sourceOfFunds} />
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold text-text mb-3">ID Document</h3>
                  <ul className="space-y-2 text-sm text-text">
                    {tradeLicense && (
                      <li className="rounded-2xl bg-surface-alt p-3">{tradeLicense.file.name}</li>
                    )}
                    {registrationCert && (
                      <li className="rounded-2xl bg-surface-alt p-3">{registrationCert.file.name}</li>
                    )}
                    {memorandumAssociation && (
                      <li className="rounded-2xl bg-surface-alt p-3">{memorandumAssociation.file.name}</li>
                    )}
                    {certificateIncorporation && (
                      <li className="rounded-2xl bg-surface-alt p-3">{certificateIncorporation.file.name}</li>
                    )}
                    {certificateIncumbency && (
                      <li className="rounded-2xl bg-surface-alt p-3">{certificateIncumbency.file.name}</li>
                    )}
                    {certificateGoodStanding && (
                      <li className="rounded-2xl bg-surface-alt p-3">{certificateGoodStanding.file.name}</li>
                    )}
                    {uboStructure && (
                      <li className="rounded-2xl bg-surface-alt p-3">{uboStructure.file.name}</li>
                    )}
                    {otherDocuments.map((doc, index) => (
                      <li key={index} className="rounded-2xl bg-surface-alt p-3">{doc.file.name}</li>
                    ))}
                    {!tradeLicense && !registrationCert && !memorandumAssociation && !certificateIncorporation && !certificateIncumbency && !certificateGoodStanding && !uboStructure && otherDocuments.length === 0 && (
                      <li className="text-text-muted">No documents uploaded</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Finish */}
            {step === 4 && (
              <div className="rounded-3xl border border-border bg-brand-50 p-6 text-center">
                <h2 className="text-xl font-semibold text-brand-700">Finished</h2>
                <p className="mt-2 text-sm text-text-muted">Your company onboarding has been created successfully.</p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 0}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button type="button" loading={isSubmitting} onClick={handleContinue}>
                  {step === 3 ? 'Submit' : 'Continue'}
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

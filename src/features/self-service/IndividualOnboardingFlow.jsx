import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData } from 'country-list'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Modal } from '../../components/ui/Modal'
import { ImageEditor } from '../../components/ui/ImageEditor'
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
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from '../../components/ui/attachment'
import { FileText, X, Check } from 'lucide-react'
import { selfServiceIndividualSchema } from './individual-schema'

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const isImageFile = (file) => file?.type?.startsWith('image/')

const steps = ['Upload documents', 'Document proof', 'Profile data', 'Account info', 'Preview', 'Finish']

export default function IndividualOnboardingFlow() {
  const [step, setStep] = useState(0)
  const [fileName, setFileName] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editedImageUrl, setEditedImageUrl] = useState('')
  const [proofOfAddress, setProofOfAddress] = useState(null)
  const [visaDocument, setVisaDocument] = useState(null)
  const [otherDocuments, setOtherDocuments] = useState([])
  const [signatureDataUrl, setSignatureDataUrl] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState(null)
  const [formError, setFormError] = useState('')
  const signatureCanvasRef = useRef(null)
  
  const form = useForm({
    resolver: zodResolver(selfServiceIndividualSchema),
    defaultValues: {
      fullName: '',
      email: '',
      nationality: '',
      countryOfResidence: '',
      passportNumber: '',
      residentStatus: '',
      gender: '',
      dateOfBirth: '',
      otherNationalities: 'no',
      otherNationalityDetails: '',
      nationalIdNumber: '',
      nationalIdExpiry: '',
      passportExpiry: '',
      externalReferenceNumber: '',
      address: '',
      state: '',
      townCity: '',
      zipCode: '',
      dialingCode: '',
      contactNumber: '',
      workType: '',
      industry: '',
      productTypeOffered: '',
      productOffered: '',
      companyName: '',
      positionsInCompany: '',
      faceToFaceDeclaration: 'no',
      pepCurrentPublicPosition: 'no',
      pepHeldPublicPosition12Months: 'no',
      pepEverHeldPublicPosition: 'no',
      diplomaticImmunity: 'no',
      relativeHeldPublicPosition12Months: 'no',
      closeAssociateHeldPublicPosition12Months: 'no',
      convictionAgainstCourt: 'no',
      pepDetails: '',
      sourceOfWealth: [],
      sourceOfWealthOtherDetails: '',
      sourceOfFunds: [],
      sourceOfFundsOtherDetails: '',
      signatureName: '',
      signatureRole: '',
      signatureDate: '',
    },
  })

  const nationalityOptions = useMemo(
    () => [
      { code: '', name: 'Select nationality' },
      ...getData().map((country) => ({ code: country.code, name: country.name })),
    ],
    [],
  )

  const countryOptions = nationalityOptions
  const values = form.watch()
  const { isSubmitting, errors } = form.formState
  const { register, handleSubmit, trigger, watch, setValue } = form

  const pepQuestions = [
    { name: 'pepCurrentPublicPosition', label: 'I currently hold a public position' },
    { name: 'pepHeldPublicPosition12Months', label: 'I held a public position in the last 12 months' },
    { name: 'pepEverHeldPublicPosition', label: 'I have ever held a public position' },
    { name: 'diplomaticImmunity', label: 'I hold diplomatic immunity' },
    { name: 'relativeHeldPublicPosition12Months', label: 'My relative held a public position in the last 12 months' },
    { name: 'closeAssociateHeldPublicPosition12Months', label: 'My close associate held a public position in the last 12 months' },
    { name: 'convictionAgainstCourt', label: 'I have no conviction against a court' },
  ]

  const sourceOfWealthOptions = [
    'Salary',
    'Business income',
    'Investments or dividends',
    'Inheritance',
    'Other',
  ]

  const sourceOfFundsOptions = [
    'Savings',
    'Bank transfers',
    'Investment proceeds',
    'Gift or donation',
    'Other',
  ]

  useEffect(() => {
    register('sourceOfWealth')
    register('sourceOfFunds')
  }, [register])

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = signatureCanvasRef.current
      if (!canvas) return

      // Match canvas internal pixel size to displayed size for accurate pointer mapping
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(300, Math.round(rect.width))
      const height = Math.max(120, Math.round(rect.height))

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const getSignatureContext = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    return ctx
  }

  const startSignature = (event) => {
    event.preventDefault()
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const ctx = getSignatureContext()
    if (!ctx) return

    if (event.pointerId && canvas.setPointerCapture) {
      try { canvas.setPointerCapture(event.pointerId) } catch { /* ignore */ }
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
    setLastPoint({ x, y })
    setIsDrawing(true)
    // store active pointer id
    signatureCanvasRef.current.__activePointerId = event.pointerId
  }

  const drawSignature = (event) => {
    if (!isDrawing || !lastPoint) return
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const ctx = getSignatureContext()
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
    setLastPoint({ x, y })
    try {
      setSignatureDataUrl(canvas.toDataURL('image/png'))
    } catch { /* ignore */ }
  }

  const endSignature = () => {
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    setIsDrawing(false)
    setLastPoint(null)
    try {
      setSignatureDataUrl(canvas.toDataURL('image/png'))
    } catch { /* ignore */ }
    const activeId = canvas.__activePointerId
    if (activeId && canvas.releasePointerCapture) {
      try { canvas.releasePointerCapture(activeId) } catch { /* ignore */ }
    }
    canvas.__activePointerId = null
  }

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = rect.width
    const height = rect.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(1,0,0,1,0,0)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    // reapply transform for DPR
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    setSignatureDataUrl('')
    setFormError('')
  }

  const toggleArrayField = (fieldName, optionValue) => {
    const current = watch(fieldName) || []
    const next = current.includes(optionValue)
      ? current.filter((value) => value !== optionValue)
      : [...current, optionValue]

    setValue(fieldName, next)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFileName(file.name)
      setFileUrl(url)
      setEditedImageUrl(url)
      setEditorOpen(true)
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
    console.log('handleContinue clicked, step=', step)
    if (step === 0) {
      if (!fileName) {
        return
      }
      handleNext()
      return
    }

    if (step === 1) {
      handleNext()
      return
    }

    if (step === 2) {
      setFormError('')
      const valid = await trigger([
        'fullName',
        'email',
        'nationality',
        'countryOfResidence',
        'passportNumber',
        'residentStatus',
        'gender',
        'dateOfBirth',
        'otherNationalities',
        'nationalIdNumber',
        'nationalIdExpiry',
        'passportExpiry',
        'externalReferenceNumber',
        'address',
        'state',
        'townCity',
        'zipCode',
        'dialingCode',
        'contactNumber',
        'workType',
        'industry',
        'productTypeOffered',
        'productOffered',
        'companyName',
        'positionsInCompany',
        'faceToFaceDeclaration',
      ])
      console.log('Profile step validation', valid, errors)
      if (!valid) {
        setFormError('Please fix the highlighted fields before continuing.')
        return
      }
      handleNext()
      return
    }

    if (step === 3) {
      setFormError('')
      const valid = await trigger([
        'pepCurrentPublicPosition',
        'pepHeldPublicPosition12Months',
        'pepEverHeldPublicPosition',
        'diplomaticImmunity',
        'relativeHeldPublicPosition12Months',
        'closeAssociateHeldPublicPosition12Months',
        'convictionAgainstCourt',
        'sourceOfWealth',
        'sourceOfFunds',
      ])
      if (!valid) {
        setFormError('Please fix all required account info fields before continuing.')
        console.log('Account info validation failed', errors)
        return
      }
      handleNext()
      return
    }

    if (step === 4) {
      if (!signatureDataUrl) {
        setFormError('Please sign using the pointer before continuing.')
        return
      }
      setFormError('')
      handleNext()
      return
    }
  }

  const onSubmit = async (data) => {
    if (step === 4) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log('Self service individual data:', data)
      handleNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Self Service Onboarding</h1>
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
          {step === 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                <p className="text-sm font-semibold text-text">Passport photo page scan copy</p>
                <p className="mt-2 text-xs text-text-muted">Click to browse or drag and drop</p>
                <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-border px-4 py-8 text-sm text-text-muted transition hover:border-brand-500 hover:text-brand-600">
                  <input type="file" className="sr-only" accept="image/*" onChange={handleFileUpload} />
                  {fileName || 'Upload file'}
                </label>
                {editedImageUrl && (
                  <div className="mt-6 rounded-3xl border border-border bg-surface-alt p-4 text-left">
                    <p className="text-xs font-semibold text-text-muted">Current preview</p>
                    <img
                      src={editedImageUrl}
                      alt="Uploaded document preview"
                      className="mt-3 h-44 w-full rounded-2xl object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-text">Identity document</p>
                <div className="mt-4 h-full rounded-2xl border border-border bg-surface-alt p-4 text-center text-sm text-text-muted">
                  <p>Upload a passport or ID card to continue.</p>
                </div>
              </div>
            </div>
          )}

          <Modal
            open={editorOpen}
            title="Resize uploaded image"
            description="Adjust scale and rotation before saving the document preview."
            onClose={() => setEditorOpen(false)}
            footer={null}
          >
            <ImageEditor
              imageUrl={fileUrl || editedImageUrl}
              onSave={(updatedUrl) => {
                setEditedImageUrl(updatedUrl)
                setEditorOpen(false)
              }}
              onClose={() => setEditorOpen(false)}
            />
          </Modal>

          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                  <p className="text-sm font-semibold text-text">UPLOAD YOUR PROOF OF ADDRESS DOCUMENT</p>
                  <p className="mt-2 text-xs text-text-muted">You can upload JPG, PNG, or PDF files.</p>
                  <label className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-3xl border border-dashed border-border px-4 py-10 text-sm text-text-muted transition hover:border-brand-500 hover:text-brand-600">
                    <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        setProofOfAddress({ file, url: URL.createObjectURL(file) })
                      }
                    }} />
                    <span className="font-semibold text-brand-600">UPLOAD</span>
                  </label>
                  {proofOfAddress && (
                    <Attachment className="mt-4 w-full text-left">
                      <AttachmentMedia variant={isImageFile(proofOfAddress.file) ? 'image' : 'icon'}>
                        {isImageFile(proofOfAddress.file) ? (
                          <img src={proofOfAddress.url} alt={proofOfAddress.file.name} />
                        ) : (
                          <FileText />
                        )}
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{proofOfAddress.file.name}</AttachmentTitle>
                        <AttachmentDescription>{formatFileSize(proofOfAddress.file.size)}</AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction
                          aria-label="Remove proof of address"
                          onClick={() => setProofOfAddress(null)}
                        >
                          <X />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  )}
                </div>
                <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                  <p className="text-sm font-semibold text-text">UPLOAD YOUR VISA DOCUMENT</p>
                  <p className="mt-2 text-xs text-text-muted">You can upload JPG, PNG, or PDF files.</p>
                  <label className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-3xl border border-dashed border-border px-4 py-10 text-sm text-text-muted transition hover:border-brand-500 hover:text-brand-600">
                    <input type="file" className="sr-only" accept="image/*,.pdf" onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        setVisaDocument({ file, url: URL.createObjectURL(file) })
                      }
                    }} />
                    <span className="font-semibold text-brand-600">UPLOAD</span>
                  </label>
                  {visaDocument && (
                    <Attachment className="mt-4 w-full text-left">
                      <AttachmentMedia variant={isImageFile(visaDocument.file) ? 'image' : 'icon'}>
                        {isImageFile(visaDocument.file) ? (
                          <img src={visaDocument.url} alt={visaDocument.file.name} />
                        ) : (
                          <FileText />
                        )}
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{visaDocument.file.name}</AttachmentTitle>
                        <AttachmentDescription>{formatFileSize(visaDocument.file.size)}</AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction
                          aria-label="Remove visa document"
                          onClick={() => setVisaDocument(null)}
                        >
                          <X />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  )}
                </div>
                <div className="rounded-3xl border border-border bg-surface p-6 text-center">
                  <p className="text-sm font-semibold text-text">ALL OTHER DOCUMENTS</p>
                  <p className="mt-2 text-xs text-text-muted">For all other relevant documents, you can upload JPG, PNG, or PDF files.</p>
                  <label className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-3xl border border-dashed border-border px-4 py-10 text-sm text-text-muted transition hover:border-brand-500 hover:text-brand-600">
                    <input type="file" className="sr-only" accept="image/*,.pdf" multiple onChange={(event) => {
                      const files = Array.from(event.target.files || [])
                      const newFiles = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
                      setOtherDocuments((prev) => [...prev, ...newFiles])
                    }} />
                    <span className="font-semibold text-brand-600">Drop files here</span>
                  </label>
                  {otherDocuments.length > 0 && (
                    <AttachmentGroup className="mt-4 text-left">
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
                    </AttachmentGroup>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {formError ? (
                <div className="rounded-3xl border border-danger bg-danger/10 p-4 text-sm text-danger">
                  {formError}
                </div>
              ) : null}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4">
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
                          options={[
                            { label: 'Resident', value: 'resident' },
                            { label: 'Non-resident', value: 'non-resident' },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select resident status"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <SearchableSelect
                          options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' },
                          ]}
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
                          options={nationalityOptions.map(opt => ({ label: opt.name, value: opt.code }))}
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
                    name="countryOfResidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of residence</FormLabel>
                        <SearchableSelect
                          options={countryOptions.map(opt => ({ label: opt.name, value: opt.code }))}
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
                    name="otherNationalities"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Do you have other nationalities?</FormLabel>
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
                  {form.watch('otherNationalities') === 'yes' && (
                    <FormField
                      control={form.control}
                      name="otherNationalityDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify other nationalities</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nationalIdNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationalIdExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID expiry</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                    name="dialingCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dialing code</FormLabel>
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
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="workType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work type</FormLabel>
                        <SearchableSelect
                          options={[
                            { label: 'Full-time', value: 'full-time' },
                            { label: 'Part-time', value: 'part-time' },
                            { label: 'Contract', value: 'contract' },
                          ]}
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
                          options={[
                            { label: 'Finance', value: 'finance' },
                            { label: 'Technology', value: 'technology' },
                            { label: 'Healthcare', value: 'healthcare' },
                          ]}
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
                        <FormLabel>Product type offered to customer</FormLabel>
                        <SearchableSelect
                          options={[
                            { label: 'Service', value: 'service' },
                            { label: 'Software', value: 'software' },
                            { label: 'Hardware', value: 'hardware' },
                          ]}
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
                        <SearchableSelect
                          options={[
                            { label: 'Company A', value: 'company-a' },
                            { label: 'Company B', value: 'company-b' },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select company name"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="positionsInCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Positions in company</FormLabel>
                        <SearchableSelect
                          options={[
                            { label: 'Manager', value: 'manager' },
                            { label: 'Director', value: 'director' },
                            { label: 'Owner', value: 'owner' },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select positions in company"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {formError ? (
                <div className="rounded-3xl border border-danger bg-danger/10 p-4 text-sm text-danger">
                  {formError}
                </div>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-text">Politically exposed person</p>
                  <div className="mt-4 space-y-4 text-sm text-text-muted">
                    {pepQuestions.map((question) => (
                      <FormField
                        key={question.name}
                        control={form.control}
                        name={question.name}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base">{question.label}</FormLabel>
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
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-text">Source of wealth</p>
                  <p className="mt-2 text-sm text-text-muted">Choose all that apply.</p>
                  <FormField
                    control={form.control}
                    name="sourceOfWealth"
                    render={() => (
                      <FormItem>
                        <div className="mt-4 space-y-3">
                          {sourceOfWealthOptions.map((option) => (
                            <label key={option} className="inline-flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface-alt p-3 text-sm">
                              <input
                                type="checkbox"
                                checked={(watch('sourceOfWealth') || []).includes(option)}
                                onChange={() => toggleArrayField('sourceOfWealth', option)}
                                className="mt-1 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sourceOfWealthOtherDetails"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Other source of wealth</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-text">Source of funds</p>
                  <p className="mt-2 text-sm text-text-muted">Choose all that apply.</p>
                  <FormField
                    control={form.control}
                    name="sourceOfFunds"
                    render={() => (
                      <FormItem>
                        <div className="mt-4 space-y-3">
                          {sourceOfFundsOptions.map((option) => (
                            <label key={option} className="inline-flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface-alt p-3 text-sm">
                              <input
                                type="checkbox"
                                checked={(watch('sourceOfFunds') || []).includes(option)}
                                onChange={() => toggleArrayField('sourceOfFunds', option)}
                                className="mt-1 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sourceOfFundsOtherDetails"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Other source of funds</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <Label className="text-text-muted">Name</Label>
                  <Input value={values.fullName || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">Email</Label>
                  <Input value={values.email || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">Phone number</Label>
                  <Input value={values.contactNumber || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">Nationality</Label>
                  <Input value={values.nationality || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <Label className="text-text-muted">PEP current public position</Label>
                  <Input value={values.pepCurrentPublicPosition || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">PEP held public position in last 12 months</Label>
                  <Input value={values.pepHeldPublicPosition12Months || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">PEP ever held public position</Label>
                  <Input value={values.pepEverHeldPublicPosition || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">Diplomatic immunity</Label>
                  <Input value={values.diplomaticImmunity || ''} readOnly className="mt-2 bg-surface-alt" />
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <Label className="text-text-muted">Source of wealth</Label>
                  <Input value={(values.sourceOfWealth || []).join(', ') || 'Not provided'} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div>
                  <Label className="text-text-muted">Source of funds</Label>
                  <Input value={(values.sourceOfFunds || []).join(', ') || 'Not provided'} readOnly className="mt-2 bg-surface-alt" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-text-muted">Other details</Label>
                  <Input value={values.sourceOfWealthOtherDetails || values.sourceOfFundsOtherDetails || 'None'} readOnly className="mt-2 bg-surface-alt" />
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text">Signature panel</p>
                    <p className="mt-2 text-xs text-text-muted">Use pointer to sign below and enter your details.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={clearSignature}>
                    Clear
                  </Button>
                </div>
                <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-white">
                  <canvas
                    ref={signatureCanvasRef}
                    className="h-48 w-full touch-none"
                    onPointerDown={startSignature}
                    onPointerMove={drawSignature}
                    onPointerUp={endSignature}
                    onPointerLeave={endSignature}
                  />
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="signatureName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signature</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="signatureRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CEO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="signatureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">ID Document</p>
                  {editedImageUrl ? (
                    <img src={editedImageUrl} alt="ID document preview" className="mt-2 h-44 w-full rounded-2xl object-contain" />
                  ) : (
                    <p className="mt-2 text-sm text-text">Not uploaded</p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Signature details</p>
                  <p className="mt-2 text-sm text-text">{values.signatureName || 'Name not entered'}</p>
                  <p className="mt-1 text-sm text-text">{values.signatureRole || 'Role not entered'}</p>
                  <p className="mt-1 text-sm text-text">{values.signatureDate || 'Date not entered'}</p>
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Proof of address</p>
                  <p className="mt-2 text-sm text-text">{proofOfAddress?.file?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Visa document</p>
                  <p className="mt-2 text-sm text-text">{visaDocument?.file?.name || 'Not provided'}</p>
                </div>
              </div>
              {otherDocuments.length > 0 ? (
                <div className="rounded-3xl border border-border bg-surface p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Other documents</p>
                  <ul className="mt-3 space-y-2 text-sm text-text">
                    {otherDocuments.map((item, index) => (
                      <li key={`${item.file.name}-${index}`} className="rounded-2xl bg-surface-alt p-3">
                        {item.file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-3xl border border-border bg-surface p-4 text-sm text-text-muted">
                  No extra documents uploaded.
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="rounded-3xl border border-border bg-brand-50 p-6 text-center">
              <h2 className="text-xl font-semibold text-brand-700">Finished</h2>
              <p className="mt-2 text-sm text-text-muted">Your individual onboarding has been created successfully.</p>
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

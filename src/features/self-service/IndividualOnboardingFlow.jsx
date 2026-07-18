import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getData } from 'country-list'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { ImageEditor } from '../../components/ui/ImageEditor'
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
import { FileText, X } from 'lucide-react'
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
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
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
  const values = watch()

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
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
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
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
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
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {steps.map((label, index) => (
            <div key={label} className="space-y-2">
              <p className={`text-xs font-semibold ${index === step ? 'text-brand-600' : 'text-text-muted'}`}>
                {label}
              </p>
              <div
                className={`h-1 rounded-full ${
                  index <= step ? 'bg-brand-600' : 'bg-surface-alt'
                }`}
              />
            </div>
          ))}
        </div>

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
                      <option value="resident">Resident</option>
                      <option value="non-resident">Non-resident</option>
                    </Select>
                    {errors.residentStatus && <p className="mt-1 text-sm text-danger">{errors.residentStatus.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select id="gender" {...register('gender')} error={!!errors.gender}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
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
                  <div>
                    <Label htmlFor="countryOfResidence">Country of residence</Label>
                    <Select id="countryOfResidence" {...register('countryOfResidence')} error={!!errors.countryOfResidence}>
                      {countryOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.name}
                        </option>
                      ))}
                    </Select>
                    {errors.countryOfResidence && <p className="mt-1 text-sm text-danger">{errors.countryOfResidence.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport number</Label>
                    <Input id="passportNumber" {...register('passportNumber')} error={!!errors.passportNumber} />
                    {errors.passportNumber && <p className="mt-1 text-sm text-danger">{errors.passportNumber.message}</p>}
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-text">Do you have other nationalities?</p>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="yes" {...register('otherNationalities')} />
                        <span className="text-sm text-text">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="no" {...register('otherNationalities')} />
                        <span className="text-sm text-text">No</span>
                      </label>
                    </div>
                    {errors.otherNationalities && <p className="mt-1 text-sm text-danger">{errors.otherNationalities.message}</p>}
                  </div>
                  {watch('otherNationalities') === 'yes' && (
                    <div>
                      <Label htmlFor="otherNationalityDetails">Specify other nationalities</Label>
                      <Input id="otherNationalityDetails" {...register('otherNationalityDetails')} error={!!errors.otherNationalityDetails} />
                      {errors.otherNationalityDetails && <p className="mt-1 text-sm text-danger">{errors.otherNationalityDetails.message}</p>}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nationalIdNumber">National ID number</Label>
                    <Input id="nationalIdNumber" {...register('nationalIdNumber')} error={!!errors.nationalIdNumber} />
                    {errors.nationalIdNumber && <p className="mt-1 text-sm text-danger">{errors.nationalIdNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="nationalIdExpiry">National ID expiry</Label>
                    <Input id="nationalIdExpiry" type="date" {...register('nationalIdExpiry')} error={!!errors.nationalIdExpiry} />
                    {errors.nationalIdExpiry && <p className="mt-1 text-sm text-danger">{errors.nationalIdExpiry.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="passportExpiry">Passport expiry</Label>
                    <Input id="passportExpiry" type="date" {...register('passportExpiry')} error={!!errors.passportExpiry} />
                    {errors.passportExpiry && <p className="mt-1 text-sm text-danger">{errors.passportExpiry.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="externalReferenceNumber">External reference number</Label>
                    <Input id="externalReferenceNumber" {...register('externalReferenceNumber')} error={!!errors.externalReferenceNumber} />
                    {errors.externalReferenceNumber && <p className="mt-1 text-sm text-danger">{errors.externalReferenceNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register('address')} error={!!errors.address} />
                    {errors.address && <p className="mt-1 text-sm text-danger">{errors.address.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register('state')} error={!!errors.state} />
                    {errors.state && <p className="mt-1 text-sm text-danger">{errors.state.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="townCity">Town / City</Label>
                    <Input id="townCity" {...register('townCity')} error={!!errors.townCity} />
                    {errors.townCity && <p className="mt-1 text-sm text-danger">{errors.townCity.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip code / Postal code</Label>
                    <Input id="zipCode" {...register('zipCode')} error={!!errors.zipCode} />
                    {errors.zipCode && <p className="mt-1 text-sm text-danger">{errors.zipCode.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dialingCode">Dialing code</Label>
                    <Input id="dialingCode" {...register('dialingCode')} error={!!errors.dialingCode} />
                    {errors.dialingCode && <p className="mt-1 text-sm text-danger">{errors.dialingCode.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Phone number</Label>
                    <Input id="contactNumber" {...register('contactNumber')} error={!!errors.contactNumber} />
                    {errors.contactNumber && <p className="mt-1 text-sm text-danger">{errors.contactNumber.message}</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="workType">Work type</Label>
                    <Select id="workType" {...register('workType')} error={!!errors.workType}>
                      <option value="">Select work type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </Select>
                    {errors.workType && <p className="mt-1 text-sm text-danger">{errors.workType.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select id="industry" {...register('industry')} error={!!errors.industry}>
                      <option value="">Select industry</option>
                      <option value="finance">Finance</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                    </Select>
                    {errors.industry && <p className="mt-1 text-sm text-danger">{errors.industry.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="productTypeOffered">Product type offered to customer</Label>
                    <Select id="productTypeOffered" {...register('productTypeOffered')} error={!!errors.productTypeOffered}>
                      <option value="">Select product type</option>
                      <option value="service">Service</option>
                      <option value="software">Software</option>
                      <option value="hardware">Hardware</option>
                    </Select>
                    {errors.productTypeOffered && <p className="mt-1 text-sm text-danger">{errors.productTypeOffered.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="productOffered">Product offered</Label>
                    <Input id="productOffered" {...register('productOffered')} error={!!errors.productOffered} />
                    {errors.productOffered && <p className="mt-1 text-sm text-danger">{errors.productOffered.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company name</Label>
                    <Select id="companyName" {...register('companyName')} error={!!errors.companyName}>
                      <option value="">Select company name</option>
                      <option value="company-a">Company A</option>
                      <option value="company-b">Company B</option>
                    </Select>
                    {errors.companyName && <p className="mt-1 text-sm text-danger">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="positionsInCompany">Positions in company</Label>
                    <Select id="positionsInCompany" {...register('positionsInCompany')} error={!!errors.positionsInCompany}>
                      <option value="">Select positions in company</option>
                      <option value="manager">Manager</option>
                      <option value="director">Director</option>
                      <option value="owner">Owner</option>
                    </Select>
                    {errors.positionsInCompany && <p className="mt-1 text-sm text-danger">{errors.positionsInCompany.message}</p>}
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-text">Customer met face-to-face?</p>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="yes" {...register('faceToFaceDeclaration')} />
                        <span className="text-sm text-text">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="no" {...register('faceToFaceDeclaration')} />
                        <span className="text-sm text-text">No</span>
                      </label>
                    </div>
                    {errors.faceToFaceDeclaration && <p className="mt-1 text-sm text-danger">{errors.faceToFaceDeclaration.message}</p>}
                  </div>
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
                      <div key={question.name}>
                        <p className="mb-2 font-medium text-text">{question.label}</p>
                        <div className="flex flex-wrap gap-4">
                          <label className="inline-flex items-center gap-2">
                            <input type="radio" value="yes" {...register(question.name)} />
                            <span>Yes</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input type="radio" value="no" {...register(question.name)} />
                            <span>No</span>
                          </label>
                        </div>
                        {errors[question.name] && <p className="mt-1 text-sm text-danger">{errors[question.name].message}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-text">Source of wealth</p>
                  <p className="mt-2 text-sm text-text-muted">Choose all that apply.</p>
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
                  {errors.sourceOfWealth && <p className="mt-2 text-sm text-danger">{errors.sourceOfWealth.message}</p>}
                  <div className="mt-4">
                    <Label htmlFor="sourceOfWealthOtherDetails">Other source of wealth</Label>
                    <Input id="sourceOfWealthOtherDetails" {...register('sourceOfWealthOtherDetails')} error={!!errors.sourceOfWealthOtherDetails} />
                    {errors.sourceOfWealthOtherDetails && <p className="mt-1 text-sm text-danger">{errors.sourceOfWealthOtherDetails.message}</p>}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6">
                  <p className="text-sm font-semibold text-text">Source of funds</p>
                  <p className="mt-2 text-sm text-text-muted">Choose all that apply.</p>
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
                  {errors.sourceOfFunds && <p className="mt-2 text-sm text-danger">{errors.sourceOfFunds.message}</p>}
                  <div className="mt-4">
                    <Label htmlFor="sourceOfFundsOtherDetails">Other source of funds</Label>
                    <Input id="sourceOfFundsOtherDetails" {...register('sourceOfFundsOtherDetails')} error={!!errors.sourceOfFundsOtherDetails} />
                    {errors.sourceOfFundsOtherDetails && <p className="mt-1 text-sm text-danger">{errors.sourceOfFundsOtherDetails.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Name</p>
                  <p className="mt-2 text-sm text-text">{values.fullName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Email</p>
                  <p className="mt-2 text-sm text-text">{values.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Phone number</p>
                  <p className="mt-2 text-sm text-text">{values.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Nationality</p>
                  <p className="mt-2 text-sm text-text">{values.nationality}</p>
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">PEP current public position</p>
                  <p className="mt-2 text-sm text-text">{values.pepCurrentPublicPosition}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">PEP held public position in last 12 months</p>
                  <p className="mt-2 text-sm text-text">{values.pepHeldPublicPosition12Months}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">PEP ever held public position</p>
                  <p className="mt-2 text-sm text-text">{values.pepEverHeldPublicPosition}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Diplomatic immunity</p>
                  <p className="mt-2 text-sm text-text">{values.diplomaticImmunity}</p>
                </div>
              </div>
              <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Source of wealth</p>
                  <p className="mt-2 text-sm text-text">{(values.sourceOfWealth || []).join(', ') || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Source of funds</p>
                  <p className="mt-2 text-sm text-text">{(values.sourceOfFunds || []).join(', ') || 'Not provided'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Other details</p>
                  <p className="mt-2 text-sm text-text">{values.sourceOfWealthOtherDetails || values.sourceOfFundsOtherDetails || 'None'}</p>
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
                  <div>
                    <Label htmlFor="signatureName">Signature</Label>
                    <Input id="signatureName" {...register('signatureName')} placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="signatureRole">Role</Label>
                    <Input id="signatureRole" {...register('signatureRole')} placeholder="e.g. CEO" />
                  </div>
                  <div>
                    <Label htmlFor="signatureDate">Date</Label>
                    <Input id="signatureDate" type="date" {...register('signatureDate')} />
                  </div>
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
      </Card>
    </div>
  )
}

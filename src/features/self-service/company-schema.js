import { z } from 'zod'

const enhancedStakeholderSchema = z.object({
  entityType: z.string().min(1, 'Entity type is required'),
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth/incorporation is required'),
  dateOfAppointment: z.string().optional(),
  dateOfTermination: z.string().optional(),
  percentOfSharesHeld: z.string().optional(),
  countryOfResidence: z.string().min(1, 'Country of residence is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  idFront: z.string().optional(),
  idBack: z.string().optional(),
  nationalIdNumber: z.string().optional(),
  nationalIdExpiry: z.string().optional(),
  passportDocument: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  screenAndOnboard: z.boolean().optional(),
  workType: z.string().optional(),
  industries: z.string().optional(),
  productTypeOfferedToCustomer: z.string().optional(),
})

export const selfServiceCompanySchema = z.object({
  // Company basic info
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Enter a valid email'),
  companyRelationship: z.string().min(1, 'Company relationship is required'),
  dateOfIncorporation: z.string().min(1, 'Date of incorporation is required'),
  countryOfOperation: z.string().min(1, 'Country of operation is required'),
  countryOfDomicile: z.string().min(1, 'Country of domicile is required'),
  operateInOtherCountries: z.enum(['yes', 'no'], 'Select yes or no'),
  specifyOtherCountries: z.string().optional(),
  businessRegistrationNumber: z.string().min(1, 'Business registration number is required'),
  businessLicenseExpiry: z.string().min(1, 'Business license expiry is required'),
  
  // Contact Information
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'State is required'),
  townCity: z.string().min(1, 'Town/City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  dialingCode: z.string().min(1, 'Dialing code is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  
  // Profile Information
  industryType: z.string().min(1, 'Industry type is required'),
  productTypeOffered: z.string().min(1, 'Product type offered is required'),
  productOffered: z.string().min(1, 'Product offered is required'),
  
  // Face to Face Declaration
  faceToFaceDeclaration: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Select whether face-to-face is accepted' }),
  }),
  
  // Stakeholders Information - All types
  companyShareholders: z.array(enhancedStakeholderSchema).optional(),
  authorizedPersons: z.array(enhancedStakeholderSchema).optional(),
  companyDirectors: z.array(enhancedStakeholderSchema).optional(),
  executiveManagement: z.array(enhancedStakeholderSchema).optional(),
  ultimateBeneficialOwner: z.array(enhancedStakeholderSchema).optional(),
  
  // Source of Funds
  sourceOfFunds: z.string().min(1, 'Source of funds is required'),
})

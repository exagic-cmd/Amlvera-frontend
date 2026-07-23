import { z } from 'zod'

export const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Enter a valid email'),
  departmentDivision: z.string().min(1, 'Select a department/division'),
  companyRegistrationNumber: z.string().min(1, 'Company registration number is required'),
  website: z.string().url('Enter a valid URL'),
  phone: z.string().min(1, 'Phone number is required'),
  contactEmail: z.string().email('Enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  dialingCode: z.string().min(1, 'Dialing code is required'),
  enterPhoneNumber: z.string().min(1, 'Phone number is required'),
  industry: z.string().min(1, 'Select industry'),
  productType: z.string().min(1, 'Select product type'),
  priority: z.string().min(1, 'Select priority'),
  faceToFaceDeclaration: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Select whether face-to-face is accepted' }),
  }),
})

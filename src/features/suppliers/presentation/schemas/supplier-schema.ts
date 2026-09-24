import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères.').max(150),
  contactName: z.string().max(150).nullable().optional().transform((v) => v || null),
  email: z.string().email('Adresse e-mail invalide.').nullable().optional().transform((v) => v || null),
  phone: z.string().max(30).nullable().optional().transform((v) => v || null),
  address: z.string().max(300).nullable().optional().transform((v) => v || null),
})

export type SupplierFormValues = z.infer<typeof supplierSchema>

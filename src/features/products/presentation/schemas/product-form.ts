import { z } from 'zod'

const positiveIntString = z
  .string()
  .regex(/^\d+$/, 'Doit être un nombre entier positif.')
  .refine((v) => parseInt(v, 10) > 0, 'Doit être supérieur à 0.')

export const productSchema = z.object({
  sku: z.string().min(2, 'Le SKU doit comporter au moins 2 caractères.').max(50)
    .regex(/^[A-Z0-9\-_]+$/, 'Le SKU ne peut contenir que des lettres majuscules, chiffres, tirets et underscores.'),
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères.').max(200),
  description: z.string().max(1000).nullable().optional().transform((v) => v || null),
  categoryId: z.number({ required_error: 'La catégorie est obligatoire.' }).int().positive(),
  supplierId: z.number().int().positive().nullable().optional().transform((v) => v ?? null),
  unit: z.enum(['PIECE', 'BOX', 'CARTON']),
  purchasePrice: positiveIntString,
  salePrice: positiveIntString,
  minimumStock: z.number({ required_error: 'Le stock minimum est obligatoire.' }).int().min(0),
})

export type ProductFormValues = z.infer<typeof productSchema>

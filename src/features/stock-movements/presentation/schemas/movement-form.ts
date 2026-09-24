import { z } from 'zod'

export const movementSchema = z.object({
  productId: z.number({ required_error: 'Le produit est obligatoire.' }).int().positive(),
  type: z.enum(['IN', 'OUT']),
  quantity: z.number({ required_error: 'La quantité est obligatoire.' }).int().min(1, 'La quantité doit être au moins 1.'),
  supplierId: z.number().int().positive().nullable().optional().transform((v) => v ?? null),
  reference: z.string().max(100).nullable().optional().transform((v) => v || null),
  note: z.string().max(500).nullable().optional().transform((v) => v || null),
})

export type MovementFormValues = z.infer<typeof movementSchema>

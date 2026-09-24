import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères.').max(100),
  description: z.string().max(500).nullable().optional().transform((v) => v ?? null),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

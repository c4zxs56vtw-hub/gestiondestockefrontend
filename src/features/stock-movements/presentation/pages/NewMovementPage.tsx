import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { movementSchema, type MovementFormValues } from '@/features/stock-movements/presentation/schemas/movement-form'
import { useMovementCreate } from '@/features/stock-movements/presentation/hooks/useMovementFeature'
import { useProductsList } from '@/features/products/presentation/hooks/useProductFeature'
import { useSuppliersList } from '@/features/suppliers/presentation/hooks/useSupplierFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { Textarea } from '@/shared/presentation/components/ui/textarea'
import { FormField } from '@/shared/presentation/components/FormField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/presentation/components/ui/select'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'

export function NewMovementPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const createMut = useMovementCreate()
  const { data: products } = useProductsList({ page: 0, size: 100, sort: 'name,asc', status: 'ACTIVE' })
  const { data: suppliers } = useSuppliersList({ page: 0, size: 100, sort: 'name,asc' })

  const defaultProductId = searchParams.get('productId') ? Number(searchParams.get('productId')) : undefined

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: { productId: defaultProductId, type: 'IN', quantity: 1, supplierId: null, reference: null, note: null },
  })

  const movementType = watch('type')

  const onSubmit = async (values: MovementFormValues) => {
    try {
      const movement = await createMut.mutateAsync(values)
      toast('Mouvement enregistré avec succès.', 'success')
      navigate(`/stock-movements/${movement.id}`)
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Nouveau mouvement de stock"
        breadcrumbs={[{ label: 'Mouvements', to: '/stock-movements' }, { label: 'Nouveau' }]}
      />

      <div className="max-w-xl bg-white rounded-lg border border-surface-border shadow-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Produit" required error={errors.productId?.message}>
            <Controller control={control} name="productId" render={({ field }) => (
              <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger error={!!errors.productId}><SelectValue placeholder="Choisir un produit actif..." /></SelectTrigger>
                <SelectContent>
                  {products?.content.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name} — stock: {p.quantityInStock}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </FormField>

          <FormField label="Type de mouvement" required error={errors.type?.message}>
            <Controller control={control} name="type" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Entrée</SelectItem>
                  <SelectItem value="OUT">Sortie</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </FormField>

          <FormField label="Quantité" htmlFor="mov-qty" required error={errors.quantity?.message}>
            <Input id="mov-qty" type="number" min={1} {...register('quantity', { valueAsNumber: true })} error={!!errors.quantity} />
          </FormField>

          {movementType === 'IN' && (
            <FormField label="Fournisseur" error={errors.supplierId?.message}>
              <Controller control={control} name="supplierId" render={({ field }) => (
                <Select value={field.value ? String(field.value) : 'none'} onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {suppliers?.content.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </FormField>
          )}

          <FormField label="Référence" htmlFor="mov-ref" error={errors.reference?.message} hint="Numéro de bon de livraison ou de commande">
            <Input id="mov-ref" {...register('reference')} placeholder="BL-2026-XXXX ou CMD-XXXX" />
          </FormField>

          <FormField label="Note" htmlFor="mov-note" error={errors.note?.message}>
            <Textarea id="mov-note" {...register('note')} placeholder="Commentaire optionnel..." rows={2} />
          </FormField>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/stock-movements')}>Annuler</Button>
            <Button type="submit" loading={createMut.isPending}>Enregistrer</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

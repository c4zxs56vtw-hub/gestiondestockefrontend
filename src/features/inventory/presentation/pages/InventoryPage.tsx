import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProductsList } from '@/features/products/presentation/hooks/useProductFeature'
import { useCreateAdjustment } from '@/features/inventory/application/use-cases/inventory-use-cases'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { FormField } from '@/shared/presentation/components/FormField'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { ConfirmDialog } from '@/shared/presentation/components/ConfirmDialog'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { SkeletonTable } from '@/shared/presentation/components/ui/skeleton'
import { EmptyState } from '@/shared/presentation/components/EmptyState'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import { formatQuantity, formatCurrency } from '@/shared/presentation/formatters'
import { STOCK_STATUS_LABELS, type Product } from '@/shared/domain/models'
import { ClipboardList } from 'lucide-react'

const adjustmentSchema = z.object({
  countedQuantity: z.number().int().min(0, 'La quantité comptée ne peut pas être négative.'),
  reason: z.string().min(5, 'Veuillez décrire la raison de cet ajustement (5 caractères min.).').max(500),
})
type AdjustmentFormValues = z.infer<typeof adjustmentSchema>

function AdjustmentRow({ product, onAdjust }: { product: Product; onAdjust: (p: Product) => void }) {
  const badgeVariant = product.stockStatus === 'IN_STOCK' ? 'success' : product.stockStatus === 'LOW_STOCK' ? 'warning' : 'danger'
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.sku}</td>
      <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
      <td className="px-4 py-3 text-gray-500">{product.category.name}</td>
      <td className="px-4 py-3 text-right">{formatQuantity(product.quantityInStock, product.unit)}</td>
      <td className="px-4 py-3 text-center"><Badge variant={badgeVariant}>{STOCK_STATUS_LABELS[product.stockStatus]}</Badge></td>
      <td className="px-4 py-3 text-right">{formatCurrency(product.purchasePrice)}</td>
      <td className="px-4 py-3 text-right">
        <Button variant="secondary" size="sm" onClick={() => onAdjust(product)}>Ajuster</Button>
      </td>
    </tr>
  )
}

export function InventoryPage() {
  const { toast } = useToast()
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingValues, setPendingValues] = useState<AdjustmentFormValues | null>(null)

  const { data, isLoading, isError, error, refetch } = useProductsList({
    page: 0, size: 100, sort: 'name,asc', status: 'ACTIVE',
  })
  const adjustMut = useCreateAdjustment()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
  })

  const openAdjust = (p: Product) => {
    setAdjustTarget(p)
    reset({ countedQuantity: p.quantityInStock, reason: '' })
  }

  const onSubmit = (values: AdjustmentFormValues) => {
    setPendingValues(values)
    setShowConfirm(true)
  }

  const confirmAdjust = async () => {
    if (!adjustTarget || !pendingValues) return
    try {
      await adjustMut.mutateAsync({
        productId: adjustTarget.id,
        countedQuantity: pendingValues.countedQuantity,
        expectedStockVersion: adjustTarget.stockVersion,
        reason: pendingValues.reason,
      })
      toast(`Ajustement de ${adjustTarget.name} enregistré.`, 'success')
      setAdjustTarget(null)
      setPendingValues(null)
      setShowConfirm(false)
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
      setShowConfirm(false)
    }
  }

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div>
      <PageHeader
        title="Inventaire physique"
        description="Ajustez les quantités constatées lors d'un comptage physique."
      />

      {adjustTarget && (
        <div className="mb-6 bg-white rounded-lg border border-surface-border shadow-card p-6 max-w-md">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Ajustement : {adjustTarget.name}</h2>
          <p className="text-xs text-gray-500 mb-4">Stock système actuel : <strong>{adjustTarget.quantityInStock}</strong></p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Quantité comptée" htmlFor="adj-qty" required error={errors.countedQuantity?.message}>
              <Input id="adj-qty" type="number" min={0} {...register('countedQuantity', { valueAsNumber: true })} error={!!errors.countedQuantity} />
            </FormField>
            <FormField label="Raison de l'ajustement" htmlFor="adj-reason" required error={errors.reason?.message}>
              <Input id="adj-reason" {...register('reason')} placeholder="ex: Inventaire du 24/09/2026 — 2 unités endommagées" />
            </FormField>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setAdjustTarget(null)}>Annuler</Button>
              <Button type="submit">Valider l'ajustement</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-surface-border shadow-card">
        {isLoading ? <SkeletonTable rows={8} cols={6} /> : data?.content.length === 0 ? (
          <EmptyState icon={<ClipboardList className="h-12 w-12" />} title="Aucun produit actif" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">SKU</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Catégorie</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Stock actuel</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">État</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Prix achat</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data?.content.map((p) => <AdjustmentRow key={p.id} product={p} onAdjust={openAdjust} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm} onOpenChange={setShowConfirm}
        title="Confirmer l'ajustement de stock"
        description={`Vous êtes sur le point d'ajuster le stock de « ${adjustTarget?.name} » de ${adjustTarget?.quantityInStock} à ${pendingValues?.countedQuantity} (delta : ${(pendingValues?.countedQuantity ?? 0) - (adjustTarget?.quantityInStock ?? 0)}). Cette action créera un mouvement d'ajustement permanent.`}
        confirmLabel="Confirmer l'ajustement" onConfirm={confirmAdjust} loading={adjustMut.isPending}
      />
    </div>
  )
}

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Archive } from 'lucide-react'
import { useProductDetail, useProductArchive } from '@/features/products/presentation/hooks/useProductFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { SkeletonCard } from '@/shared/presentation/components/ui/skeleton'
import { ConfirmDialog } from '@/shared/presentation/components/ConfirmDialog'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import { formatCurrency, formatQuantity, formatDateTime } from '@/shared/presentation/formatters'
import { STOCK_STATUS_LABELS, UNIT_LABELS, PRODUCT_STATUS_LABELS } from '@/shared/domain/models'
import { ProductFormDialog } from '../components/ProductFormDialog'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const { data: product, isLoading, isError, error } = useProductDetail(Number(id))
  const archiveMut = useProductArchive()
  const [showEdit, setShowEdit] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  const handleArchive = async () => {
    if (!product) return
    try {
      await archiveMut.mutateAsync(product.id)
      toast(`${product.name} a été archivé.`, 'success')
      setShowArchive(false)
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
      setShowArchive(false)
    }
  }

  if (isLoading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
  if (isError) return <ErrorState error={error} />
  if (!product) return null

  const stockBadgeVariant = product.stockStatus === 'IN_STOCK' ? 'success' : product.stockStatus === 'LOW_STOCK' ? 'warning' : 'danger'

  return (
    <div>
      <PageHeader
        title={product.name}
        breadcrumbs={[{ label: 'Produits', to: '/products' }, { label: product.name }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/products"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</Link>
            </Button>
            {product.status === 'ACTIVE' && (
              <>
                <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
                  <Pencil className="h-4 w-4" aria-hidden /> Modifier
                </Button>
                {product.quantityInStock === 0 && (
                  <Button variant="destructive" size="sm" onClick={() => setShowArchive(true)}>
                    <Archive className="h-4 w-4" aria-hidden /> Archiver
                  </Button>
                )}
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-surface-border shadow-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{product.sku}</span>
              <h2 className="text-lg font-semibold text-gray-900 mt-1">{product.name}</h2>
              {product.description && <p className="text-sm text-gray-500 mt-1">{product.description}</p>}
            </div>
            <div className="flex gap-2">
              <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>{PRODUCT_STATUS_LABELS[product.status]}</Badge>
              <Badge variant={stockBadgeVariant}>{STOCK_STATUS_LABELS[product.stockStatus]}</Badge>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { label: 'Catégorie', value: product.category.name },
              { label: 'Fournisseur', value: product.supplier?.name ?? '—' },
              { label: 'Unité', value: UNIT_LABELS[product.unit] },
              { label: 'Stock minimum', value: product.minimumStock },
              { label: "Prix d'achat", value: formatCurrency(product.purchasePrice) },
              { label: 'Prix de vente', value: formatCurrency(product.salePrice) },
              { label: 'Créé le', value: formatDateTime(product.createdAt) },
              { label: 'Modifié le', value: formatDateTime(product.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Stock card */}
        <div className="bg-white rounded-lg border border-surface-border shadow-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Stock actuel</p>
          <p className={`text-4xl font-bold ${product.stockStatus === 'OUT_OF_STOCK' ? 'text-danger' : product.stockStatus === 'LOW_STOCK' ? 'text-warning' : 'text-success'}`}>
            {product.quantityInStock}
          </p>
          <p className="text-sm text-gray-500 mt-1">{UNIT_LABELS[product.unit].toLowerCase()}s</p>
          <div className="mt-4 w-full border-t border-surface-border pt-4">
            <p className="text-xs text-gray-500">Seuil minimum</p>
            <p className="text-lg font-semibold text-gray-700">{product.minimumStock}</p>
          </div>
          <div className="mt-3 w-full border-t border-surface-border pt-3">
            <p className="text-xs text-gray-500">Valeur en stock</p>
            <p className="text-base font-semibold text-primary">{formatCurrency(String(parseInt(product.purchasePrice) * product.quantityInStock))}</p>
            <p className="text-xs text-gray-400">(prix achat × quantité)</p>
          </div>
          <div className="mt-3">
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/stock-movements/new?productId=${product.id}`}>Enregistrer un mouvement</Link>
            </Button>
          </div>
        </div>
      </div>

      <ProductFormDialog open={showEdit} onClose={() => setShowEdit(false)} product={product} />
      <ConfirmDialog
        open={showArchive} onOpenChange={setShowArchive}
        title="Archiver le produit"
        description={`Archiver « ${product.name} » ? Il ne sera plus visible dans les listes actives.`}
        confirmLabel="Archiver" onConfirm={handleArchive} loading={archiveMut.isPending}
      />
    </div>
  )
}

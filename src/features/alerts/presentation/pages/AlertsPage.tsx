import { Link } from 'react-router-dom'
import { AlertTriangle, XCircle, Bell } from 'lucide-react'
import { useProductsList } from '@/features/products/presentation/hooks/useProductFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { SkeletonCard } from '@/shared/presentation/components/ui/skeleton'
import { EmptyState } from '@/shared/presentation/components/EmptyState'
import { formatQuantity, formatCurrency } from '@/shared/presentation/formatters'
import { STOCK_STATUS_LABELS, type Product } from '@/shared/domain/models'

function AlertCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK'
  return (
    <div className={`bg-white rounded-lg border shadow-card p-4 flex items-start justify-between gap-4 ${isOutOfStock ? 'border-danger-border' : 'border-warning-border'}`}>
      <div className="flex items-start gap-3">
        {isOutOfStock
          ? <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" aria-hidden />
          : <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" aria-hidden />
        }
        <div>
          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            SKU : {product.sku} · Catégorie : {product.category.name}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-600">
              Stock : <strong className={isOutOfStock ? 'text-danger' : 'text-warning'}>{formatQuantity(product.quantityInStock, product.unit)}</strong>
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-600">Min : {product.minimumStock}</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-600">Achat : {formatCurrency(product.purchasePrice)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <Badge variant={isOutOfStock ? 'danger' : 'warning'}>{STOCK_STATUS_LABELS[product.stockStatus]}</Badge>
        <Button size="sm" variant="secondary" asChild>
          <Link to={`/stock-movements/new?productId=${product.id}`}>Réapprovisionner</Link>
        </Button>
      </div>
    </div>
  )
}

export function AlertsPage() {
  const outOfStockQuery = useProductsList({ page: 0, size: 50, sort: 'name,asc', status: 'ACTIVE', stockStatus: 'OUT_OF_STOCK' })
  const lowStockQuery = useProductsList({ page: 0, size: 50, sort: 'name,asc', status: 'ACTIVE', stockStatus: 'LOW_STOCK' })

  const isLoading = outOfStockQuery.isLoading || lowStockQuery.isLoading
  const isError = outOfStockQuery.isError || lowStockQuery.isError
  const error = outOfStockQuery.error ?? lowStockQuery.error

  if (isError) return <ErrorState error={error} onRetry={() => { outOfStockQuery.refetch(); lowStockQuery.refetch() }} />

  const outOfStock = outOfStockQuery.data?.content ?? []
  const lowStock = lowStockQuery.data?.content ?? []
  const total = outOfStock.length + lowStock.length

  return (
    <div>
      <PageHeader
        title="Alertes de stock"
        description={isLoading ? undefined : `${total} alerte${total > 1 ? 's' : ''} active${total > 1 ? 's' : ''}`}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : total === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title="Aucune alerte de stock"
          description="Tous vos produits actifs ont un stock suffisant. Beau travail !"
        />
      ) : (
        <div className="space-y-6">
          {outOfStock.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-danger mb-3">
                <XCircle className="h-4 w-4" aria-hidden />
                Ruptures de stock ({outOfStock.length})
              </h2>
              <div className="space-y-3">
                {outOfStock.map((p) => <AlertCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
          {lowStock.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-warning mb-3">
                <AlertTriangle className="h-4 w-4" aria-hidden />
                Stocks faibles ({lowStock.length})
              </h2>
              <div className="space-y-3">
                {lowStock.map((p) => <AlertCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

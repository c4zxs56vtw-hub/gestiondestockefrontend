import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMovementDetail } from '@/features/stock-movements/presentation/hooks/useMovementFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { SkeletonCard } from '@/shared/presentation/components/ui/skeleton'
import { formatDateTime, formatDelta } from '@/shared/presentation/formatters'
import { MOVEMENT_TYPE_LABELS } from '@/shared/domain/models'

export function MovementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: movement, isLoading, isError, error } = useMovementDetail(Number(id))

  if (isLoading) return <SkeletonCard />
  if (isError) return <ErrorState error={error} />
  if (!movement) return null

  const typeBadge = { IN: 'success', OUT: 'danger', ADJUSTMENT: 'info' } as const

  return (
    <div>
      <PageHeader
        title={`Mouvement #${movement.id}`}
        breadcrumbs={[{ label: 'Mouvements', to: '/stock-movements' }, { label: `#${movement.id}` }]}
        actions={<Button variant="secondary" size="sm" asChild><Link to="/stock-movements"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</Link></Button>}
      />
      <div className="bg-white rounded-lg border border-surface-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant={typeBadge[movement.type]} className="text-sm px-3 py-1">{MOVEMENT_TYPE_LABELS[movement.type]}</Badge>
          <span className="text-sm text-gray-500">{formatDateTime(movement.createdAt)}</span>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {[
            { label: 'Produit', value: movement.product.name },
            { label: 'SKU', value: movement.product.sku },
            { label: 'Fournisseur', value: movement.supplier?.name ?? '—' },
            { label: 'Quantité avant', value: movement.quantityBefore },
            { label: 'Delta', value: formatDelta(movement.quantityDelta) },
            { label: 'Quantité après', value: movement.quantityAfter },
            { label: 'Référence', value: movement.reference ?? '—' },
            { label: 'Note', value: movement.note ?? '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowLeftRight, Eye } from 'lucide-react'
import { useMovementsList } from '@/features/stock-movements/presentation/hooks/useMovementFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/presentation/components/ui/select'
import { EmptyState } from '@/shared/presentation/components/EmptyState'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { Pagination } from '@/shared/presentation/components/Pagination'
import { SkeletonTable } from '@/shared/presentation/components/ui/skeleton'
import { formatDateTime, formatDelta } from '@/shared/presentation/formatters'
import { MOVEMENT_TYPE_LABELS, type MovementType } from '@/shared/domain/models'

function MovBadge({ type }: { type: MovementType }) {
  const styles = { IN: 'success', OUT: 'danger', ADJUSTMENT: 'info' } as const
  return <Badge variant={styles[type]}>{MOVEMENT_TYPE_LABELS[type]}</Badge>
}

export function MovementsPage() {
  const [page, setPage] = useState(0)
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const { data, isLoading, isError, error, refetch } = useMovementsList({
    page, size: 20, sort: 'createdAt,desc',
    type: typeFilter !== 'ALL' ? typeFilter as MovementType : undefined,
  })

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div>
      <PageHeader
        title="Mouvements de stock"
        description={data ? `${data.totalElements} mouvement${data.totalElements > 1 ? 's' : ''}` : undefined}
        actions={
          <Button size="sm" asChild>
            <Link to="/stock-movements/new"><Plus className="h-4 w-4 mr-1" aria-hidden />Nouveau mouvement</Link>
          </Button>
        }
      />

      <div className="bg-white rounded-lg border border-surface-border shadow-card">
        <div className="p-4 border-b border-surface-border flex gap-3">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0) }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les types</SelectItem>
              <SelectItem value="IN">{MOVEMENT_TYPE_LABELS.IN}</SelectItem>
              <SelectItem value="OUT">{MOVEMENT_TYPE_LABELS.OUT}</SelectItem>
              <SelectItem value="ADJUSTMENT">{MOVEMENT_TYPE_LABELS.ADJUSTMENT}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} cols={6} />
        ) : data?.content.length === 0 ? (
          <EmptyState icon={<ArrowLeftRight className="h-12 w-12" />} title="Aucun mouvement trouvé" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Produit</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Avant</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Delta</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Après</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Référence</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data?.content.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDateTime(m.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{m.product.name}</td>
                    <td className="px-4 py-3 text-center"><MovBadge type={m.type} /></td>
                    <td className="px-4 py-3 text-right text-gray-500">{m.quantityBefore}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${m.quantityDelta > 0 ? 'text-success' : m.quantityDelta < 0 ? 'text-danger' : 'text-gray-500'}`}>
                      {formatDelta(m.quantityDelta)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{m.quantityAfter}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{m.reference ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon-sm" asChild aria-label="Voir le détail">
                        <Link to={`/stock-movements/${m.id}`}><Eye className="h-4 w-4" aria-hidden /></Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} size={data.size} onPageChange={setPage} />}
          </div>
        )}
      </div>
    </div>
  )
}

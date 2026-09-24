import { useDashboard } from '@/features/dashboard/presentation/hooks/useDashboard'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { SkeletonCard } from '@/shared/presentation/components/ui/skeleton'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { formatCurrency, formatDateTime } from '@/shared/presentation/formatters'
import { MOVEMENT_TYPE_LABELS, STOCK_STATUS_LABELS } from '@/shared/domain/models'
import { Package, AlertTriangle, XCircle, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.FC<{ className?: string }>; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-surface-border p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function MovementTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    IN: 'bg-success-light text-success-text border-success-border',
    OUT: 'bg-danger-light text-danger-text border-danger-border',
    ADJUSTMENT: 'bg-info-light text-info-text border-info-border',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${styles[type] ?? 'bg-gray-100 text-gray-600'}`}>
      {MOVEMENT_TYPE_LABELS[type as keyof typeof MOVEMENT_TYPE_LABELS] ?? type}
    </span>
  )
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isError) return <ErrorState error={error} onRetry={refetch} title="Impossible de charger le tableau de bord" />

  return (
    <div>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de votre stock" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Produits actifs" value={data?.counts.activeProducts ?? 0}
              icon={Package} color="bg-primary-50 text-primary-600"
            />
            <StatCard
              title="Valeur du stock" value={formatCurrency(data?.stockValue ?? '0')}
              icon={TrendingUp} color="bg-success-light text-success"
            />
            <StatCard
              title="Stock faible" value={data?.counts.lowStockProducts ?? 0}
              icon={AlertTriangle} color="bg-warning-light text-warning"
            />
            <StatCard
              title="Ruptures" value={data?.counts.outOfStockProducts ?? 0}
              icon={XCircle} color="bg-danger-light text-danger"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-surface-border shadow-card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Mouvements — 30 derniers jours</h2>
          {isLoading ? (
            <div className="h-56 bg-gray-100 animate-skeleton rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.dailySeries ?? []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [value, name === 'in' ? 'Entrées' : name === 'out' ? 'Sorties' : 'Ajust.']}
                  labelFormatter={(label: string) => `Date : ${label}`}
                />
                <Legend formatter={(v: string) => v === 'in' ? 'Entrées' : v === 'out' ? 'Sorties' : 'Ajust.'} />
                <Bar dataKey="in" fill="#16a34a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="out" fill="#dc2626" radius={[2, 2, 0, 0]} />
                <Bar dataKey="adjustments" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent movements */}
        <div className="bg-white rounded-lg border border-surface-border shadow-card">
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-gray-400" aria-hidden />
              Mouvements récents
            </h2>
          </div>
          <div className="divide-y divide-surface-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3 space-y-1">
                  <div className="h-3 bg-gray-200 animate-skeleton rounded w-3/4" />
                  <div className="h-3 bg-gray-200 animate-skeleton rounded w-1/2" />
                </div>
              ))
            ) : (
              (data?.recentMovements ?? []).map((m) => (
                <div key={m.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-xs font-medium text-gray-800 truncate">{m.product.name}</p>
                    <MovementTypeBadge type={m.type} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{formatDateTime(m.createdAt)}</p>
                    <p className={`text-xs font-semibold ${m.quantityDelta > 0 ? 'text-success' : 'text-danger'}`}>
                      {m.quantityDelta > 0 ? '+' : ''}{m.quantityDelta}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

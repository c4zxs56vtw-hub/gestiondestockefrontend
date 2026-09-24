import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useSupplierDetail } from '@/features/suppliers/presentation/hooks/useSupplierFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { SkeletonCard } from '@/shared/presentation/components/ui/skeleton'
import { formatDateTime } from '@/shared/presentation/formatters'

export function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: supplier, isLoading, isError, error } = useSupplierDetail(Number(id))

  if (isLoading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
  if (isError) return <ErrorState error={error} />
  if (!supplier) return null

  return (
    <div>
      <PageHeader
        title={supplier.name}
        breadcrumbs={[{ label: 'Fournisseurs', to: '/suppliers' }, { label: supplier.name }]}
        actions={
          <>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/suppliers"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</Link>
            </Button>
          </>
        }
      />
      <div className="bg-white rounded-lg border border-surface-border shadow-card p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: 'Nom', value: supplier.name },
            { label: 'Personne contact', value: supplier.contactName ?? '—' },
            { label: 'Email', value: supplier.email ?? '—' },
            { label: 'Téléphone', value: supplier.phone ?? '—' },
            { label: 'Adresse', value: supplier.address ?? '—' },
            { label: 'Créé le', value: formatDateTime(supplier.createdAt) },
            { label: 'Modifié le', value: formatDateTime(supplier.updatedAt) },
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

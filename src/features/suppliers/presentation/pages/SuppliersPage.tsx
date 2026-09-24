import { useState } from 'react'
import { Plus, Pencil, Trash2, Truck, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSuppliersList, useSupplierCreate, useSupplierUpdate, useSupplierDelete } from '@/features/suppliers/presentation/hooks/useSupplierFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { ConfirmDialog } from '@/shared/presentation/components/ConfirmDialog'
import { EmptyState } from '@/shared/presentation/components/EmptyState'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { Pagination } from '@/shared/presentation/components/Pagination'
import { SkeletonTable } from '@/shared/presentation/components/ui/skeleton'
import { useDebounce } from '@/shared/presentation/hooks/useDebounce'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import type { Supplier } from '@/shared/domain/models'
import { SupplierFormDialog } from '../components/SupplierFormDialog'

export function SuppliersPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const q = useDebounce(search, 400)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const { data, isLoading, isError, error, refetch } = useSuppliersList({ q, page, size: 20, sort: 'name,asc' })
  const createMut = useSupplierCreate()
  const updateMut = useSupplierUpdate()
  const deleteMut = useSupplierDelete()

  const openCreate = () => { setEditTarget(null); setShowForm(true) }
  const openEdit = (s: Supplier) => { setEditTarget(s); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditTarget(null) }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMut.mutateAsync(deleteTarget.id)
      toast('Fournisseur supprimé.', 'success')
      setDeleteTarget(null)
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
      setDeleteTarget(null)
    }
  }

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div>
      <PageHeader
        title="Fournisseurs"
        description={data ? `${data.totalElements} fournisseur${data.totalElements > 1 ? 's' : ''}` : undefined}
        actions={<Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" aria-hidden />Nouveau fournisseur</Button>}
      />

      <div className="bg-white rounded-lg border border-surface-border shadow-card">
        <div className="p-4 border-b border-surface-border">
          <Input
            type="search" placeholder="Rechercher un fournisseur..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="max-w-xs"
          />
        </div>

        {isLoading ? (
          <SkeletonTable rows={6} cols={4} />
        ) : data?.content.length === 0 ? (
          <EmptyState icon={<Truck className="h-12 w-12" />} title="Aucun fournisseur trouvé" action={{ label: 'Ajouter un fournisseur', onClick: openCreate }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Téléphone</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data?.content.map((sup) => (
                  <tr key={sup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{sup.name}</td>
                    <td className="px-4 py-3 text-gray-500">{sup.contactName ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-500">{sup.email ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-500">{sup.phone ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" asChild aria-label={`Voir ${sup.name}`}>
                          <Link to={`/suppliers/${sup.id}`}><Eye className="h-4 w-4" aria-hidden /></Link>
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(sup)} aria-label={`Modifier ${sup.name}`}>
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(sup)} className="text-danger hover:text-danger" aria-label={`Supprimer ${sup.name}`}>
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data && <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} size={data.size} onPageChange={setPage} />}
          </div>
        )}
      </div>

      <SupplierFormDialog
        open={showForm} onClose={closeForm}
        supplier={editTarget}
        createMut={createMut} updateMut={updateMut}
      />

      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
        title="Supprimer le fournisseur"
        description={`Voulez-vous vraiment supprimer « ${deleteTarget?.name} » ?`}
        confirmLabel="Supprimer" onConfirm={handleDelete} loading={deleteMut.isPending}
      />
    </div>
  )
}

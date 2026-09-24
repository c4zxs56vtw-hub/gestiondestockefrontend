import { useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCategoriesList, useCategoryCreate, useCategoryUpdate, useCategoryDelete } from '@/features/categories/presentation/hooks/useCategoryFeature'
import { categorySchema, type CategoryFormValues } from '@/features/categories/presentation/schemas/category-schema'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { Textarea } from '@/shared/presentation/components/ui/textarea'
import { FormField } from '@/shared/presentation/components/FormField'
import { ConfirmDialog } from '@/shared/presentation/components/ConfirmDialog'
import { EmptyState } from '@/shared/presentation/components/EmptyState'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { Pagination } from '@/shared/presentation/components/Pagination'
import { SkeletonTable } from '@/shared/presentation/components/ui/skeleton'
import { useDebounce } from '@/shared/presentation/hooks/useDebounce'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import type { Category } from '@/shared/domain/models'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody,
} from '@/shared/presentation/components/ui/dialog'
import { formatDateTime } from '@/shared/presentation/formatters'

function CategoryForm({ onSubmit, loading, defaultValues }: {
  onSubmit: (v: CategoryFormValues) => void
  loading: boolean
  defaultValues?: CategoryFormValues
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: '', description: null },
  })
  return (
    <form id="cat-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Nom" htmlFor="cat-name" required error={errors.name?.message}>
        <Input id="cat-name" {...register('name')} error={!!errors.name} placeholder="ex: Informatique" />
      </FormField>
      <FormField label="Description" htmlFor="cat-desc" error={errors.description?.message}>
        <Textarea id="cat-desc" {...register('description')} placeholder="Description optionnelle..." rows={3} />
      </FormField>
    </form>
  )
}

export function CategoriesPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const q = useDebounce(search, 400)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data, isLoading, isError, error, refetch } = useCategoriesList({ q, page, size: 20, sort: 'name,asc' })
  const createMut = useCategoryCreate()
  const updateMut = useCategoryUpdate()
  const deleteMut = useCategoryDelete()

  const openCreate = () => { setEditTarget(null); setShowForm(true) }
  const openEdit = (c: Category) => { setEditTarget(c); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditTarget(null) }

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (editTarget) {
        await updateMut.mutateAsync({ id: editTarget.id, input: values })
        toast('Catégorie modifiée avec succès.', 'success')
      } else {
        await createMut.mutateAsync(values)
        toast('Catégorie créée avec succès.', 'success')
      }
      closeForm()
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMut.mutateAsync(deleteTarget.id)
      toast('Catégorie supprimée.', 'success')
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
        title="Catégories"
        description={data ? `${data.totalElements} catégorie${data.totalElements > 1 ? 's' : ''}` : undefined}
        actions={<Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" aria-hidden />Nouvelle catégorie</Button>}
      />

      <div className="bg-white rounded-lg border border-surface-border shadow-card">
        {/* Search */}
        <div className="p-4 border-b border-surface-border">
          <Input
            type="search" placeholder="Rechercher une catégorie..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="max-w-xs"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <SkeletonTable rows={6} cols={3} />
        ) : data?.content.length === 0 ? (
          <EmptyState icon={<Tag className="h-12 w-12" />} title="Aucune catégorie trouvée" action={{ label: 'Créer une catégorie', onClick: openCreate }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Créée le</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data?.content.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{cat.description ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDateTime(cat.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)} aria-label={`Modifier ${cat.name}`}>
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(cat)} aria-label={`Supprimer ${cat.name}`} className="text-danger hover:text-danger">
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

      {/* Create/Edit dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) closeForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <CategoryForm
              onSubmit={handleSubmit}
              loading={createMut.isPending || updateMut.isPending}
              defaultValues={editTarget ? { name: editTarget.name, description: editTarget.description } : undefined}
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={closeForm}>Annuler</Button>
            <Button type="submit" form="cat-form" loading={createMut.isPending || updateMut.isPending}>
              {editTarget ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
        title="Supprimer la catégorie"
        description={`Voulez-vous vraiment supprimer « ${deleteTarget?.name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer" onConfirm={handleDelete} loading={deleteMut.isPending}
      />
    </div>
  )
}

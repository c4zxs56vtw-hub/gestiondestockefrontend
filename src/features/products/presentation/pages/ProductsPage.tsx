import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Archive, Package, Search } from 'lucide-react'
import { useProductsList, useProductArchive } from '@/features/products/presentation/hooks/useProductFeature'
import { PageHeader } from '@/shared/presentation/components/PageHeader'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/presentation/components/ui/select'
import { ConfirmDialog } from '@/shared/presentation/components/ConfirmDialog'
import { EmptyState } from '@/shared/presentation/components/EmptyState'
import { ErrorState } from '@/shared/presentation/components/ErrorState'
import { Pagination } from '@/shared/presentation/components/Pagination'
import { SkeletonTable } from '@/shared/presentation/components/ui/skeleton'
import { useDebounce } from '@/shared/presentation/hooks/useDebounce'
import { useToast } from '@/shared/presentation/components/ui/toast'
import { getErrorMessage } from '@/shared/infrastructure/http/problem-details'
import { formatCurrency, formatQuantity } from '@/shared/presentation/formatters'
import { STOCK_STATUS_LABELS, PRODUCT_STATUS_LABELS, type Product } from '@/shared/domain/models'
import { ProductFormDialog } from '../components/ProductFormDialog'

function StockBadge({ status }: { status: Product['stockStatus'] }) {
  const map = {
    IN_STOCK: 'success', LOW_STOCK: 'warning', OUT_OF_STOCK: 'danger',
  } as const
  return <Badge variant={map[status]}>{STOCK_STATUS_LABELS[status]}</Badge>
}

export function ProductsPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE')
  const q = useDebounce(search, 400)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null)

  const filters = {
    q, page, size: 20, sort: 'name,asc',
    stockStatus: stockFilter !== 'ALL' ? stockFilter as Product['stockStatus'] : undefined,
    status: statusFilter !== 'ALL' ? statusFilter as Product['status'] : undefined,
  }

  const { data, isLoading, isError, error, refetch } = useProductsList(filters)
  const archiveMut = useProductArchive()

  const openCreate = () => { setEditTarget(null); setShowForm(true) }
  const openEdit = (p: Product) => { setEditTarget(p); setShowForm(true) }

  const handleArchive = async () => {
    if (!archiveTarget) return
    try {
      await archiveMut.mutateAsync(archiveTarget.id)
      toast(`${archiveTarget.name} a été archivé.`, 'success')
      setArchiveTarget(null)
    } catch (err) {
      toast(getErrorMessage((err as { code?: string }).code ?? 'INTERNAL_ERROR'), 'error')
      setArchiveTarget(null)
    }
  }

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div>
      <PageHeader
        title="Produits"
        description={data ? `${data.totalElements} produit${data.totalElements > 1 ? 's' : ''}` : undefined}
        actions={<Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" aria-hidden />Nouveau produit</Button>}
      />

      <div className="bg-white rounded-lg border border-surface-border shadow-card">
        {/* Filters */}
        <div className="p-4 border-b border-surface-border flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden />
            <Input
              type="search" placeholder="Rechercher (nom, SKU)..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="pl-8 max-w-xs"
            />
          </div>
          <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); setPage(0) }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="État stock" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les états</SelectItem>
              <SelectItem value="IN_STOCK">{STOCK_STATUS_LABELS.IN_STOCK}</SelectItem>
              <SelectItem value="LOW_STOCK">{STOCK_STATUS_LABELS.LOW_STOCK}</SelectItem>
              <SelectItem value="OUT_OF_STOCK">{STOCK_STATUS_LABELS.OUT_OF_STOCK}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous</SelectItem>
              <SelectItem value="ACTIVE">{PRODUCT_STATUS_LABELS.ACTIVE}</SelectItem>
              <SelectItem value="ARCHIVED">{PRODUCT_STATUS_LABELS.ARCHIVED}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <SkeletonTable rows={8} cols={6} />
        ) : data?.content.length === 0 ? (
          <EmptyState icon={<Package className="h-12 w-12" />} title="Aucun produit trouvé" action={{ label: 'Créer un produit', onClick: openCreate }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">SKU</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Catégorie</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Stock</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Prix vente</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">État</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data?.content.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={p.quantityInStock === 0 ? 'text-danger font-semibold' : p.stockStatus === 'LOW_STOCK' ? 'text-warning font-semibold' : 'text-gray-900'}>
                        {formatQuantity(p.quantityInStock, p.unit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(p.salePrice)}</td>
                    <td className="px-4 py-3 text-center"><StockBadge status={p.stockStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" asChild aria-label={`Voir ${p.name}`}>
                          <Link to={`/products/${p.id}`}><Eye className="h-4 w-4" aria-hidden /></Link>
                        </Button>
                        {p.status === 'ACTIVE' && (
                          <>
                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)} aria-label={`Modifier ${p.name}`}>
                              <Pencil className="h-4 w-4" aria-hidden />
                            </Button>
                            {p.quantityInStock === 0 && (
                              <Button variant="ghost" size="icon-sm" onClick={() => setArchiveTarget(p)} className="text-warning" aria-label={`Archiver ${p.name}`}>
                                <Archive className="h-4 w-4" aria-hidden />
                              </Button>
                            )}
                          </>
                        )}
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

      <ProductFormDialog open={showForm} onClose={() => { setShowForm(false); setEditTarget(null) }} product={editTarget} />

      <ConfirmDialog
        open={!!archiveTarget} onOpenChange={(o) => { if (!o) setArchiveTarget(null) }}
        title="Archiver le produit"
        description={`Voulez-vous archiver « ${archiveTarget?.name} » ? Cette action est irréversible tant qu'il y a du stock.`}
        confirmLabel="Archiver" variant="destructive" onConfirm={handleArchive} loading={archiveMut.isPending}
      />
    </div>
  )
}

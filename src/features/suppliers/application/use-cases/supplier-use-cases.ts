import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/application/query-invalidation'
import type { SupplierRepository } from '@/features/suppliers/domain/ports/supplier-repository'
import type { ListQuery, CreateSupplierInput, UpdateSupplierInput } from '@/shared/domain/models'

export function useListSuppliers(repo: SupplierRepository, query: ListQuery) {
  return useQuery({
    queryKey: queryKeys.suppliers.list(query as Record<string, unknown>),
    queryFn: () => repo.listSuppliers(query),
  })
}
export function useGetSupplier(repo: SupplierRepository, id: number) {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => repo.getSupplier(id),
    enabled: id > 0,
  })
}
export function useCreateSupplier(repo: SupplierRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSupplierInput) => repo.createSupplier(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.suppliers.all() }),
  })
}
export function useUpdateSupplier(repo: SupplierRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateSupplierInput }) => repo.updateSupplier(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.suppliers.all() }),
  })
}
export function useDeleteSupplier(repo: SupplierRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => repo.deleteSupplier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.suppliers.all() }),
  })
}

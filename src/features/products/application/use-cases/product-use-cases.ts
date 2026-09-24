import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/application/query-invalidation'
import type { ProductRepository } from '@/features/products/domain/ports/product-repository'
import type { ProductFilters, CreateProductInput, UpdateProductInput } from '@/shared/domain/models'

export function useListProducts(repo: ProductRepository, filters: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters as Record<string, unknown>),
    queryFn: () => repo.listProducts(filters),
  })
}
export function useGetProduct(repo: ProductRepository, id: number) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => repo.getProduct(id),
    enabled: id > 0,
  })
}
export function useCreateProduct(repo: ProductRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => repo.createProduct(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all() })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() })
    },
  })
}
export function useUpdateProduct(repo: ProductRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) =>
      repo.updateProduct(id, input),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all() })
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
    },
  })
}
export function useArchiveProduct(repo: ProductRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => repo.archiveProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all() })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() })
    },
  })
}

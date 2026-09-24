import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/application/query-invalidation'
import type { CategoryRepository } from '@/features/categories/domain/ports/category-repository'
import type { ListQuery, CreateCategoryInput, UpdateCategoryInput } from '@/shared/domain/models'

export function useListCategories(repo: CategoryRepository, query: ListQuery) {
  return useQuery({
    queryKey: queryKeys.categories.list(query as Record<string, unknown>),
    queryFn: () => repo.listCategories(query),
  })
}

export function useGetCategory(repo: CategoryRepository, id: number) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => repo.getCategory(id),
    enabled: id > 0,
  })
}

export function useCreateCategory(repo: CategoryRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => repo.createCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all() }),
  })
}

export function useUpdateCategory(repo: CategoryRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCategoryInput }) =>
      repo.updateCategory(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all() }),
  })
}

export function useDeleteCategory(repo: CategoryRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => repo.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories.all() }),
  })
}

import { createCompositionRoot } from '@/app/composition-root'
import {
  useListCategories, useGetCategory, useCreateCategory,
  useUpdateCategory, useDeleteCategory,
} from '@/features/categories/application/use-cases/category-use-cases'
import type { ListQuery } from '@/shared/domain/models'

const repos = createCompositionRoot()

export function useCategoriesList(query: ListQuery) {
  return useListCategories(repos.categories, query)
}
export function useCategoryDetail(id: number) {
  return useGetCategory(repos.categories, id)
}
export function useCategoryCreate() {
  return useCreateCategory(repos.categories)
}
export function useCategoryUpdate() {
  return useUpdateCategory(repos.categories)
}
export function useCategoryDelete() {
  return useDeleteCategory(repos.categories)
}

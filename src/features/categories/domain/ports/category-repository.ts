import type { Category, Page, ListQuery, CreateCategoryInput, UpdateCategoryInput } from '@/shared/domain/models'

export interface CategoryRepository {
  listCategories(query: ListQuery): Promise<Page<Category>>
  getCategory(id: number): Promise<Category>
  createCategory(input: CreateCategoryInput): Promise<Category>
  updateCategory(id: number, input: UpdateCategoryInput): Promise<Category>
  deleteCategory(id: number): Promise<void>
}

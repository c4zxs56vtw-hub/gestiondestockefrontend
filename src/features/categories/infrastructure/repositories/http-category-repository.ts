import type { ApiClient } from '@/shared/infrastructure/http/api-client'
import type { CategoryRepository } from '@/features/categories/domain/ports/category-repository'
import type { Category, Page, ListQuery, CreateCategoryInput, UpdateCategoryInput } from '@/shared/domain/models'

export class HttpCategoryRepository implements CategoryRepository {
  constructor(private readonly client: ApiClient) {}

  listCategories(query: ListQuery): Promise<Page<Category>> {
    return this.client.get<Page<Category>>('/categories', query as Record<string, unknown>)
  }
  getCategory(id: number): Promise<Category> {
    return this.client.get<Category>(`/categories/${id}`)
  }
  createCategory(input: CreateCategoryInput): Promise<Category> {
    return this.client.post<Category>('/categories', input)
  }
  updateCategory(id: number, input: UpdateCategoryInput): Promise<Category> {
    return this.client.put<Category>(`/categories/${id}`, input)
  }
  deleteCategory(id: number): Promise<void> {
    return this.client.delete(`/categories/${id}`)
  }
}

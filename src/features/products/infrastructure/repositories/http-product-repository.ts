import type { ApiClient } from '@/shared/infrastructure/http/api-client'
import type { ProductRepository } from '@/features/products/domain/ports/product-repository'
import type { Product, Page, ProductFilters, CreateProductInput, UpdateProductInput } from '@/shared/domain/models'

export class HttpProductRepository implements ProductRepository {
  constructor(private readonly client: ApiClient) {}

  listProducts(filters: ProductFilters): Promise<Page<Product>> {
    return this.client.get<Page<Product>>('/products', filters as Record<string, unknown>)
  }
  getProduct(id: number): Promise<Product> {
    return this.client.get<Product>(`/products/${id}`)
  }
  createProduct(input: CreateProductInput): Promise<Product> {
    return this.client.post<Product>('/products', input)
  }
  updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    return this.client.put<Product>(`/products/${id}`, input)
  }
  archiveProduct(id: number): Promise<Product> {
    return this.client.patch<Product>(`/products/${id}/archive`, {})
  }
}

import type { Product, Page, ProductFilters, CreateProductInput, UpdateProductInput } from '@/shared/domain/models'

export interface ProductRepository {
  listProducts(filters: ProductFilters): Promise<Page<Product>>
  getProduct(id: number): Promise<Product>
  createProduct(input: CreateProductInput): Promise<Product>
  updateProduct(id: number, input: UpdateProductInput): Promise<Product>
  archiveProduct(id: number): Promise<Product>
}

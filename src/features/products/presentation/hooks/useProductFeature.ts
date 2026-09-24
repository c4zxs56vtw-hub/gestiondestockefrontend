import { createCompositionRoot } from '@/app/composition-root'
import {
  useListProducts, useGetProduct, useCreateProduct,
  useUpdateProduct, useArchiveProduct,
} from '@/features/products/application/use-cases/product-use-cases'
import type { ProductFilters } from '@/shared/domain/models'

const repos = createCompositionRoot()

export function useProductsList(filters: ProductFilters) { return useListProducts(repos.products, filters) }
export function useProductDetail(id: number) { return useGetProduct(repos.products, id) }
export function useProductCreate() { return useCreateProduct(repos.products) }
export function useProductUpdate() { return useUpdateProduct(repos.products) }
export function useProductArchive() { return useArchiveProduct(repos.products) }

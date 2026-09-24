import { apiClient } from '@/shared/infrastructure/http/api-client'
import { HttpDashboardRepository } from '@/features/dashboard/infrastructure/repositories/http-dashboard-repository'
import { HttpCategoryRepository } from '@/features/categories/infrastructure/repositories/http-category-repository'
import { HttpSupplierRepository } from '@/features/suppliers/infrastructure/repositories/http-supplier-repository'
import { HttpProductRepository } from '@/features/products/infrastructure/repositories/http-product-repository'
import { HttpStockMovementRepository } from '@/features/stock-movements/infrastructure/repositories/http-stock-movement-repository'

export function createCompositionRoot() {
  return {
    dashboard: new HttpDashboardRepository(apiClient),
    categories: new HttpCategoryRepository(apiClient),
    suppliers: new HttpSupplierRepository(apiClient),
    products: new HttpProductRepository(apiClient),
    stockMovements: new HttpStockMovementRepository(apiClient),
  }
}

export type CompositionRoot = ReturnType<typeof createCompositionRoot>

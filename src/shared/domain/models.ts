// ── Enumerations ────────────────────────────────────────────────────────────
export type Unit = 'PIECE' | 'BOX' | 'CARTON'
export const UNIT_LABELS: Record<Unit, string> = { PIECE: 'Pièce', BOX: 'Boîte', CARTON: 'Carton' }

export type ProductStatus = 'ACTIVE' | 'ARCHIVED'
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = { ACTIVE: 'Actif', ARCHIVED: 'Archivé' }

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  IN_STOCK: 'En stock', LOW_STOCK: 'Stock faible', OUT_OF_STOCK: 'Rupture',
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT'
export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  IN: 'Entrée', OUT: 'Sortie', ADJUSTMENT: 'Ajustement',
}

// ── Reference types ──────────────────────────────────────────────────────────
export interface CategoryRef { id: number; name: string }
export interface SupplierRef { id: number; name: string }
export interface ProductRef { id: number; sku: string; name: string; unit: Unit }

// ── Full domain models ────────────────────────────────────────────────────────
export interface Product {
  id: number; sku: string; name: string; description: string | null
  category: CategoryRef; supplier: SupplierRef | null; unit: Unit
  purchasePrice: string; salePrice: string
  quantityInStock: number; minimumStock: number
  status: ProductStatus; stockStatus: StockStatus; stockVersion: number
  createdAt: string; updatedAt: string
}

export interface Category {
  id: number; name: string; description: string | null; createdAt: string; updatedAt: string
}

export interface Supplier {
  id: number; name: string; contactName: string | null
  email: string | null; phone: string | null; address: string | null
  createdAt: string; updatedAt: string
}

export interface StockMovement {
  id: number; product: ProductRef; type: MovementType
  quantityBefore: number; quantityDelta: number; quantityAfter: number
  supplier: SupplierRef | null; reference: string | null; note: string | null
  createdAt: string
}

export interface DashboardData {
  currency: string
  period: { from: string; to: string; timezone: string }
  counts: { activeProducts: number; lowStockProducts: number; outOfStockProducts: number }
  stockValue: string
  movementCounts: { in: number; out: number }
  dailySeries: Array<{ date: string; in: number; out: number; adjustments: number }>
  recentMovements: StockMovement[]
}

// ── Pagination ────────────────────────────────────────────────────────────────
export interface Page<T> {
  content: T[]; page: number; size: number; totalElements: number; totalPages: number
}

// ── Query filters ─────────────────────────────────────────────────────────────
export interface ListQuery { q?: string; page: number; size: number; sort: string; [key: string]: unknown }

export interface ProductFilters extends ListQuery {
  categoryId?: number; supplierId?: number; status?: ProductStatus; stockStatus?: StockStatus
}

export interface MovementFilters extends ListQuery {
  productId?: number; type?: MovementType; from?: string; to?: string
}

// ── Input types (for create/update) ──────────────────────────────────────────
export interface CreateProductInput {
  sku: string; name: string; description: string | null
  categoryId: number; supplierId: number | null; unit: Unit
  purchasePrice: string; salePrice: string; minimumStock: number
}
export type UpdateProductInput = CreateProductInput

export interface CreateCategoryInput { name: string; description: string | null }
export type UpdateCategoryInput = CreateCategoryInput

export interface CreateSupplierInput {
  name: string; contactName: string | null; email: string | null
  phone: string | null; address: string | null
}
export type UpdateSupplierInput = CreateSupplierInput

export interface CreateMovementInput {
  productId: number; type: 'IN' | 'OUT'; quantity: number
  supplierId: number | null; reference: string | null; note: string | null
}

export interface CreateAdjustmentInput {
  productId: number; countedQuantity: number; expectedStockVersion: number; reason: string
}

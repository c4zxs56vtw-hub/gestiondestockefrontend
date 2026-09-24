import type { Product, ProductStatus, StockStatus, Unit } from '../../../../shared/domain/models'

/** Forme reçue du transport HTTP, indépendante du modèle métier frontend. */
export interface ProductResponseDto {
  id: number
  sku: string
  name: string
  description: string | null
  category: { id: number; name: string }
  supplier: { id: number; name: string } | null
  unit: Unit
  purchasePrice: string
  salePrice: string
  quantityInStock: number
  minimumStock: number
  status: ProductStatus
  stockStatus: StockStatus
  stockVersion: number
  createdAt: string
  updatedAt: string
}

export function toProduct(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    description: dto.description,
    category: { id: dto.category.id, name: dto.category.name },
    supplier: dto.supplier ? { id: dto.supplier.id, name: dto.supplier.name } : null,
    unit: dto.unit,
    purchasePrice: dto.purchasePrice,
    salePrice: dto.salePrice,
    quantityInStock: dto.quantityInStock,
    minimumStock: dto.minimumStock,
    status: dto.status,
    stockStatus: dto.stockStatus,
    stockVersion: dto.stockVersion,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

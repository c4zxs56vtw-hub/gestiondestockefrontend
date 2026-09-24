import { describe, it, expect, beforeEach } from 'vitest'
import { mockStore } from '@/mocks/store/mock-store'

describe('MockStore: Products', () => {
  beforeEach(() => mockStore.reset())

  it('returns 30 products', () => {
    expect(mockStore.getProducts()).toHaveLength(30)
  })

  it('creates a product and assigns a new ID', () => {
    const created = mockStore.createProduct({
      sku: 'TEST-001', name: 'Test Product', description: null,
      categoryId: 1, supplierId: null, unit: 'PIECE',
      purchasePrice: '10000', salePrice: '15000', minimumStock: 2,
    })
    expect(created.id).toBeGreaterThan(30)
    expect(created.quantityInStock).toBe(0)
    expect(created.stockStatus).toBe('OUT_OF_STOCK')
  })

  it('throws SKU_ALREADY_EXISTS when creating duplicate SKU', () => {
    expect(() => mockStore.createProduct({
      sku: 'PC-DELL-5520', name: 'Dup', description: null,
      categoryId: 1, supplierId: null, unit: 'PIECE',
      purchasePrice: '10000', salePrice: '15000', minimumStock: 0,
    })).toThrow()
  })
})

describe('MockStore: Stock Movements', () => {
  beforeEach(() => mockStore.reset())

  it('creates an IN movement and updates product stock', () => {
    const product = mockStore.getProducts().find((p) => p.id === 1)!
    const before = product.quantityInStock
    const movement = mockStore.createMovement({ productId: 1, type: 'IN', quantity: 5, supplierId: null, reference: null, note: null })
    expect(movement.quantityDelta).toBe(5)
    expect(movement.quantityAfter).toBe(before + 5)
    expect(mockStore.getProduct(1)!.quantityInStock).toBe(before + 5)
  })

  it('throws INSUFFICIENT_STOCK on OUT movement exceeding stock', () => {
    const product = mockStore.getProducts().find((p) => p.id === 5)! // OUT_OF_STOCK
    expect(() => mockStore.createMovement({ productId: product.id, type: 'OUT', quantity: 999, supplierId: null, reference: null, note: null })).toThrow()
  })
})

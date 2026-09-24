import type {
  Product, Category, Supplier, StockMovement,
  CreateProductInput, UpdateProductInput,
  CreateCategoryInput, UpdateCategoryInput,
  CreateSupplierInput, UpdateSupplierInput,
  CreateMovementInput, CreateAdjustmentInput,
} from '@/shared/domain/models'
import { PRODUCTS_FIXTURE } from '../fixtures/products'
import { CATEGORIES_FIXTURE } from '../fixtures/categories'
import { SUPPLIERS_FIXTURE } from '../fixtures/suppliers'
import { MOVEMENTS_FIXTURE } from '../fixtures/movements'

/**
 * In-memory store for MSW mock mode.
 * This is NOT production-grade storage. It is strictly for frontend development
 * and contract validation against docs/openapi.yaml.
 * Advanced guarantees (atomicity, concurrency, versioning, idempotency persistence)
 * are the responsibility of the Spring Boot backend.
 */
class MockStore {
  private products: Product[]
  private categories: Category[]
  private suppliers: Supplier[]
  private movements: StockMovement[]
  private nextProductId: number
  private nextCategoryId: number
  private nextSupplierId: number
  private nextMovementId: number

  constructor() {
    this.products = structuredClone(PRODUCTS_FIXTURE)
    this.categories = structuredClone(CATEGORIES_FIXTURE)
    this.suppliers = structuredClone(SUPPLIERS_FIXTURE)
    this.movements = structuredClone(MOVEMENTS_FIXTURE)
    this.nextProductId = Math.max(...this.products.map((p) => p.id)) + 1
    this.nextCategoryId = Math.max(...this.categories.map((c) => c.id)) + 1
    this.nextSupplierId = Math.max(...this.suppliers.map((s) => s.id)) + 1
    this.nextMovementId = Math.max(...this.movements.map((m) => m.id)) + 1
  }

  reset() {
    this.products = structuredClone(PRODUCTS_FIXTURE)
    this.categories = structuredClone(CATEGORIES_FIXTURE)
    this.suppliers = structuredClone(SUPPLIERS_FIXTURE)
    this.movements = structuredClone(MOVEMENTS_FIXTURE)
    this.nextProductId = Math.max(...this.products.map((p) => p.id)) + 1
    this.nextCategoryId = Math.max(...this.categories.map((c) => c.id)) + 1
    this.nextSupplierId = Math.max(...this.suppliers.map((s) => s.id)) + 1
    this.nextMovementId = Math.max(...this.movements.map((m) => m.id)) + 1
  }

  // ── Products ────────────────────────────────────────────────────────────────
  getProducts() { return this.products }

  getProduct(id: number) {
    return this.products.find((p) => p.id === id) ?? null
  }

  createProduct(input: CreateProductInput): Product {
    const cat = this.categories.find((c) => c.id === input.categoryId)
    if (!cat) throw Object.assign(new Error('Category not found'), { status: 400, code: 'VALIDATION_ERROR' })
    const sup = input.supplierId ? this.suppliers.find((s) => s.id === input.supplierId) : null
    const skuExists = this.products.some((p) => p.sku === input.sku)
    if (skuExists) throw Object.assign(new Error('SKU exists'), { status: 409, code: 'SKU_ALREADY_EXISTS' })
    const now = new Date().toISOString()
    const product: Product = {
      id: this.nextProductId++,
      sku: input.sku, name: input.name, description: input.description,
      category: { id: cat.id, name: cat.name },
      supplier: sup ? { id: sup.id, name: sup.name } : null,
      unit: input.unit,
      purchasePrice: input.purchasePrice, salePrice: input.salePrice,
      quantityInStock: 0, minimumStock: input.minimumStock,
      status: 'ACTIVE', stockStatus: 'OUT_OF_STOCK', stockVersion: 0,
      createdAt: now, updatedAt: now,
    }
    this.products.push(product)
    return product
  }

  updateProduct(id: number, input: UpdateProductInput): Product {
    const idx = this.products.findIndex((p) => p.id === id)
    if (idx === -1) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    const cat = this.categories.find((c) => c.id === input.categoryId)
    if (!cat) throw Object.assign(new Error('Category not found'), { status: 400, code: 'VALIDATION_ERROR' })
    const sup = input.supplierId ? this.suppliers.find((s) => s.id === input.supplierId) : null
    const skuConflict = this.products.find((p) => p.sku === input.sku && p.id !== id)
    if (skuConflict) throw Object.assign(new Error('SKU exists'), { status: 409, code: 'SKU_ALREADY_EXISTS' })
    const product = this.products[idx]
    const updated: Product = {
      ...product,
      name: input.name, description: input.description,
      category: { id: cat.id, name: cat.name },
      supplier: sup ? { id: sup.id, name: sup.name } : null,
      purchasePrice: input.purchasePrice, salePrice: input.salePrice,
      minimumStock: input.minimumStock,
      updatedAt: new Date().toISOString(),
    }
    this.products[idx] = updated
    return updated
  }

  archiveProduct(id: number): Product {
    const idx = this.products.findIndex((p) => p.id === id)
    if (idx === -1) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    const p = this.products[idx]
    if (p.quantityInStock !== 0) throw Object.assign(new Error('Has stock'), { status: 409, code: 'PRODUCT_HAS_STOCK' })
    const updated = { ...p, status: 'ARCHIVED' as const, updatedAt: new Date().toISOString() }
    this.products[idx] = updated
    return updated
  }

  // ── Categories ──────────────────────────────────────────────────────────────
  getCategories() { return this.categories }

  getCategory(id: number) { return this.categories.find((c) => c.id === id) ?? null }

  createCategory(input: CreateCategoryInput): Category {
    const now = new Date().toISOString()
    const cat: Category = {
      id: this.nextCategoryId++, name: input.name, description: input.description,
      createdAt: now, updatedAt: now,
    }
    this.categories.push(cat)
    return cat
  }

  updateCategory(id: number, input: UpdateCategoryInput): Category {
    const idx = this.categories.findIndex((c) => c.id === id)
    if (idx === -1) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    const updated = { ...this.categories[idx], ...input, updatedAt: new Date().toISOString() }
    this.categories[idx] = updated
    return updated
  }

  deleteCategory(id: number): void {
    const idx = this.categories.findIndex((c) => c.id === id)
    if (idx === -1) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    const inUse = this.products.some((p) => p.category.id === id && p.status === 'ACTIVE')
    if (inUse) throw Object.assign(new Error('In use'), { status: 409, code: 'CATEGORY_IN_USE' })
    this.categories.splice(idx, 1)
  }

  // ── Suppliers ───────────────────────────────────────────────────────────────
  getSuppliers() { return this.suppliers }

  getSupplier(id: number) { return this.suppliers.find((s) => s.id === id) ?? null }

  createSupplier(input: CreateSupplierInput): Supplier {
    const now = new Date().toISOString()
    const sup: Supplier = {
      id: this.nextSupplierId++, ...input, createdAt: now, updatedAt: now,
    }
    this.suppliers.push(sup)
    return sup
  }

  updateSupplier(id: number, input: UpdateSupplierInput): Supplier {
    const idx = this.suppliers.findIndex((s) => s.id === id)
    if (idx === -1) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    const updated = { ...this.suppliers[idx], ...input, updatedAt: new Date().toISOString() }
    this.suppliers[idx] = updated
    return updated
  }

  deleteSupplier(id: number): void {
    const idx = this.suppliers.findIndex((s) => s.id === id)
    if (idx === -1) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    const inUse = this.products.some((p) => p.supplier?.id === id) ||
      this.movements.some((m) => m.supplier?.id === id)
    if (inUse) throw Object.assign(new Error('In use'), { status: 409, code: 'SUPPLIER_IN_USE' })
    this.suppliers.splice(idx, 1)
  }

  // ── Stock Movements ─────────────────────────────────────────────────────────
  getMovements() { return this.movements }

  getMovement(id: number) { return this.movements.find((m) => m.id === id) ?? null }

  createMovement(input: CreateMovementInput): StockMovement {
    const product = this.getProduct(input.productId)
    if (!product) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    if (product.status === 'ARCHIVED') throw Object.assign(new Error('Archived'), { status: 409, code: 'PRODUCT_ARCHIVED' })
    if (input.type === 'OUT' && product.quantityInStock < input.quantity)
      throw Object.assign(new Error('Insufficient stock'), { status: 409, code: 'INSUFFICIENT_STOCK' })

    const before = product.quantityInStock
    const delta = input.type === 'IN' ? input.quantity : -input.quantity
    const after = before + delta
    const sup = input.supplierId ? this.suppliers.find((s) => s.id === input.supplierId) : null
    const now = new Date().toISOString()

    // Update product stock
    const pidx = this.products.findIndex((p) => p.id === input.productId)
    const updated = {
      ...product,
      quantityInStock: after,
      stockVersion: product.stockVersion + 1,
      stockStatus: after === 0 ? 'OUT_OF_STOCK' : after <= product.minimumStock ? 'LOW_STOCK' : 'IN_STOCK',
      updatedAt: now,
    } as Product
    this.products[pidx] = updated

    const movement: StockMovement = {
      id: this.nextMovementId++,
      product: { id: product.id, sku: product.sku, name: product.name, unit: product.unit },
      type: input.type, quantityBefore: before, quantityDelta: delta, quantityAfter: after,
      supplier: sup ? { id: sup.id, name: sup.name } : null,
      reference: input.reference, note: input.note, createdAt: now,
    }
    this.movements.unshift(movement)
    return movement
  }

  createAdjustment(input: CreateAdjustmentInput): StockMovement {
    const product = this.getProduct(input.productId)
    if (!product) throw Object.assign(new Error('Not found'), { status: 404, code: 'RESOURCE_NOT_FOUND' })
    if (product.status === 'ARCHIVED') throw Object.assign(new Error('Archived'), { status: 409, code: 'PRODUCT_ARCHIVED' })
    if (product.stockVersion !== input.expectedStockVersion)
      throw Object.assign(new Error('Version conflict'), { status: 409, code: 'STOCK_VERSION_CONFLICT' })
    const before = product.quantityInStock
    const delta = input.countedQuantity - before
    if (delta === 0) throw Object.assign(new Error('No change'), { status: 409, code: 'NO_STOCK_CHANGE' })

    const after = input.countedQuantity
    const now = new Date().toISOString()
    const pidx = this.products.findIndex((p) => p.id === input.productId)
    const updated = {
      ...product,
      quantityInStock: after,
      stockVersion: product.stockVersion + 1,
      stockStatus: after === 0 ? 'OUT_OF_STOCK' : after <= product.minimumStock ? 'LOW_STOCK' : 'IN_STOCK',
      updatedAt: now,
    } as Product
    this.products[pidx] = updated

    const movement: StockMovement = {
      id: this.nextMovementId++,
      product: { id: product.id, sku: product.sku, name: product.name, unit: product.unit },
      type: 'ADJUSTMENT', quantityBefore: before, quantityDelta: delta, quantityAfter: after,
      supplier: null, reference: null, note: input.reason, createdAt: now,
    }
    this.movements.unshift(movement)
    return movement
  }
}

export const mockStore = new MockStore()

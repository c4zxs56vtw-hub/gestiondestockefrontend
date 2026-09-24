import type { Supplier, Page, ListQuery, CreateSupplierInput, UpdateSupplierInput } from '@/shared/domain/models'

export interface SupplierRepository {
  listSuppliers(query: ListQuery): Promise<Page<Supplier>>
  getSupplier(id: number): Promise<Supplier>
  createSupplier(input: CreateSupplierInput): Promise<Supplier>
  updateSupplier(id: number, input: UpdateSupplierInput): Promise<Supplier>
  deleteSupplier(id: number): Promise<void>
}

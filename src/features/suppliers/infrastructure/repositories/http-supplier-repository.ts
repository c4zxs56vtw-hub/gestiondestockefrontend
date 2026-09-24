import type { ApiClient } from '@/shared/infrastructure/http/api-client'
import type { SupplierRepository } from '@/features/suppliers/domain/ports/supplier-repository'
import type { Supplier, Page, ListQuery, CreateSupplierInput, UpdateSupplierInput } from '@/shared/domain/models'

export class HttpSupplierRepository implements SupplierRepository {
  constructor(private readonly client: ApiClient) {}

  listSuppliers(q: ListQuery): Promise<Page<Supplier>> {
    return this.client.get<Page<Supplier>>('/suppliers', q as Record<string, unknown>)
  }
  getSupplier(id: number): Promise<Supplier> {
    return this.client.get<Supplier>(`/suppliers/${id}`)
  }
  createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    return this.client.post<Supplier>('/suppliers', input)
  }
  updateSupplier(id: number, input: UpdateSupplierInput): Promise<Supplier> {
    return this.client.put<Supplier>(`/suppliers/${id}`, input)
  }
  deleteSupplier(id: number): Promise<void> {
    return this.client.delete(`/suppliers/${id}`)
  }
}

import { createCompositionRoot } from '@/app/composition-root'
import {
  useListSuppliers, useGetSupplier, useCreateSupplier,
  useUpdateSupplier, useDeleteSupplier,
} from '@/features/suppliers/application/use-cases/supplier-use-cases'
import type { ListQuery } from '@/shared/domain/models'

const repos = createCompositionRoot()

export function useSuppliersList(query: ListQuery) { return useListSuppliers(repos.suppliers, query) }
export function useSupplierDetail(id: number) { return useGetSupplier(repos.suppliers, id) }
export function useSupplierCreate() { return useCreateSupplier(repos.suppliers) }
export function useSupplierUpdate() { return useUpdateSupplier(repos.suppliers) }
export function useSupplierDelete() { return useDeleteSupplier(repos.suppliers) }

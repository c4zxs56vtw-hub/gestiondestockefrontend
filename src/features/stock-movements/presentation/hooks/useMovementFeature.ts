import { createCompositionRoot } from '@/app/composition-root'
import {
  useListMovements, useGetMovement, useCreateMovement,
} from '@/features/stock-movements/application/use-cases/stock-movement-use-cases'
import type { MovementFilters } from '@/shared/domain/models'

const repos = createCompositionRoot()

export function useMovementsList(filters: MovementFilters) { return useListMovements(repos.stockMovements, filters) }
export function useMovementDetail(id: number) { return useGetMovement(repos.stockMovements, id) }
export function useMovementCreate() { return useCreateMovement(repos.stockMovements) }

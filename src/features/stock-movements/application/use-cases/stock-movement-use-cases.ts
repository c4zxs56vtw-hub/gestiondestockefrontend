import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/application/query-invalidation'
import type { StockMovementRepository } from '@/features/stock-movements/domain/ports/stock-movement-repository'
import type { MovementFilters, CreateMovementInput } from '@/shared/domain/models'

export function useListMovements(repo: StockMovementRepository, filters: MovementFilters) {
  return useQuery({
    queryKey: queryKeys.stockMovements.list(filters as Record<string, unknown>),
    queryFn: () => repo.listMovements(filters),
  })
}
export function useGetMovement(repo: StockMovementRepository, id: number) {
  return useQuery({
    queryKey: queryKeys.stockMovements.detail(id),
    queryFn: () => repo.getMovement(id),
    enabled: id > 0,
  })
}
export function useCreateMovement(repo: StockMovementRepository) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMovementInput) => repo.createMovement(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockMovements.all() })
      qc.invalidateQueries({ queryKey: queryKeys.products.all() })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() })
    },
  })
}

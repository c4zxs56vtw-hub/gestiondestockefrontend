import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/application/query-invalidation'
import type { StockMovement, CreateAdjustmentInput } from '@/shared/domain/models'
import { generateIdempotencyKey } from '@/shared/infrastructure/http/idempotency'
import { apiClient } from '@/shared/infrastructure/http/api-client'

export function useCreateAdjustment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAdjustmentInput): Promise<StockMovement> => {
      return apiClient.post<StockMovement>('/inventory/adjustments', input, generateIdempotencyKey())
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockMovements.all() })
      qc.invalidateQueries({ queryKey: queryKeys.products.all() })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() })
    },
  })
}

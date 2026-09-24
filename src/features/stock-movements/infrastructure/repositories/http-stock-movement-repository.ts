import type { ApiClient } from '@/shared/infrastructure/http/api-client'
import type { StockMovementRepository } from '@/features/stock-movements/domain/ports/stock-movement-repository'
import type { StockMovement, Page, MovementFilters, CreateMovementInput } from '@/shared/domain/models'
import { generateIdempotencyKey } from '@/shared/infrastructure/http/idempotency'

export class HttpStockMovementRepository implements StockMovementRepository {
  constructor(private readonly client: ApiClient) {}

  listMovements(filters: MovementFilters): Promise<Page<StockMovement>> {
    return this.client.get<Page<StockMovement>>('/stock-movements', filters as Record<string, unknown>)
  }
  getMovement(id: number): Promise<StockMovement> {
    return this.client.get<StockMovement>(`/stock-movements/${id}`)
  }
  createMovement(input: CreateMovementInput): Promise<StockMovement> {
    return this.client.post<StockMovement>('/stock-movements', input, generateIdempotencyKey())
  }
}

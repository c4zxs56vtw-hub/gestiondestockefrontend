import type { StockMovement, Page, MovementFilters, CreateMovementInput } from '@/shared/domain/models'

export interface StockMovementRepository {
  listMovements(filters: MovementFilters): Promise<Page<StockMovement>>
  getMovement(id: number): Promise<StockMovement>
  createMovement(input: CreateMovementInput): Promise<StockMovement>
}

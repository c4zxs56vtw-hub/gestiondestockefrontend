import type { DashboardData } from '@/shared/domain/models'

export interface DashboardRepository {
  getDashboard(params?: { from?: string; to?: string }): Promise<DashboardData>
}

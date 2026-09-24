import type { ApiClient } from '@/shared/infrastructure/http/api-client'
import type { DashboardRepository } from '@/features/dashboard/domain/ports/dashboard-repository'
import type { DashboardData } from '@/shared/domain/models'

export class HttpDashboardRepository implements DashboardRepository {
  constructor(private readonly client: ApiClient) {}

  async getDashboard(params?: { from?: string; to?: string }): Promise<DashboardData> {
    return this.client.get<DashboardData>('/dashboard', params as Record<string, unknown>)
  }
}

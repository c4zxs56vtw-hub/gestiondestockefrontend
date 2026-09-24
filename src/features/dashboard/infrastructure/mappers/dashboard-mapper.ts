import type { DashboardData } from '@/shared/domain/models'

// Dashboard is returned as-is from the API; no mapping needed beyond type assertion.
export function mapDashboard(dto: unknown): DashboardData {
  return dto as DashboardData
}

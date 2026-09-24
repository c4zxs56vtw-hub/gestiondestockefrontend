import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/application/query-invalidation'
import type { DashboardRepository } from '@/features/dashboard/domain/ports/dashboard-repository'

export function useGetDashboard(repo: DashboardRepository, params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: queryKeys.dashboard(params),
    queryFn: () => repo.getDashboard(params),
    staleTime: 60_000,
  })
}

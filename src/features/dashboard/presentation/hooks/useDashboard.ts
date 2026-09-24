import { useMemo } from 'react'
import { createCompositionRoot } from '@/app/composition-root'
import { useGetDashboard } from '@/features/dashboard/application/use-cases/useGetDashboard'

const repos = createCompositionRoot()

export function useDashboard(params?: { from?: string; to?: string }) {
  const query = useGetDashboard(repos.dashboard, params)
  return { data: query.data, isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch }
}

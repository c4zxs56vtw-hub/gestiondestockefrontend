export const queryKeys = {
  dashboard: (params?: { from?: string; to?: string }) => ['dashboard', params ?? {}] as const,
  products: {
    all: () => ['products'] as const,
    lists: () => ['products', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['products', 'list', filters] as const,
    details: () => ['products', 'detail'] as const,
    detail: (id: number) => ['products', 'detail', id] as const,
  },
  categories: {
    all: () => ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['categories', 'list', filters] as const,
    details: () => ['categories', 'detail'] as const,
    detail: (id: number) => ['categories', 'detail', id] as const,
  },
  suppliers: {
    all: () => ['suppliers'] as const,
    lists: () => ['suppliers', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['suppliers', 'list', filters] as const,
    details: () => ['suppliers', 'detail'] as const,
    detail: (id: number) => ['suppliers', 'detail', id] as const,
  },
  stockMovements: {
    all: () => ['stock-movements'] as const,
    lists: () => ['stock-movements', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['stock-movements', 'list', filters] as const,
    details: () => ['stock-movements', 'detail'] as const,
    detail: (id: number) => ['stock-movements', 'detail', id] as const,
  },
} as const

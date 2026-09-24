import { http, HttpResponse } from 'msw'
import { mockStore } from '../store/mock-store'

const BASE = '/api/v1'

function buildDailySeriesForLastNDays(n: number) {
  const movements = mockStore.getMovements()
  const series: Record<string, { in: number; out: number; adjustments: number }> = {}
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    const key = d.toISOString().substring(0, 10)
    series[key] = { in: 0, out: 0, adjustments: 0 }
  }
  for (const m of movements) {
    const key = m.createdAt.substring(0, 10)
    if (key in series) {
      if (m.type === 'IN') series[key].in += Math.abs(m.quantityDelta)
      else if (m.type === 'OUT') series[key].out += Math.abs(m.quantityDelta)
      else series[key].adjustments += Math.abs(m.quantityDelta)
    }
  }
  return Object.entries(series).map(([date, v]) => ({ date, ...v }))
}

export const dashboardHandlers = [
  http.get(`${BASE}/dashboard`, () => {
    const products = mockStore.getProducts()
    const activeProducts = products.filter((p) => p.status === 'ACTIVE')
    const lowStock = activeProducts.filter((p) => p.stockStatus === 'LOW_STOCK')
    const outOfStock = activeProducts.filter((p) => p.stockStatus === 'OUT_OF_STOCK')
    const movements = mockStore.getMovements()

    const stockValue = activeProducts.reduce((sum, p) => {
      return sum + parseInt(p.purchasePrice, 10) * p.quantityInStock
    }, 0)

    const now = new Date()
    const from = new Date(now)
    from.setUTCDate(from.getUTCDate() - 30)

    return HttpResponse.json({
      currency: 'XAF',
      period: { from: from.toISOString(), to: now.toISOString(), timezone: 'Africa/Douala' },
      counts: {
        activeProducts: activeProducts.length,
        lowStockProducts: lowStock.length,
        outOfStockProducts: outOfStock.length,
      },
      stockValue: String(stockValue),
      movementCounts: {
        in: movements.filter((m) => m.type === 'IN').length,
        out: movements.filter((m) => m.type === 'OUT').length,
      },
      dailySeries: buildDailySeriesForLastNDays(30),
      recentMovements: movements.slice(0, 8),
    })
  }),
]

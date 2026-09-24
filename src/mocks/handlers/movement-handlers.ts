import { http, HttpResponse } from 'msw'
import { mockStore } from '../store/mock-store'
import { paginateItems, fromError, problemDetails } from './helpers'

const BASE = '/api/v1'

export const movementHandlers = [
  http.get(`${BASE}/stock-movements`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '0', 10)
    const size = parseInt(url.searchParams.get('size') ?? '20', 10)
    const sort = url.searchParams.get('sort') ?? 'createdAt,desc'
    const productId = url.searchParams.get('productId')
    const type = url.searchParams.get('type')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    let movements = mockStore.getMovements()
    if (productId) movements = movements.filter((m) => m.product.id === parseInt(productId, 10))
    if (type) movements = movements.filter((m) => m.type === type)
    if (from) movements = movements.filter((m) => m.createdAt >= from)
    if (to) movements = movements.filter((m) => m.createdAt <= to)

    // Sort by date (descending by default for movements)
    movements = [...movements].sort((a, b) => {
      const cmp = a.createdAt.localeCompare(b.createdAt)
      return sort.includes('desc') ? -cmp : cmp
    })

    return HttpResponse.json(paginateItems(movements, page, size, sort))
  }),

  http.get(`${BASE}/stock-movements/:id`, ({ params }) => {
    const movement = mockStore.getMovement(Number(params.id))
    if (!movement) return problemDetails(404, 'RESOURCE_NOT_FOUND', 'Mouvement introuvable.')
    return HttpResponse.json(movement)
  }),

  http.post(`${BASE}/stock-movements`, async ({ request }) => {
    try {
      const body = await request.json()
      const movement = mockStore.createMovement(body as never)
      return HttpResponse.json(movement, { status: 201 })
    } catch (err) { return fromError(err) }
  }),

  // Inventory adjustment endpoint
  http.post(`${BASE}/inventory/adjustments`, async ({ request }) => {
    try {
      const body = await request.json()
      const movement = mockStore.createAdjustment(body as never)
      return HttpResponse.json(movement, { status: 201 })
    } catch (err) { return fromError(err) }
  }),
]

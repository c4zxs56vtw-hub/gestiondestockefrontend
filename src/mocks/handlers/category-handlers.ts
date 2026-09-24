import { http, HttpResponse } from 'msw'
import { mockStore } from '../store/mock-store'
import { paginateItems, fromError, problemDetails } from './helpers'

const BASE = '/api/v1'

export const categoryHandlers = [
  http.get(`${BASE}/categories`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '0', 10)
    const size = parseInt(url.searchParams.get('size') ?? '20', 10)
    const sort = url.searchParams.get('sort') ?? 'name,asc'
    const q = url.searchParams.get('q')?.toLowerCase()
    let categories = mockStore.getCategories()
    if (q) categories = categories.filter((c) => c.name.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q) ?? false))
    return HttpResponse.json(paginateItems(categories, page, size, sort, (c) => c.name))
  }),

  http.get(`${BASE}/categories/:id`, ({ params }) => {
    const cat = mockStore.getCategory(Number(params.id))
    if (!cat) return problemDetails(404, 'RESOURCE_NOT_FOUND', 'Catégorie introuvable.')
    return HttpResponse.json(cat)
  }),

  http.post(`${BASE}/categories`, async ({ request }) => {
    try {
      const body = await request.json()
      const cat = mockStore.createCategory(body as never)
      return HttpResponse.json(cat, { status: 201 })
    } catch (err) { return fromError(err) }
  }),

  http.put(`${BASE}/categories/:id`, async ({ params, request }) => {
    try {
      const body = await request.json()
      const cat = mockStore.updateCategory(Number(params.id), body as never)
      return HttpResponse.json(cat)
    } catch (err) { return fromError(err) }
  }),

  http.delete(`${BASE}/categories/:id`, ({ params }) => {
    try {
      mockStore.deleteCategory(Number(params.id))
      return new HttpResponse(null, { status: 204 })
    } catch (err) { return fromError(err) }
  }),
]

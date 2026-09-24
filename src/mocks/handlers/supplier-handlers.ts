import { http, HttpResponse } from 'msw'
import { mockStore } from '../store/mock-store'
import { paginateItems, fromError, problemDetails } from './helpers'

const BASE = '/api/v1'

export const supplierHandlers = [
  http.get(`${BASE}/suppliers`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '0', 10)
    const size = parseInt(url.searchParams.get('size') ?? '20', 10)
    const sort = url.searchParams.get('sort') ?? 'name,asc'
    const q = url.searchParams.get('q')?.toLowerCase()
    let suppliers = mockStore.getSuppliers()
    if (q) suppliers = suppliers.filter((s) => s.name.toLowerCase().includes(q) || (s.contactName?.toLowerCase().includes(q) ?? false) || (s.email?.toLowerCase().includes(q) ?? false))
    return HttpResponse.json(paginateItems(suppliers, page, size, sort, (s) => s.name))
  }),

  http.get(`${BASE}/suppliers/:id`, ({ params }) => {
    const sup = mockStore.getSupplier(Number(params.id))
    if (!sup) return problemDetails(404, 'RESOURCE_NOT_FOUND', 'Fournisseur introuvable.')
    return HttpResponse.json(sup)
  }),

  http.post(`${BASE}/suppliers`, async ({ request }) => {
    try {
      const body = await request.json()
      const sup = mockStore.createSupplier(body as never)
      return HttpResponse.json(sup, { status: 201 })
    } catch (err) { return fromError(err) }
  }),

  http.put(`${BASE}/suppliers/:id`, async ({ params, request }) => {
    try {
      const body = await request.json()
      const sup = mockStore.updateSupplier(Number(params.id), body as never)
      return HttpResponse.json(sup)
    } catch (err) { return fromError(err) }
  }),

  http.delete(`${BASE}/suppliers/:id`, ({ params }) => {
    try {
      mockStore.deleteSupplier(Number(params.id))
      return new HttpResponse(null, { status: 204 })
    } catch (err) { return fromError(err) }
  }),
]

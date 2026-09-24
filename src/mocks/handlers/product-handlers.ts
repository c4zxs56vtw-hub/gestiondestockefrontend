import { http, HttpResponse } from 'msw'
import { mockStore } from '../store/mock-store'
import { paginateItems, fromError, problemDetails } from './helpers'

const BASE = '/api/v1'

export const productHandlers = [
  http.get(`${BASE}/products`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '0', 10)
    const size = parseInt(url.searchParams.get('size') ?? '20', 10)
    const sort = url.searchParams.get('sort') ?? 'name,asc'
    const q = url.searchParams.get('q')?.toLowerCase()
    const categoryId = url.searchParams.get('categoryId')
    const supplierId = url.searchParams.get('supplierId')
    const status = url.searchParams.get('status')
    const stockStatus = url.searchParams.get('stockStatus')

    let products = mockStore.getProducts()
    if (q) products = products.filter((p) =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false)
    )
    if (categoryId) products = products.filter((p) => p.category.id === parseInt(categoryId, 10))
    if (supplierId) products = products.filter((p) => p.supplier?.id === parseInt(supplierId, 10))
    if (status) products = products.filter((p) => p.status === status)
    if (stockStatus) products = products.filter((p) => p.stockStatus === stockStatus)

    return HttpResponse.json(paginateItems(products, page, size, sort, (p) => p.name))
  }),

  http.get(`${BASE}/products/:id`, ({ params }) => {
    const product = mockStore.getProduct(Number(params.id))
    if (!product) return problemDetails(404, 'RESOURCE_NOT_FOUND', 'Produit introuvable.')
    return HttpResponse.json(product)
  }),

  http.post(`${BASE}/products`, async ({ request }) => {
    try {
      const body = await request.json()
      const product = mockStore.createProduct(body as never)
      return HttpResponse.json(product, { status: 201 })
    } catch (err) { return fromError(err) }
  }),

  http.put(`${BASE}/products/:id`, async ({ params, request }) => {
    try {
      const body = await request.json()
      const product = mockStore.updateProduct(Number(params.id), body as never)
      return HttpResponse.json(product)
    } catch (err) { return fromError(err) }
  }),

  http.patch(`${BASE}/products/:id/archive`, ({ params }) => {
    try {
      const product = mockStore.archiveProduct(Number(params.id))
      return HttpResponse.json(product)
    } catch (err) { return fromError(err) }
  }),
]

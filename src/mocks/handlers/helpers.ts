import { HttpResponse } from 'msw'
import type { Page } from '@/shared/domain/models'

export function paginateItems<T>(
  items: T[],
  page: number,
  size: number,
  sort: string,
  sortKey?: (item: T) => string | number,
): Page<T> {
  let sorted = [...items]
  if (sortKey) {
    const [field, dir] = sort.split(',')
    sorted = sorted.sort((a, b) => {
      const va = String(sortKey(a) ?? '')
      const vb = String(sortKey(b) ?? '')
      const cmp = va.localeCompare(vb, 'fr-FR')
      return dir === 'desc' ? -cmp : cmp
    })
    // Use field for more specific sorting if needed
    void field
  }
  const totalElements = sorted.length
  const totalPages = Math.ceil(totalElements / size) || 1
  const safePage = Math.max(0, Math.min(page, totalPages - 1))
  const content = sorted.slice(safePage * size, (safePage + 1) * size)
  return { content, page: safePage, size, totalElements, totalPages }
}

export function problemDetails(status: number, code: string, detail: string, fieldErrors: { field: string; message: string }[] = []) {
  return HttpResponse.json(
    {
      type: `urn:stockpilot:error:${code.toLowerCase().replace(/_/g, '-')}`,
      title: code.replace(/_/g, ' '),
      status, detail, instance: '/api/v1/error', code, fieldErrors,
    },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  )
}

export function fromError(err: unknown) {
  if (err && typeof err === 'object' && 'status' in err && 'code' in err) {
    const e = err as { status: number; code: string; message: string }
    return problemDetails(e.status, e.code, e.message)
  }
  return problemDetails(500, 'INTERNAL_ERROR', 'Une erreur inattendue s\x27est produite.')
}

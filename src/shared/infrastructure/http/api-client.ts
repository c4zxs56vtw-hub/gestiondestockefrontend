import { readResponse } from './read-response'
import { normalizeHttpError } from './normalize-http-error'

const TIMEOUT_MS = 15_000

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'
  const url = new URL(`${base}${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

async function request<T>(
  method: string, path: string,
  opts: { params?: Record<string, unknown>; body?: unknown; idempotencyKey?: string; signal?: AbortSignal } = {},
): Promise<T> {
  const { params, body, idempotencyKey, signal } = opts
  const headers: Record<string, string> = { Accept: 'application/json, application/problem+json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(new Error('Request timeout')), TIMEOUT_MS)

  let finalSignal: AbortSignal = controller.signal
  if (signal && typeof AbortSignal.any === 'function') {
    try { finalSignal = AbortSignal.any([controller.signal, signal]) } catch { /* use controller */ }
  }

  try {
    const res = await fetch(buildUrl(path, params), {
      method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, signal: finalSignal,
    })
    clearTimeout(tid)
    return await readResponse<T>(res)
  } catch (err) {
    clearTimeout(tid)
    throw normalizeHttpError(err)
  }
}

export const apiClient = {
  get<T>(path: string, params?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
    return request<T>('GET', path, { params, signal })
  },
  post<T>(path: string, body: unknown, idempotencyKey?: string): Promise<T> {
    return request<T>('POST', path, { body, idempotencyKey })
  },
  put<T>(path: string, body: unknown): Promise<T> { return request<T>('PUT', path, { body }) },
  patch<T>(path: string, body: unknown): Promise<T> { return request<T>('PATCH', path, { body }) },
  delete(path: string): Promise<void> { return request<void>('DELETE', path) },
}

export type ApiClient = typeof apiClient

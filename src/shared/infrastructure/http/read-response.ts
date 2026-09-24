import { createAppError } from './problem-details'

export async function readResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as unknown as T
  const ct = response.headers.get('content-type') ?? ''
  if (!response.ok) {
    let body: unknown = null
    if (ct.includes('json')) { try { body = await response.json() } catch { /* ignore */ } }
    throw createAppError(response.status, body)
  }
  if (!ct.includes('application/json')) return undefined as unknown as T
  try { return (await response.json()) as T }
  catch { throw createAppError(response.status, null, 'INTERNAL_ERROR', 'La réponse du serveur est invalide.') }
}

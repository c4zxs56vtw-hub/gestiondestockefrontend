import { AppError, createAppError } from './problem-details'

export function normalizeHttpError(err: unknown): AppError {
  if (err instanceof AppError) return err
  if (err instanceof DOMException && err.name === 'AbortError')
    return createAppError(0, null, 'REQUEST_ABORTED', 'La requête a été annulée.')
  if (err instanceof TypeError && (
    err.message.includes('fetch') || err.message.includes('Failed to fetch') ||
    err.message.includes('Load failed') || err.message.includes('NetworkError')
  )) return createAppError(0, null, 'NETWORK_ERROR',
    'Impossible de contacter le serveur. Vérifiez votre connexion réseau et que le backend est démarré sur le port 8080.')
  if (err instanceof Error && err.message === 'Request timeout')
    return createAppError(0, null, 'TIMEOUT', 'La requête a expiré. Veuillez réessayer.')
  console.error('[StockPilot] Erreur HTTP non normalisée :', err)
  return createAppError(500, null, 'INTERNAL_ERROR', "Une erreur inattendue s'est produite.")
}

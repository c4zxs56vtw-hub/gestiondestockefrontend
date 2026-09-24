export interface FieldError { field: string; message: string }

export interface ProblemDetails {
  type: string; title: string; status: number; detail: string
  instance: string; code: string; fieldErrors: FieldError[]
}

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly detail: string,
    public readonly fieldErrors: FieldError[] = [],
    public readonly problemDetails?: ProblemDetails,
  ) {
    super(detail)
    this.name = 'AppError'
  }
}

export function isProblemDetails(v: unknown): v is ProblemDetails {
  return typeof v === 'object' && v !== null && 'code' in v && 'status' in v &&
    typeof (v as Record<string, unknown>).code === 'string'
}

const CODES: Record<number, string> = {
  400: 'VALIDATION_ERROR', 404: 'RESOURCE_NOT_FOUND', 409: 'CONFLICT',
  500: 'INTERNAL_ERROR', 0: 'NETWORK_ERROR',
}
const DETAILS: Record<number, string> = {
  400: 'La requête est invalide.',
  404: 'La ressource demandée est introuvable.',
  409: 'Un conflit a été détecté.',
  500: "Une erreur serveur inattendue s'est produite.",
  0: 'Impossible de contacter le serveur.',
}

export function createAppError(status: number, body: unknown, code?: string, detail?: string): AppError {
  if (isProblemDetails(body)) {
    return new AppError(body.status, body.code, body.detail, body.fieldErrors ?? [], body)
  }
  return new AppError(
    status,
    code ?? CODES[status] ?? 'INTERNAL_ERROR',
    detail ?? DETAILS[status] ?? "Une erreur s'est produite.",
    [],
  )
}

export const ERROR_MESSAGES: Record<string, string> = {
  SKU_ALREADY_EXISTS: 'Ce SKU est déjà utilisé par un autre produit.',
  INSUFFICIENT_STOCK: 'Stock insuffisant pour effectuer cette sortie.',
  PRODUCT_ARCHIVED: 'Opération impossible sur un produit archivé.',
  PRODUCT_HAS_STOCK: "L'archivage est impossible : le stock n'est pas à zéro.",
  PRODUCT_IDENTITY_LOCKED: "Le SKU et l'unité ne peuvent plus être modifiés après le premier mouvement.",
  CATEGORY_IN_USE: 'Cette catégorie est utilisée par des produits et ne peut pas être supprimée.',
  SUPPLIER_IN_USE: 'Ce fournisseur est utilisé par des produits ou des mouvements.',
  STOCK_VERSION_CONFLICT: 'Le stock a été modifié depuis votre consultation. Rechargez et recommencez.',
  NO_STOCK_CHANGE: "La quantité comptée est identique au stock actuel. Aucun ajustement n'est nécessaire.",
  IDEMPOTENCY_KEY_REUSED: "Cette clé d'idempotence a déjà été utilisée avec des données différentes.",
  RESOURCE_NOT_FOUND: 'La ressource demandée est introuvable.',
  VALIDATION_ERROR: 'Certains champs sont invalides. Vérifiez le formulaire.',
  INTERNAL_ERROR: "Une erreur inattendue s'est produite côté serveur.",
  NETWORK_ERROR: 'Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 8080.',
  TIMEOUT: 'La requête a expiré. Veuillez réessayer.',
}

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? "Une erreur inattendue s'est produite."
}

import type { PageDto } from '../../src/shared/infrastructure/api/pagination-dto'
import type { ProblemDetails } from '../../src/shared/infrastructure/http/problem-details'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function assertPaginatedResponse<T>(value: unknown): asserts value is PageDto<T> {
  if (
    !isRecord(value) ||
    !Array.isArray(value.content) ||
    typeof value.page !== 'number' || !Number.isInteger(value.page) ||
    typeof value.size !== 'number' || !Number.isInteger(value.size) ||
    typeof value.totalElements !== 'number' || !Number.isInteger(value.totalElements) ||
    typeof value.totalPages !== 'number' || !Number.isInteger(value.totalPages)
  ) {
    throw new Error('INVALID_RESPONSE: pagination DTO invalide')
  }
  if (value.page < 0 || value.size < 1 || value.size > 100 || value.totalElements < 0 || value.totalPages < 0) {
    throw new Error('INVALID_RESPONSE: contraintes de pagination invalides')
  }
}

export function assertProblemDetails(value: unknown): asserts value is ProblemDetails {
  if (!isRecord(value) || typeof value.type !== 'string' || typeof value.title !== 'string' || typeof value.status !== 'number' || typeof value.detail !== 'string' || typeof value.instance !== 'string' || typeof value.code !== 'string' || !Array.isArray(value.fieldErrors)) {
    throw new Error('INVALID_RESPONSE: Problem Details invalide')
  }
  if (value.fieldErrors.some(error => !isRecord(error) || typeof error.field !== 'string' || typeof error.message !== 'string')) {
    throw new Error('INVALID_RESPONSE: fieldErrors invalide')
  }
}

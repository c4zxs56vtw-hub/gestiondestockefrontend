import { describe, expect, it } from 'vitest'
import { assertPaginatedResponse, assertProblemDetails } from './runtime-schema-guards'
import { normalizeHttpError } from '../../src/shared/infrastructure/http/normalize-http-error'

describe('runtime schema guards', () => {
  it('accepts an empty paginated response', () => {
    expect(() => assertPaginatedResponse({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 })).not.toThrow()
  })

  it('rejects an invalid paginated response', () => {
    expect(() => assertPaginatedResponse({ content: [], page: -1 })).toThrow('INVALID_RESPONSE')
  })

  it('accepts Problem Details with field errors', () => {
    expect(() => assertProblemDetails({ type: 'urn:test', title: 'Invalid', status: 400, detail: 'Invalid', instance: '/products', code: 'VALIDATION_ERROR', fieldErrors: [{ field: 'name', message: 'Required' }] })).not.toThrow()
  })

  it('keeps an empty collection valid', () => {
    expect(() => assertPaginatedResponse({ content: [], page: 2, size: 20, totalElements: 0, totalPages: 0 })).not.toThrow()
  })

  it('normalizes a network error without a response', () => {
    const error = new TypeError('Failed to fetch')
    expect(normalizeHttpError(error)).toMatchObject({ code: 'NETWORK_ERROR' })
  })

  it('normalizes a non-json HTTP error', () => {
    const error = new Error('Request timeout')
    expect(normalizeHttpError(error)).toMatchObject({ code: 'TIMEOUT' })
  })
})

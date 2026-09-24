import { describe, it, expect } from 'vitest'
import { UNIT_LABELS, STOCK_STATUS_LABELS, MOVEMENT_TYPE_LABELS } from '@/shared/domain/models'
import { formatCurrency, formatQuantity, formatDelta } from '@/shared/presentation/formatters'

describe('Domain: enumerations', () => {
  it('has labels for all Unit values', () => {
    expect(Object.keys(UNIT_LABELS)).toEqual(['PIECE', 'BOX', 'CARTON'])
  })
  it('has labels for all StockStatus values', () => {
    expect(Object.keys(STOCK_STATUS_LABELS)).toEqual(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'])
  })
  it('has labels for all MovementType values', () => {
    expect(Object.keys(MOVEMENT_TYPE_LABELS)).toEqual(['IN', 'OUT', 'ADJUSTMENT'])
  })
})

describe('Formatters', () => {
  it('formatCurrency formats XAF amount', () => {
    expect(formatCurrency('450000')).toContain('450')
    expect(formatCurrency('450000')).toContain('XAF')
  })
  it('formatCurrency handles 0', () => {
    expect(formatCurrency(0)).toContain('0')
  })
  it('formatQuantity formats pieces', () => {
    expect(formatQuantity(1, 'PIECE')).toContain('pièce')
    expect(formatQuantity(5, 'PIECE')).toContain('pièces')
  })
  it('formatDelta prefixes positive with +', () => {
    expect(formatDelta(5)).toBe('+5')
    expect(formatDelta(-3)).toBe('-3')
    expect(formatDelta(0)).toBe('0')
  })
})

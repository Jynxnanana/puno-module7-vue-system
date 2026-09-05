import { describe, it, expect } from 'vitest'
import { filterOrders, validateOrder, getNextStatus, normalizeArchivedField, filterByArchiveState } from './orderUtils'

describe('filterOrders', () => {
  const orders = [
    { id: 1, customerName: 'Juan Dela Cruz' },
    { id: 2, customerName: 'Maria Santos' }
  ]

  it('returns only matching records by customer name', () => {
    expect(filterOrders(orders, 'juan')).toHaveLength(1)
  })

  it('is case-insensitive', () => {
    expect(filterOrders(orders, 'MARIA')[0].customerName).toBe('Maria Santos')
  })
})

describe('validateOrder', () => {
  it('rejects an order with an empty customer name', () => {
    const result = validateOrder({ customerName: '', orderItems: 'Burger', totalAmount: 100 })
    expect(result.valid).toBe(false)
  })

  it('rejects a negative total amount', () => {
    const result = validateOrder({ customerName: 'Juan', orderItems: 'Burger', totalAmount: -50 })
    expect(result.valid).toBe(false)
  })
})

describe('getNextStatus', () => {
  it('returns "Preparing" after "Pending"', () => {
    expect(getNextStatus('Pending')).toBe('Preparing')
  })
})

describe('normalizeArchivedField', () => {
  it('defaults archived to false for old records with no archived field', () => {
    const old = { id: 1, customerName: 'Juan' } // saved before this change
    expect(normalizeArchivedField(old).archived).toBe(false)
  })

  it('preserves archived value if already present', () => {
    const rec = { id: 2, archived: true }
    expect(normalizeArchivedField(rec).archived).toBe(true)
  })
})

describe('filterByArchiveState', () => {
  const orders = [
    { id: 1, archived: false },
    { id: 2, archived: true }
  ]

  it('returns only active orders', () => {
    expect(filterByArchiveState(orders, 'active')).toHaveLength(1)
  })

  it('returns only archived orders', () => {
    expect(filterByArchiveState(orders, 'archived')).toHaveLength(1)
  })

  it('returns all orders', () => {
    expect(filterByArchiveState(orders, 'all')).toHaveLength(2)
  })
})
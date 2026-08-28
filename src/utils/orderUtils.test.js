// src/utils/orderUtils.test.js
import { describe, it, expect } from 'vitest'
import { filterOrders, validateOrder, getNextStatus } from './orderUtils'

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
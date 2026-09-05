// src/utils/orderUtils.js

// Filters orders by customer name (case-insensitive)
export function filterOrders(records, keyword) {
  const term = (keyword || '').toLowerCase().trim()
  if (!term) return records
  return records.filter(r => r.customerName.toLowerCase().includes(term))
}

// Validates an order before it can be saved
export function validateOrder(order) {
  if (!order.customerName || !order.customerName.trim()) {
    return { valid: false, message: 'Customer name is required.' }
  }
  if (!order.orderItems || !order.orderItems.trim()) {
    return { valid: false, message: 'Order items are required.' }
  }
  if (!order.totalAmount || Number(order.totalAmount) <= 0) {
    return { valid: false, message: 'Total amount must be greater than zero.' }
  }
  return { valid: true, message: '' }
}

// Returns the next status in the order flow (state transition)
export function getNextStatus(status) {
  const flow = { Pending: 'Preparing', Preparing: 'Completed' }
  return flow[status] || null
}
// Normalizes records loaded from localStorage so older records
// (saved before this change) safely default to Active (not archived).
export function normalizeArchivedField(order) {
  return { archived: false, ...order }
}

// Filters an order list by archive state.
// state: 'all' | 'active' | 'archived'
export function filterByArchiveState(orders, state) {
  if (state === 'archived') return orders.filter(o => o.archived === true)
  if (state === 'active') return orders.filter(o => !o.archived)
  return orders
}
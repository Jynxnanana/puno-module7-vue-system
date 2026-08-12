<script setup>
defineProps({
  records: { type: Array, required: true }
})
const emit = defineEmits(['edit', 'delete'])

const statusColor = (status) => ({
  Pending: 'bg-yellow-100 text-yellow-800',
  Preparing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
}[status] || 'bg-gray-100 text-gray-800')
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          <th class="px-4 py-3">Customer</th>
          <th class="px-4 py-3">Items</th>
          <th class="px-4 py-3">Total</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="records.length === 0">
          <td colspan="5" class="px-4 py-6 text-center text-gray-400">No orders found.</td>
        </tr>
        <tr v-for="record in records" :key="record.id" class="border-t">
          <td class="px-4 py-3 font-medium text-gray-800">{{ record.customerName }}</td>
          <td class="px-4 py-3 text-gray-600">{{ record.orderItems }}</td>
          <td class="px-4 py-3">₱{{ record.totalAmount.toFixed(2) }}</td>
          <td class="px-4 py-3">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusColor(record.status)]">
              {{ record.status }}
            </span>
          </td>
          <td class="px-4 py-3 space-x-2">
            <button @click="emit('edit', record)" class="text-blue-600 hover:underline">Edit</button>
            <button @click="emit('delete', record.id)" class="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editingRecord: { type: Object, default: null }
})
const emit = defineEmits(['submit', 'cancel'])

const customerName = ref('')
const orderItems = ref('')
const totalAmount = ref('')
const status = ref('Pending')
const errorMessage = ref('')

watch(() => props.editingRecord, (record) => {
  if (record) {
    customerName.value = record.customerName
    orderItems.value = record.orderItems
    totalAmount.value = record.totalAmount
    status.value = record.status
  } else {
    resetForm()
  }
})

function resetForm() {
  customerName.value = ''
  orderItems.value = ''
  totalAmount.value = ''
  status.value = 'Pending'
  errorMessage.value = ''
}

function handleSubmit() {
  if (!customerName.value.trim() || !orderItems.value.trim() || !totalAmount.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }
  errorMessage.value = ''
  emit('submit', {
    customerName: customerName.value.trim(),
    orderItems: orderItems.value.trim(),
    totalAmount: Number(totalAmount.value),
    status: status.value
  })
  resetForm()
}

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-800">
      {{ editingRecord ? 'Edit Order' : 'New Order' }}
    </h2>

    <div v-if="errorMessage" class="bg-red-100 text-red-700 text-sm px-4 py-2 rounded">
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
        <input v-model="customerName" type="text" placeholder="e.g. Juan Dela Cruz"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount (P)</label>
        <input v-model="totalAmount" type="number" min="0" step="0.01" placeholder="e.g. 250"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Order Items</label>
      <textarea v-model="orderItems" rows="2" placeholder="e.g. 2x Burger, 1x Fries, 1x Soda"
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select v-model="status" class="w-full border border-gray-300 rounded px-3 py-2">
        <option>Pending</option>
        <option>Preparing</option>
        <option>Completed</option>
        <option>Cancelled</option>
      </select>
    </div>

    <div class="flex gap-3">
      <button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
        {{ editingRecord ? 'Update Order' : 'Add Order' }}
      </button>
      <button v-if="editingRecord" type="button" @click="handleCancel"
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
        Cancel
      </button>
    </div>
  </form>
</template>
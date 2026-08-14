<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editingRecord: { type: Object, default: null },
  darkMode: Boolean
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
  <div
    :class="darkMode
      ? 'bg-gray-900/80 border-gray-700/60'
      : 'bg-white/90 border-gray-200/80'"
    class="rounded-2xl border shadow-xl backdrop-blur-sm p-6 mb-6 relative overflow-hidden">

    <!-- Top accent line -->
    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent rounded-t-2xl" />

    <div class="flex items-center gap-2 mb-6">
      <div class="w-1 h-5 bg-orange-500 rounded-full" />
      <h2 :class="darkMode ? 'text-white' : 'text-gray-900'"
        class="text-sm font-semibold uppercase tracking-widest">
        {{ editingRecord ? 'Edit Order' : 'New Order' }}
      </h2>
    </div>

    <transition name="slide-fade">
      <div v-if="errorMessage"
        :class="darkMode
          ? 'bg-red-900/20 border-red-800/50 text-red-400'
          : 'bg-red-50 border-red-200 text-red-600'"
        class="border text-xs px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ errorMessage }}
      </div>
    </transition>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
            class="block text-xs font-semibold uppercase tracking-wider">
            Customer Name
          </label>
          <input v-model="customerName" type="text" placeholder="e.g. Juan Dela Cruz"
            :class="darkMode
              ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
              : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-300 focus:border-orange-400 focus:ring-orange-400/20'"
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 transition-all duration-200" />
        </div>
        <div class="space-y-1.5">
          <label :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
            class="block text-xs font-semibold uppercase tracking-wider">
            Total Amount (₱)
          </label>
          <input v-model="totalAmount" type="number" min="0" step="0.01" placeholder="e.g. 250"
            :class="darkMode
              ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
              : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-300 focus:border-orange-400 focus:ring-orange-400/20'"
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 transition-all duration-200" />
        </div>
      </div>

      <div class="space-y-1.5">
        <label :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
          class="block text-xs font-semibold uppercase tracking-wider">
          Order Items
        </label>
        <textarea v-model="orderItems" rows="2"
          placeholder="e.g. 2x Burger, 1x Fries, 1x Soda"
          :class="darkMode
            ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
            : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-300 focus:border-orange-400 focus:ring-orange-400/20'"
          class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 transition-all duration-200 resize-none">
        </textarea>
      </div>

      <div class="space-y-1.5">
        <label :class="darkMode ? 'text-gray-400' : 'text-gray-500'"
          class="block text-xs font-semibold uppercase tracking-wider">
          Status
        </label>
        <select v-model="status"
          :class="darkMode
            ? 'bg-gray-800/60 border-gray-700 text-white focus:border-orange-500 focus:ring-orange-500/20'
            : 'bg-gray-50/80 border-gray-200 text-gray-900 focus:border-orange-400 focus:ring-orange-400/20'"
          class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 transition-all duration-200">
          <option>Pending</option>
          <option>Preparing</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="btn-shimmer bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/25">
          {{ editingRecord ? 'Update Order' : 'Add Order' }}
        </button>
        <button v-if="editingRecord" type="button" @click="handleCancel"
          :class="darkMode
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'"
          class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
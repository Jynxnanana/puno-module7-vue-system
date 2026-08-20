<script setup>
const props = defineProps({
  record: { type: Object, default: null },
  darkMode: Boolean
})
const emit = defineEmits(['close'])

function printReceipt() {
  window.print()
}
</script>

<template>
  <teleport to="body">
    <transition name="modal-backdrop">
      <div v-if="record"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
        @click.self="emit('close')">
        <transition name="modal-pop" appear>
          <div id="receipt-print-area"
            :class="darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'"
            class="modal-pop-enter-active rounded-2xl border shadow-2xl p-6 max-w-sm w-full">

            <div class="text-center mb-4 pb-4 border-b border-dashed" :class="darkMode ? 'border-gray-700' : 'border-gray-300'">
              <p class="text-lg font-bold">FoodOrdering Management System</p>
              <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs">Order Receipt</p>
            </div>

            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between">
                <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">Order ID</span>
                <span class="font-mono">#{{ record.id }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">Customer</span>
                <span class="font-semibold">{{ record.customerName }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">Status</span>
                <span class="font-semibold">{{ record.status }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'">Date</span>
                <span>{{ new Date(record.id).toLocaleString() }}</span>
              </div>
            </div>

            <div class="border-t border-dashed pt-3 mb-4" :class="darkMode ? 'border-gray-700' : 'border-gray-300'">
              <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-xs mb-1">Items</p>
              <p class="text-sm">{{ record.orderItems }}</p>
            </div>

            <div class="border-t border-dashed pt-3 flex justify-between items-center" :class="darkMode ? 'border-gray-700' : 'border-gray-300'">
              <span class="font-semibold">Total</span>
              <span class="text-xl font-bold text-orange-500">₱{{ record.totalAmount.toFixed(2) }}</span>
            </div>

            <div class="flex gap-3 mt-6 no-print">
              <button @click="emit('close')"
                :class="darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                Close
              </button>
              <button @click="printReceipt"
                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                🖨️ Print
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>
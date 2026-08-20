<script setup>
import { ref } from 'vue'

const props = defineProps({
  records: { type: Array, required: true },
  darkMode: Boolean
})
const emit = defineEmits(['edit', 'delete', 'update-status', 'view-receipt'])

const statusConfig = (status) => ({
  Pending:   { class: 'bg-amber-500/15 text-amber-400 border-amber-500/30',       dot: 'bg-amber-400' },
  Preparing: { class: 'bg-blue-500/15 text-blue-400 border-blue-500/30',          dot: 'bg-blue-400' },
  Completed: { class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  Cancelled: { class: 'bg-red-500/15 text-red-400 border-red-500/30',             dot: 'bg-red-400' },
}[status] || { class: 'bg-gray-500/15 text-gray-400 border-gray-500/30', dot: 'bg-gray-400' })

const nextStatus = (status) => ({
  Pending: 'Preparing',
  Preparing: 'Completed',
}[status] || null)

const nextStatusLabel = (status) => ({
  Pending: 'Start Preparing',
  Preparing: 'Mark Completed',
}[status] || null)

const confirmDeleteRecord = ref(null)
const deletingId = ref(null)

function askDelete(record) {
  confirmDeleteRecord.value = record
}
function cancelDelete() {
  confirmDeleteRecord.value = null
}
function confirmDelete() {
  const id = confirmDeleteRecord.value.id
  deletingId.value = id
  confirmDeleteRecord.value = null
  setTimeout(() => {
    emit('delete', id)
    deletingId.value = null
  }, 350)
}

const pulsingId = ref(null)
function handleEdit(record) {
  pulsingId.value = record.id
  setTimeout(() => (pulsingId.value = null), 800)
  emit('edit', record)
}
</script>

<template>
  <div
    :class="darkMode
      ? 'bg-gray-900/80 border-gray-700/60'
      : 'bg-white/90 border-gray-200/80'"
    class="rounded-2xl border shadow-xl backdrop-blur-sm overflow-hidden relative">

    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />

    <!-- Header -->
    <div
      :class="darkMode ? 'border-gray-700/60' : 'border-gray-100'"
      class="px-4 sm:px-6 py-4 border-b flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-1 h-5 bg-orange-500 rounded-full" />
        <h3 :class="darkMode ? 'text-white' : 'text-gray-900'"
          class="text-sm font-semibold uppercase tracking-widest">Orders</h3>
      </div>
      <span
        :class="darkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-500 border-orange-200'"
        class="text-xs font-semibold px-3 py-1 rounded-full border">
        {{ records.length }} total
      </span>
    </div>

    <!-- Empty state -->
    <div v-if="records.length === 0" class="px-6 py-16 text-center">
      <div class="flex flex-col items-center gap-3">
        <svg class="w-20 h-20" :class="darkMode ? 'text-gray-700' : 'text-orange-200'"
          fill="none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.15" />
          <path d="M30 40h40l-4 25a4 4 0 01-4 3.5H38a4 4 0 01-4-3.5L30 40z"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M35 40l3-10a5 5 0 015-4h14a5 5 0 015 4l3 10"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="42" cy="52" r="2" fill="currentColor" />
          <circle cx="50" cy="52" r="2" fill="currentColor" />
          <circle cx="58" cy="52" r="2" fill="currentColor" />
        </svg>
        <div>
          <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-sm font-medium">No orders yet</p>
          <p :class="darkMode ? 'text-gray-600' : 'text-gray-400'" class="text-xs mt-0.5">Add your first order using the form above</p>
        </div>
      </div>
    </div>

    <!-- MOBILE: Card layout -->
    <div v-if="records.length > 0" class="sm:hidden divide-y"
      :class="darkMode ? 'divide-gray-800/60' : 'divide-gray-100'">
      <div
        v-for="(record, index) in records"
        :key="record.id"
        :class="[
          darkMode ? 'bg-gray-900/60 hover:bg-orange-500/5' : 'hover:bg-orange-50/40',
          deletingId === record.id ? 'row-deleting' : 'row-animate',
          pulsingId === record.id ? 'edit-pulse' : ''
        ]"
        class="p-4 transition-colors duration-150">

        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <span :class="darkMode ? 'text-gray-600' : 'text-gray-300'" class="font-mono text-xs shrink-0">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span :class="darkMode ? 'text-white' : 'text-gray-900'" class="font-semibold text-sm truncate">
              {{ record.customerName }}
            </span>
          </div>
          <span :class="['inline-flex items-center gap-1.5 border text-xs font-semibold px-2.5 py-1 rounded-full shrink-0', statusConfig(record.status).class]">
            <span :class="['w-1.5 h-1.5 rounded-full', statusConfig(record.status).dot]" />
            {{ record.status }}
          </span>
        </div>

        <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-xs mb-3 line-clamp-2">
          {{ record.orderItems }}
        </p>

        <div class="flex items-center justify-between mb-3">
          <span class="font-bold text-orange-500 text-base">₱{{ record.totalAmount.toFixed(2) }}</span>
          <button @click="emit('view-receipt', record)"
            :class="darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-400 hover:text-orange-500'"
            class="text-xs font-medium transition-colors">
            🧾 Receipt
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <button v-if="nextStatus(record.status)"
            @click="emit('update-status', record.id, nextStatus(record.status))"
            class="btn-shimmer bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 shadow shadow-orange-500/25 w-full">
            {{ nextStatusLabel(record.status) }}
          </button>
          <div class="flex gap-2">
            <button @click="handleEdit(record)"
              :class="darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200'"
              class="btn-shimmer border text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 flex-1">
              Edit
            </button>
            <button @click="askDelete(record)"
              :class="darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100 border-red-200'"
              class="icon-shake btn-shimmer border text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 flex-1">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- DESKTOP: Table layout -->
    <div v-if="records.length > 0" class="hidden sm:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr :class="darkMode ? 'bg-gray-800/40 text-gray-500' : 'bg-gray-50/80 text-gray-400'"
            class="text-xs uppercase tracking-widest">
            <th class="px-6 py-3.5 text-left font-semibold">#</th>
            <th class="px-6 py-3.5 text-left font-semibold">Customer</th>
            <th class="px-6 py-3.5 text-left font-semibold">Items</th>
            <th class="px-6 py-3.5 text-left font-semibold">Total</th>
            <th class="px-6 py-3.5 text-left font-semibold">Status</th>
            <th class="px-6 py-3.5 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody :class="darkMode ? 'divide-gray-800/60' : 'divide-gray-100'" class="divide-y">
          <tr v-for="(record, index) in records" :key="record.id"
            :class="[
              darkMode ? 'hover:bg-orange-500/5 text-gray-300' : 'hover:bg-orange-50/60 text-gray-700',
              deletingId === record.id ? 'row-deleting' : 'row-animate',
              pulsingId === record.id ? 'edit-pulse' : ''
            ]"
            class="transition-colors duration-150 group">
            <td class="px-6 py-4">
              <span :class="darkMode ? 'text-gray-600' : 'text-gray-300'" class="font-mono text-xs">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="darkMode ? 'text-white' : 'text-gray-900'" class="font-semibold text-sm">
                {{ record.customerName }}
              </span>
            </td>
            <td class="px-6 py-4 max-w-[180px]">
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-xs truncate block">
                {{ record.orderItems }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="font-bold text-orange-500 text-sm">₱{{ record.totalAmount.toFixed(2) }}</span>
            </td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center gap-1.5 border text-xs font-semibold px-2.5 py-1 rounded-full', statusConfig(record.status).class]">
                <span :class="['w-1.5 h-1.5 rounded-full', statusConfig(record.status).dot]" />
                {{ record.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                <button v-if="nextStatus(record.status)"
                  @click="emit('update-status', record.id, nextStatus(record.status))"
                  class="btn-shimmer bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 shadow shadow-orange-500/20 whitespace-nowrap">
                  {{ nextStatusLabel(record.status) }}
                </button>
                <button @click="handleEdit(record)"
                  :class="darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200'"
                  class="btn-shimmer border text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95">
                  Edit
                </button>
                <button @click="askDelete(record)"
                  :class="darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100 border-red-200'"
                  class="icon-shake btn-shimmer border text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95">
                  Delete
                </button>
                <button @click="emit('view-receipt', record)"
                  :class="darkMode ? 'text-gray-500 hover:text-orange-400' : 'text-gray-400 hover:text-orange-500'"
                  class="text-xs font-semibold px-2 py-1.5 transition-colors">
                  🧾
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Custom Delete Confirmation Modal -->
    <teleport to="body">
      <transition name="modal-backdrop">
        <div v-if="confirmDeleteRecord"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          @click.self="cancelDelete">
          <transition name="modal-pop" appear>
            <div
              :class="darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
              class="modal-pop-enter-active rounded-2xl border shadow-2xl p-6 max-w-sm w-full">
              <div class="flex flex-col items-center text-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                <h3 :class="darkMode ? 'text-white' : 'text-gray-900'" class="text-base font-semibold">
                  Delete this order?
                </h3>
                <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
                  Order for <span class="font-medium" :class="darkMode ? 'text-gray-200' : 'text-gray-700'">{{ confirmDeleteRecord.customerName }}</span> will be permanently removed. This action cannot be undone.
                </p>
                <div class="flex gap-3 w-full mt-2">
                  <button @click="cancelDelete"
                    :class="darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95">
                    Cancel
                  </button>
                  <button @click="confirmDelete"
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 shadow-lg shadow-red-500/25">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </div>
</template>
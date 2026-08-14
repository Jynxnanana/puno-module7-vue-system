<script setup>
import { computed } from 'vue'

const props = defineProps({
  records: { type: Array, required: true },
  darkMode: Boolean
})
const emit = defineEmits(['edit', 'delete', 'update-status'])

const columns = [
  { key: 'Pending',   label: 'Pending',   accent: 'text-amber-400',   dot: 'bg-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  { key: 'Preparing', label: 'Preparing', accent: 'text-blue-400',    dot: 'bg-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { key: 'Completed', label: 'Completed', accent: 'text-emerald-400',dot: 'bg-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { key: 'Cancelled', label: 'Cancelled', accent: 'text-red-400',    dot: 'bg-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
]

const grouped = computed(() => {
  const map = {}
  columns.forEach(col => { map[col.key] = [] })
  props.records.forEach(r => {
    if (map[r.status]) map[r.status].push(r)
  })
  return map
})

const nextStatus = (status) => ({
  Pending: 'Preparing',
  Preparing: 'Completed',
}[status] || null)

const nextStatusLabel = (status) => ({
  Pending: 'Start Preparing',
  Preparing: 'Mark Completed',
}[status] || null)
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    
<div v-for="col in columns" :key="col.key"
      :id="`board-col-${col.key}`"
      :class="darkMode ? 'bg-gray-900/70 border-gray-700/60' : 'bg-white/80 border-gray-200/70'"
      class="rounded-2xl border shadow-lg backdrop-blur-sm overflow-hidden flex flex-col scroll-mt-24">
      <!-- Column header -->
      <div :class="[col.bg, col.border]" class="px-4 py-3 border-b flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span :class="col.dot" class="w-2 h-2 rounded-full" />
          <h4 :class="col.accent" class="text-xs font-bold uppercase tracking-wider">{{ col.label }}</h4>
        </div>
        <span :class="darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'"
          class="text-xs font-semibold px-2 py-0.5 rounded-full">
          {{ grouped[col.key].length }}
        </span>
      </div>

      <!-- Cards -->
      <div class="p-3 space-y-3 flex-1 min-h-[120px]">
        <p v-if="grouped[col.key].length === 0"
          :class="darkMode ? 'text-gray-600' : 'text-gray-300'"
          class="text-xs text-center py-6">No orders</p>

        <div v-for="record in grouped[col.key]" :key="record.id"
          :class="darkMode ? 'bg-gray-800/60 border-gray-700/60 hover:border-orange-700/50' : 'bg-gray-50/80 border-gray-200 hover:border-orange-300'"
          class="row-animate border rounded-xl p-3 transition-all duration-150">

          <p :class="darkMode ? 'text-white' : 'text-gray-900'" class="font-semibold text-sm truncate mb-1">
            {{ record.customerName }}
          </p>
          <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-xs line-clamp-2 mb-2">
            {{ record.orderItems }}
          </p>
          <p class="font-bold text-orange-500 text-sm mb-3">₱{{ record.totalAmount.toFixed(2) }}</p>

          <div class="flex flex-col gap-1.5">
            <button v-if="nextStatus(record.status)"
              @click="emit('update-status', record.id, nextStatus(record.status))"
              class="btn-shimmer bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 w-full">
              {{ nextStatusLabel(record.status) }}
            </button>
            <div class="flex gap-1.5">
              <button @click="emit('edit', record)"
                :class="darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
                class="btn-shimmer text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 flex-1">
                Edit
              </button>
              <button @click="emit('delete', record)"
                :class="darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'"
                class="btn-shimmer text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 flex-1">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
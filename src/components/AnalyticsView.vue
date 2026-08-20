<script setup>
import { computed } from 'vue'

const props = defineProps({
  records: { type: Array, required: true },
  darkMode: Boolean
})

const dailyData = computed(() => {
  const map = {}
  props.records.forEach(r => {
    const date = new Date(r.id)
    const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!map[key]) map[key] = { count: 0, revenue: 0 }
    map[key].count += 1
    map[key].revenue += r.totalAmount
  })
  return Object.entries(map).map(([label, val]) => ({ label, ...val }))
})

const maxCount = computed(() => Math.max(1, ...dailyData.value.map(d => d.count)))
const maxRevenue = computed(() => Math.max(1, ...dailyData.value.map(d => d.revenue)))
const totalRevenue = computed(() => props.records.reduce((sum, r) => sum + r.totalAmount, 0))
const avgOrderValue = computed(() =>
  props.records.length ? (totalRevenue.value / props.records.length) : 0
)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div :class="darkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/90 border-gray-200/80'"
        class="rounded-2xl border shadow-sm px-5 py-4">
        <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
        <p class="text-2xl font-bold text-orange-500">₱{{ totalRevenue.toFixed(2) }}</p>
      </div>
      <div :class="darkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/90 border-gray-200/80'"
        class="rounded-2xl border shadow-sm px-5 py-4">
        <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs font-semibold uppercase tracking-wider mb-1">Avg. Order Value</p>
        <p class="text-2xl font-bold text-blue-400">₱{{ avgOrderValue.toFixed(2) }}</p>
      </div>
      <div :class="darkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/90 border-gray-200/80'"
        class="rounded-2xl border shadow-sm px-5 py-4 col-span-2 sm:col-span-1">
        <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</p>
        <p class="text-2xl font-bold text-emerald-400">{{ records.length }}</p>
      </div>
    </div>

    <div :class="darkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/90 border-gray-200/80'"
      class="rounded-2xl border shadow-sm p-6">
      <h4 :class="darkMode ? 'text-white' : 'text-gray-900'" class="text-sm font-semibold mb-4">Orders per Day</h4>
      <div v-if="dailyData.length === 0" :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-sm text-center py-8">
        No data yet — add some orders first.
      </div>
      <div v-else class="flex items-end gap-3 h-40">
        <div v-for="d in dailyData" :key="d.label" class="flex-1 flex flex-col items-center gap-2">
          <div class="w-full bg-orange-500/20 rounded-t-lg relative flex items-end justify-center" style="height: 100%">
            <div class="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500"
              :style="{ height: (d.count / maxCount * 100) + '%' }" />
          </div>
          <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs">{{ d.label }}</span>
          <span :class="darkMode ? 'text-gray-300' : 'text-gray-600'" class="text-xs font-semibold">{{ d.count }}</span>
        </div>
      </div>
    </div>

    <div :class="darkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/90 border-gray-200/80'"
      class="rounded-2xl border shadow-sm p-6">
      <h4 :class="darkMode ? 'text-white' : 'text-gray-900'" class="text-sm font-semibold mb-4">Revenue Trend</h4>
      <div v-if="dailyData.length === 0" :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-sm text-center py-8">
        No data yet.
      </div>
      <div v-else class="flex items-end gap-3 h-40">
        <div v-for="d in dailyData" :key="d.label" class="flex-1 flex flex-col items-center gap-2">
          <div class="w-full bg-emerald-500/20 rounded-t-lg relative flex items-end justify-center" style="height: 100%">
            <div class="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500"
              :style="{ height: (d.revenue / maxRevenue * 100) + '%' }" />
          </div>
          <span :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs">{{ d.label }}</span>
          <span :class="darkMode ? 'text-gray-300' : 'text-gray-600'" class="text-xs font-semibold">₱{{ d.revenue.toFixed(0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
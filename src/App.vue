<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import AppHeader from './components/AppHeader.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import OrderBoard from './components/OrderBoard.vue'
import AppFooter from './components/AppFooter.vue'

const records = ref([])
const searchTerm = ref('')
const editingId = ref(null)
const darkMode = ref(false)
const ripple = ref(false)
const rippleClass = ref('')
const rippleStyle = ref({})
const isLoading = ref(true)
const viewMode = ref('list')
const statusFilter = ref(null)
const clickedCard = ref(null)
const listAnchor = ref(null)

const cursorX = ref(-999)
const cursorY = ref(-999)

const toasts = ref([])
let toastId = 0
function pushToast(message, type = 'success') {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

function fireConfetti() {
  const colors = ['#fb923c', '#f97316', '#fbbf24', '#fde68a', '#fdba74']
  const container = document.body
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.left = Math.random() * 100 + 'vw'
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
    piece.style.animationDuration = 1.4 + Math.random() * 1.2 + 's'
    piece.style.animationDelay = Math.random() * 0.2 + 's'
    container.appendChild(piece)
    setTimeout(() => piece.remove(), 3000)
  }
}

function useCountUp(targetRef) {
  const display = ref(0)
  watch(targetRef, (newVal) => {
    const start = display.value
    const change = newVal - start
    const duration = 500
    const startTime = performance.now()
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      display.value = Math.round(start + change * eased)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, { immediate: true })
  return display
}

onMounted(() => {
  const saved = localStorage.getItem('module7-records')
  records.value = saved ? JSON.parse(saved) : []
  const savedTheme = localStorage.getItem('module7-theme')
  darkMode.value = savedTheme === 'dark'

  window.addEventListener('mousemove', (e) => {
    cursorX.value = e.clientX
    cursorY.value = e.clientY
  })

  setTimeout(() => { isLoading.value = false }, 700)
})

function toggleDark(event) {
  const x = event?.clientX ?? window.innerWidth / 2
  const y = event?.clientY ?? window.innerHeight / 2
  rippleStyle.value = { '--rx': x + 'px', '--ry': y + 'px' }
  rippleClass.value = darkMode.value ? 'light' : 'dark'
  ripple.value = true
  setTimeout(() => (ripple.value = false), 700)
  darkMode.value = !darkMode.value
  localStorage.setItem('module7-theme', darkMode.value ? 'dark' : 'light')
}

function saveRecords() {
  localStorage.setItem('module7-records', JSON.stringify(records.value))
}

function handleSubmit(newRecord) {
  if (editingId.value) {
    const index = records.value.findIndex(r => r.id === editingId.value)
    records.value[index] = { id: editingId.value, ...newRecord }
    editingId.value = null
    pushToast('Order updated successfully.', 'success')
  } else {
    records.value.push({ id: Date.now(), ...newRecord })
    pushToast('Order added successfully.', 'success')
    fireConfetti()
  }
  saveRecords()
}

const editingRecord = computed(() =>
  records.value.find(r => r.id === editingId.value) || null
)

function startEdit(record) {
  editingId.value = record.id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingId.value = null
}

function deleteRecord(id) {
  const confirmed = window.confirm('Are you sure you want to delete this order?')
  if (!confirmed) return
  records.value = records.value.filter(r => r.id !== id)
  saveRecords()
  pushToast('Order deleted.', 'error')
}

function handleBoardDelete(record) {
  const confirmed = window.confirm(`Delete the order for ${record.customerName}?`)
  if (!confirmed) return
  deleteRecord(record.id)
}

function updateStatus(id, newStatus) {
  const record = records.value.find(r => r.id === id)
  if (!record) return
  record.status = newStatus
  saveRecords()
  pushToast(`Order marked as ${newStatus}.`, 'success')
}

const filteredRecords = computed(() => {
  let list = records.value

  if (statusFilter.value) {
    list = list.filter(r => r.status === statusFilter.value)
  }

  const keyword = searchTerm.value.toLowerCase().trim()
  if (keyword) {
    list = list.filter(r => r.customerName.toLowerCase().includes(keyword))
  }

  return list
})

const totalOrdersRaw     = computed(() => records.value.length)
const pendingOrdersRaw   = computed(() => records.value.filter(r => r.status === 'Pending').length)
const preparingOrdersRaw = computed(() => records.value.filter(r => r.status === 'Preparing').length)
const completedOrdersRaw = computed(() => records.value.filter(r => r.status === 'Completed').length)

const totalOrders     = useCountUp(totalOrdersRaw)
const pendingOrders   = useCountUp(pendingOrdersRaw)
const preparingOrders = useCountUp(preparingOrdersRaw)
const completedOrders = useCountUp(completedOrdersRaw)

function scrollToColumnWhenReady(statusValue, attempts = 0) {
  const el = document.getElementById(`board-col-${statusValue}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (attempts < 15) {
    setTimeout(() => scrollToColumnWhenReady(statusValue, attempts + 1), 50)
  }
}

async function handleCardClick(cardKey, statusValue) {
  clickedCard.value = cardKey
  setTimeout(() => (clickedCard.value = null), 300)

  if (statusFilter.value === statusValue) {
    statusFilter.value = null
    viewMode.value = 'list'
    await nextTick()
    setTimeout(() => {
      listAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
    return
  }

  statusFilter.value = statusValue

  if (statusValue === null) {
    viewMode.value = 'list'
    await nextTick()
    setTimeout(() => {
      listAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
  } else {
    viewMode.value = 'board'
    await nextTick()
    scrollToColumnWhenReady(statusValue)
  }
}

function clearFilter() {
  statusFilter.value = null
}
</script>

<template>
  <div
    :class="darkMode ? 'bg-gray-900' : 'bg-orange-50/30'"
    class="min-h-screen relative overflow-x-hidden">

    <div v-if="ripple" :class="['theme-ripple', rippleClass]" :style="rippleStyle" />

    <div :class="['cursor-glow', darkMode ? 'dark-mode' : 'light-mode']"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }" />

    <div :class="['bg-blob bg-blob-1', darkMode ? 'dark-1' : '']" />
    <div :class="['bg-blob bg-blob-2', darkMode ? 'dark-2' : '']" />
    <div :class="['bg-blob bg-blob-3', darkMode ? 'dark-3' : '']" />

    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-72 max-w-[90vw]">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id"
          :class="[
            'toast-enter-active rounded-xl border shadow-lg px-4 py-3 flex items-center gap-3 backdrop-blur-md text-sm font-medium',
            toast.type === 'success'
              ? (darkMode ? 'bg-emerald-900/80 border-emerald-700 text-emerald-300' : 'bg-white/95 border-emerald-200 text-emerald-700')
              : (darkMode ? 'bg-red-900/80 border-red-700 text-red-300' : 'bg-white/95 border-red-200 text-red-600')
          ]">
          <span :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
            class="w-2 h-2 rounded-full shrink-0" />
          {{ toast.message }}
        </div>
      </transition-group>
    </div>

    <div class="relative z-10">
      <AppHeader :dark-mode="darkMode" @toggle-dark="toggleDark($event)" />

      <main class="max-w-5xl mx-auto px-4 py-8">

        <div v-if="isLoading" class="space-y-6">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="i in 4" :key="i" class="skeleton rounded-2xl h-24" />
          </div>
          <div class="skeleton rounded-2xl h-72" />
          <div class="skeleton rounded-2xl h-48" />
        </div>

        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <button
              v-for="card in [
                { key: 'total',     label: 'Total Orders', value: totalOrders,     status: null,        accent: 'text-orange-500',  bg: darkMode ? 'bg-orange-500/10' : 'bg-orange-50',  border: darkMode ? 'border-orange-500/20' : 'border-orange-100' },
                { key: 'pending',   label: 'Pending',      value: pendingOrders,   status: 'Pending',    accent: 'text-amber-400',   bg: darkMode ? 'bg-amber-500/10'  : 'bg-amber-50',   border: darkMode ? 'border-amber-500/20'  : 'border-amber-100'  },
                { key: 'preparing', label: 'Preparing',    value: preparingOrders, status: 'Preparing',  accent: 'text-blue-400',    bg: darkMode ? 'bg-blue-500/10'   : 'bg-blue-50',    border: darkMode ? 'border-blue-500/20'   : 'border-blue-100'   },
                { key: 'completed', label: 'Completed',    value: completedOrders, status: 'Completed',  accent: 'text-emerald-400', bg: darkMode ? 'bg-emerald-500/10': 'bg-emerald-50', border: darkMode ? 'border-emerald-500/20': 'border-emerald-100' },
              ]"
              :key="card.key"
              @click="handleCardClick(card.key, card.status)"
              :class="[
                darkMode ? 'bg-gray-900/80 border-gray-700/60' : 'bg-white/90 border-gray-200/80',
                'card-lift rounded-2xl border shadow-lg backdrop-blur-sm px-5 py-4 relative overflow-hidden text-left cursor-pointer',
                clickedCard === card.key ? 'card-clicked' : '',
                statusFilter === card.status && card.status !== null ? 'card-active-ring' : ''
              ]">
              <div :class="[card.bg, card.border, 'absolute top-4 right-4 w-8 h-8 rounded-xl border flex items-center justify-center']">
                <div :class="[card.accent, 'w-2 h-2 rounded-full bg-current']" />
              </div>
              <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'"
                class="text-xs font-semibold uppercase tracking-wider mb-2">
                {{ card.label }}
              </p>
              <p :class="card.accent" class="text-3xl font-bold">{{ card.value }}</p>
            </button>
          </div>

          <transition name="chip-pop">
            <div v-if="statusFilter" class="mb-6 flex items-center gap-2">
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-xs">Filtering by:</span>
              <span class="chip-pop inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold pl-3 pr-2 py-1.5 rounded-full">
                {{ statusFilter }}
                <button @click="clearFilter"
                  class="w-4 h-4 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors">
                  ✕
                </button>
              </span>
            </div>
          </transition>

          <RecordForm
            :editing-record="editingRecord"
            :dark-mode="darkMode"
            @submit="handleSubmit"
            @cancel="cancelEdit"
          />

          <div ref="listAnchor"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by customer name..."
              :class="darkMode
                ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-500 focus:ring-orange-500'
                : 'bg-white/70 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-orange-400'"
              class="border rounded-xl px-4 py-2.5 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 shadow-sm backdrop-blur-sm"
            />
            <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'" class="text-xs whitespace-nowrap">
              Showing {{ filteredRecords.length }} of {{ totalOrdersRaw }} order(s)
            </p>
          </div>

          <div class="flex items-center gap-2 mb-4">
            <button @click="viewMode = 'list'"
              :class="viewMode === 'list'
                ? 'bg-orange-500 text-white shadow shadow-orange-500/25'
                : (darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200')"
              class="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200">
              List View
            </button>
            <button @click="viewMode = 'board'"
              :class="viewMode === 'board'
                ? 'bg-orange-500 text-white shadow shadow-orange-500/25'
                : (darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200')"
              class="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200">
              Board View
            </button>
          </div>

          <div class="relative">
            <transition name="filter-swap" mode="out-in">
              <RecordList
                v-if="viewMode === 'list'"
                :key="'list-' + statusFilter"
                :records="filteredRecords"
                :dark-mode="darkMode"
                @edit="startEdit"
                @delete="deleteRecord"
                @update-status="updateStatus"
              />
              <OrderBoard
                v-else
                :key="'board-' + statusFilter"
                :records="filteredRecords"
                :dark-mode="darkMode"
                @edit="startEdit"
                @delete="handleBoardDelete"
                @update-status="updateStatus"
              />
            </transition>
          </div>
        </template>
      </main>

      <AppFooter :dark-mode="darkMode" />
    </div>
  </div>
</template>
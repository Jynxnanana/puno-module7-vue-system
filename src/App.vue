<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import AppHeader from './components/AppHeader.vue'
import SideNav from './components/SideNav.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import OrderBoard from './components/OrderBoard.vue'
import AnalyticsView from './components/AnalyticsView.vue'
import ReceiptModal from './components/ReceiptModal.vue'
import AppFooter from './components/AppFooter.vue'
import { playClick, playSuccess, playDelete } from './utils/sound.js'
import { filterByArchiveState, normalizeArchivedField } from './utils/orderUtils.js'

const records = ref([])
const searchTerm = ref('')
const editingId = ref(null)
const darkMode = ref(false)
const ripple = ref(false)
const rippleClass = ref('')
const rippleStyle = ref({})
const isLoading = ref(true)
const viewMode = ref('list') // 'list' | 'board' | 'analytics'
const statusFilter = ref(null)
const archiveFilter = ref('active') // 'active' | 'archived' | 'all'   ← IDAGDAG ITO
const clickedCard = ref(null)
const listAnchor = ref(null)
const screenShake = ref(false)
const sideNavOpen = ref(false)
const receiptRecord = ref(null)
const lastDeleted = ref(null)

// Cursor glow
const cursorX = ref(-999)
const cursorY = ref(-999)

// Dark/light mode background particles
const stars = ref([])

// Toasts
const toasts = ref([])
let toastId = 0
function pushToast(message, type = 'success', undoable = false) {
  const id = ++toastId
  toasts.value.push({ id, message, type, undoable })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, undoable ? 4500 : 3000)
}
function dismissToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Confetti
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

// Count-up animation
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
  records.value = saved ? JSON.parse(saved).map(normalizeArchivedField) : []
  const savedTheme = localStorage.getItem('module7-theme')
  darkMode.value = savedTheme === 'dark'

  window.addEventListener('mousemove', (e) => {
    cursorX.value = e.clientX
    cursorY.value = e.clientY
  })

  const generatedStars = []
  for (let i = 0; i < 40; i++) {
    generatedStars.push({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: (Math.random() * 2 + 1).toFixed(1) + 'px',
      duration: (Math.random() * 3 + 2).toFixed(1) + 's',
      delay: (Math.random() * 3).toFixed(1) + 's'
    })
  }
  stars.value = generatedStars

  setTimeout(() => { isLoading.value = false }, 700)
})

// ---------- THEME SWITCH: full effect combo ----------
function toggleDark(event) {
  const x = event?.clientX ?? window.innerWidth / 2
  const y = event?.clientY ?? window.innerHeight / 2

  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  const radius = Math.hypot(maxX, maxY)

  rippleClass.value = darkMode.value ? 'to-light' : 'to-dark'
  rippleStyle.value = {
    '--x': x + 'px',
    '--y': y + 'px',
    '--r': radius + 'px'
  }
  ripple.value = true

  spawnFlash()
  spawnShockwave(x, y)
  spawnThemeParticles(x, y)
  spawnTrails(x, y)
  triggerShake()
  playClick()

  setTimeout(() => {
    darkMode.value = !darkMode.value
    localStorage.setItem('module7-theme', darkMode.value ? 'dark' : 'light')
  }, 420)

  setTimeout(() => {
    ripple.value = false
  }, 850)
}

function triggerShake() {
  screenShake.value = true
  setTimeout(() => (screenShake.value = false), 350)
}

function spawnFlash() {
  const flash = document.createElement('div')
  flash.className = 'theme-flash'
  document.body.appendChild(flash)
  setTimeout(() => flash.remove(), 400)
}

function spawnShockwave(x, y) {
  const ring = document.createElement('div')
  ring.className = 'theme-shockwave'
  ring.style.left = x + 'px'
  ring.style.top = y + 'px'
  ring.style.transform = 'translate(-50%, -50%)'
  document.body.appendChild(ring)
  setTimeout(() => ring.remove(), 750)
}

function spawnThemeParticles(x, y) {
  const colors = darkMode.value
    ? ['#fdba74', '#fb923c', '#fed7aa']
    : ['#1e293b', '#334155', '#0f172a']

  for (let i = 0; i < 18; i++) {
    const particle = document.createElement('div')
    particle.className = 'theme-particle'

    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3
    const distance = 70 + Math.random() * 110
    const px = Math.cos(angle) * distance
    const py = Math.sin(angle) * distance
    const size = 3 + Math.random() * 6

    particle.style.left = x + 'px'
    particle.style.top = y + 'px'
    particle.style.width = size + 'px'
    particle.style.height = size + 'px'
    particle.style.background = colors[Math.floor(Math.random() * colors.length)]
    particle.style.setProperty('--px', px + 'px')
    particle.style.setProperty('--py', py + 'px')

    document.body.appendChild(particle)
    setTimeout(() => particle.remove(), 650)
  }
}

function spawnTrails(x, y) {
  const colors = darkMode.value
    ? ['rgba(253,186,116,0.6)', 'rgba(251,146,60,0.5)']
    : ['rgba(30,41,59,0.5)', 'rgba(51,65,85,0.4)']

  for (let i = 0; i < 8; i++) {
    const trail = document.createElement('div')
    trail.className = 'theme-trail'

    const angle = (Math.PI * 2 * i) / 8
    const distance = 140 + Math.random() * 80
    const px = Math.cos(angle) * distance
    const py = Math.sin(angle) * distance
    const size = 14 + Math.random() * 16

    trail.style.left = x + 'px'
    trail.style.top = y + 'px'
    trail.style.width = size + 'px'
    trail.style.height = size + 'px'
    trail.style.background = colors[Math.floor(Math.random() * colors.length)]
    trail.style.setProperty('--px', px + 'px')
    trail.style.setProperty('--py', py + 'px')

    document.body.appendChild(trail)
    setTimeout(() => trail.remove(), 950)
  }
}
// ---------- END THEME SWITCH ----------

function saveRecords() {
  localStorage.setItem('module7-records', JSON.stringify(records.value))
}

function handleSubmit(newRecord) {
  if (editingId.value) {
    const index = records.value.findIndex(r => r.id === editingId.value)
    records.value[index] = { id: editingId.value, ...newRecord }
    editingId.value = null
    pushToast('Order updated successfully.', 'success')
    playSuccess()
  } else {
    records.value.push({ id: Date.now(), ...newRecord })
    pushToast('Order added successfully.', 'success')
    playSuccess()
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

// ---------- DELETE WITH UNDO ----------
function deleteRecord(id) {
  const confirmed = window.confirm('Are you sure you want to delete this order?')
  if (!confirmed) return
  const record = records.value.find(r => r.id === id)
  lastDeleted.value = record
  records.value = records.value.filter(r => r.id !== id)
  saveRecords()
  playDelete()
  pushToast('Order deleted.', 'error', true)
}

function undoDelete(toastIdToRemove) {
  if (lastDeleted.value) {
    records.value.push(lastDeleted.value)
    saveRecords()
    lastDeleted.value = null
    pushToast('Order restored.', 'success')
  }
  if (toastIdToRemove) dismissToast(toastIdToRemove)
}

function handleBoardDelete(record) {
  const confirmed = window.confirm(`Delete the order for ${record.customerName}?`)
  if (!confirmed) return
  deleteRecord(record.id)
}
// ---------- END DELETE WITH UNDO ----------

function updateStatus(id, newStatus) {
  const record = records.value.find(r => r.id === id)
  if (!record) return
  record.status = newStatus
  saveRecords()
  pushToast(`Order marked as ${newStatus}.`, 'success')
  playClick()
}

function archiveOrder(id) {
  const record = records.value.find(r => r.id === id)
  if (!record) return
  record.archived = true
  saveRecords()
  pushToast('Order archived.', 'success')
  playClick()
}

function openReceipt(record) {
  receiptRecord.value = record
}
function closeReceipt() {
  receiptRecord.value = null
}

const filteredRecords = computed(() => {
  let list = filterByArchiveState(records.value, archiveFilter.value)

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
  playClick()

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

function setView(mode) {
  viewMode.value = mode
}
</script>

<template>
  <div
    :class="[darkMode ? 'bg-gray-900' : 'bg-gray-50', screenShake ? 'screen-shake' : '']"
    class="min-h-screen relative overflow-x-hidden">

    <!-- Iris wipe -->
    <div v-if="ripple" :class="['theme-wipe', rippleClass]" :style="rippleStyle" />

    <!-- Cursor glow -->
    <div :class="['cursor-glow', darkMode ? 'dark-mode' : 'light-mode']"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }" />

    <!-- Background blobs -->
    <div :class="['bg-blob bg-blob-1', darkMode ? 'dark-1' : 'light-1']" />
    <div :class="['bg-blob bg-blob-2', darkMode ? 'dark-2' : 'light-2']" />
    <div :class="['bg-blob bg-blob-3', darkMode ? 'dark-3' : 'light-3']" />

    <!-- Dark mode extras -->
    <template v-if="darkMode">
      <div class="grid-overlay" />
      <div class="dark-vignette" />
      <div v-for="star in stars" :key="star.id"
        class="star"
        :style="{
          left: star.left, top: star.top, width: star.size, height: star.size,
          animationDuration: star.duration, animationDelay: star.delay
        }" />
    </template>

    <!-- Light mode extras -->
    <template v-else>
      <div class="light-top-glow" />
      <div class="grid-overlay-light" />
      <div v-for="star in stars" :key="'l-' + star.id"
        class="light-dot"
        :style="{
          left: star.left, top: star.top, width: star.size, height: star.size,
          animationDuration: star.duration, animationDelay: star.delay
        }" />
    </template>

    <!-- Toasts -->
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
          <span class="flex-1">{{ toast.message }}</span>
          <button v-if="toast.undoable" @click="undoDelete(toast.id)"
            class="text-xs font-bold underline hover:no-underline shrink-0">
            UNDO
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Side Nav -->
    <SideNav
      :open="sideNavOpen"
      :dark-mode="darkMode"
      :view-mode="viewMode"
      @close="sideNavOpen = false"
      @set-view="setView"
      @toggle-dark="toggleDark($event)"
    />

    <!-- Receipt Modal -->
    <ReceiptModal :record="receiptRecord" :dark-mode="darkMode" @close="closeReceipt" />

    <div class="relative z-10">
      <AppHeader :dark-mode="darkMode" @toggle-dark="toggleDark($event)" @open-menu="sideNavOpen = true" />

      <main class="max-w-5xl mx-auto px-4 py-8">

        <!-- SKELETON LOADING -->
        <div v-if="isLoading" class="space-y-6">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="i in 4" :key="i" class="skeleton rounded-2xl h-24" />
          </div>
          <div class="skeleton rounded-2xl h-72" />
          <div class="skeleton rounded-2xl h-48" />
        </div>

        <template v-else>
          <!-- Summary Cards -->
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

          <!-- Active filter chip -->
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

          <!-- Form (hidden on Analytics view) -->
          <RecordForm
            v-if="viewMode !== 'analytics'"
            :editing-record="editingRecord"
            :dark-mode="darkMode"
            @submit="handleSubmit"
            @cancel="cancelEdit"
          />

          <div ref="listAnchor"></div>

          <!-- Search (hidden on Analytics view) -->
          <div v-if="viewMode !== 'analytics'" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
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

              <select
    v-model="archiveFilter"
    :class="darkMode
      ? 'bg-gray-800/80 border-gray-700 text-white focus:ring-orange-500'
      : 'bg-white/70 border-gray-200 text-gray-900 focus:ring-orange-400'"
    class="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 shadow-sm backdrop-blur-sm">
    <option value="active">Active Orders</option>
    <option value="archived">Archived Orders</option>
    <option value="all">All Orders</option>
  </select>
          </div>

          <!-- View toggle -->
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <button @click="setView('list')"
              :class="viewMode === 'list'
                ? 'bg-orange-500 text-white shadow shadow-orange-500/25'
                : (darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200')"
              class="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200">
              List View
            </button>
            <button @click="setView('board')"
              :class="viewMode === 'board'
                ? 'bg-orange-500 text-white shadow shadow-orange-500/25'
                : (darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200')"
              class="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200">
              Board View
            </button>
            <button @click="setView('analytics')"
              :class="viewMode === 'analytics'
                ? 'bg-orange-500 text-white shadow shadow-orange-500/25'
                : (darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200')"
              class="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200">
              Analytics
            </button>
          </div>

          <!-- Animated view swap -->
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
                @view-receipt="openReceipt"
                @archive="archiveOrder"
              />
              <OrderBoard
                v-else-if="viewMode === 'board'"
                :key="'board-' + statusFilter"
                :records="filteredRecords"
                :dark-mode="darkMode"
                @edit="startEdit"
                @delete="handleBoardDelete"
                @update-status="updateStatus"
                @view-receipt="openReceipt"
              />
              <AnalyticsView
                v-else
                key="analytics"
                :records="records"
                :dark-mode="darkMode"
              />
            </transition>
          </div>
        </template>
      </main>

      <AppFooter :dark-mode="darkMode" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import RecordForm from'./components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import AppFooter from './components/AppFooter.vue'

const records = ref([])
const searchTerm = ref('')
const editingId = ref(null)
const feedback = ref('')

// Step 8: Load records from localStorage
onMounted(() => {
  const saved = localStorage.getItem('module7-records')
  records.value = saved ? JSON.parse(saved) : []
})

function saveRecords() {
  localStorage.setItem('module7-records', JSON.stringify(records.value))
}

function showFeedback(message) {
  feedback.value = message
  setTimeout(() => (feedback.value = ''), 2500)
}

// Step 9: Create / Step 12: Update
function handleSubmit(newRecord) {
  if (editingId.value) {
    const index = records.value.findIndex(r => r.id === editingId.value)
    records.value[index] = { id: editingId.value, ...newRecord }
    editingId.value = null
    showFeedback('Order updated successfully.')
  } else {
    records.value.push({ id: Date.now(), ...newRecord })
    showFeedback('Order added successfully.')
  }
  saveRecords()
}

const editingRecord = computed(() =>
  records.value.find(r => r.id === editingId.value) || null
)

function startEdit(record) {
  editingId.value = record.id
}

function cancelEdit() {
  editingId.value = null
}

// Step 10: Delete with confirmation
function deleteRecord(id) {
  const confirmed = window.confirm('Are you sure you want to delete this order?')
  if (!confirmed) return
  records.value = records.value.filter(record => record.id !== id)
  saveRecords()
  showFeedback('Order deleted.')
}

// Step 11: Search
const filteredRecords = computed(() => {
  const keyword = searchTerm.value.toLowerCase().trim()
  if (!keyword) return records.value
  return records.value.filter(record =>
    record.customerName.toLowerCase().includes(keyword)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="feedback" class="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
        {{ feedback }}
      </div>

      <RecordForm :editing-record="editingRecord" @submit="handleSubmit" @cancel="cancelEdit" />

      <div class="mb-4 flex items-center justify-between">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by customer name..."
          class="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <span class="text-sm text-gray-500 ml-4">{{ filteredRecords.length }} order(s)</span>
      </div>

      <RecordList :records="filteredRecords" @edit="startEdit" @delete="deleteRecord" />
    </main>

    <AppFooter />
  </div>
</template>
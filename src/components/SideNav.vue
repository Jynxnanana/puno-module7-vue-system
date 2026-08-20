<script setup>
defineProps({
  open: Boolean,
  darkMode: Boolean,
  viewMode: String
})
const emit = defineEmits(['close', 'set-view', 'toggle-dark'])

const items = [
  { key: 'list', label: 'List View', icon: '📋' },
  { key: 'board', label: 'Board View', icon: '🗂️' },
  { key: 'analytics', label: 'Analytics', icon: '📊' },
]
</script>

<template>
  <teleport to="body">
    <transition name="modal-backdrop">
      <div v-if="open" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9997]" @click="emit('close')" />
    </transition>
    <transition name="sidenav-slide">
      <aside v-if="open"
        :class="darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
        class="fixed top-0 left-0 h-full w-64 border-r shadow-2xl z-[9998] p-5 flex flex-col">

        <div class="flex items-center justify-between mb-6">
          <span :class="darkMode ? 'text-white' : 'text-gray-900'" class="font-bold">Menu</span>
          <button @click="emit('close')"
            :class="darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'"
            class="text-xl leading-none">✕</button>
        </div>

        <nav class="flex flex-col gap-1">
          <button v-for="item in items" :key="item.key"
            @click="emit('set-view', item.key); emit('close')"
            :class="viewMode === item.key
              ? 'bg-orange-500 text-white'
              : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100')"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left">
            <span>{{ item.icon }}</span> {{ item.label }}
          </button>
        </nav>

        <div class="mt-auto pt-4 border-t" :class="darkMode ? 'border-gray-800' : 'border-gray-100'">
          <button @click="emit('toggle-dark', $event)"
            :class="darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left">
            <span>{{ darkMode ? '🌙' : '☀️' }}</span> {{ darkMode ? 'Dark Mode' : 'Light Mode' }}
          </button>
        </div>
      </aside>
    </transition>
  </teleport>
</template>
<script setup>
defineProps({ darkMode: Boolean })
defineEmits(['toggle-dark'])
</script>

<template>
  <header
    :class="darkMode ? 'bg-gray-950/90 border-orange-900/30' : 'bg-white/80 border-orange-100'"
    class="border-b px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
    <div class="max-w-5xl mx-auto flex items-center justify-between">

      <!-- Logo + Brand -->
      <div class="flex items-center gap-3">
        <div class="relative w-10 h-10 shrink-0">
          <!-- Pulsing outer ring -->
          <div class="logo-ring"></div>

          <!-- Badge -->
          <div class="logo-float logo-glow logo-shine relative w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center">
            <div class="absolute inset-0 rounded-2xl ring-1 ring-white/30"></div>
            <svg class="w-5.5 h-5.5 text-white relative z-10" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M4 14a8 8 0 0116 0H4z" fill="white" fill-opacity="0.95"/>
              <rect x="3" y="14" width="18" height="2.2" rx="1.1" fill="white"/>
              <circle cx="12" cy="5.2" r="1.1" fill="white"/>
              <rect x="11.35" y="6.3" width="1.3" height="2.2" rx="0.6" fill="white"/>
            </svg>
          </div>
        </div>

        <div>
          <h1 :class="darkMode ? 'text-white' : 'text-gray-900'"
            class="text-lg font-bold tracking-tight leading-none">
            FoodOrdering
            <span class="text-orange-500">Management System</span>
          </h1>
          <p :class="darkMode ? 'text-gray-500' : 'text-gray-400'"
            class="text-xs mt-1 leading-none">Streamlined order tracking for restaurants</p>
        </div>
      </div>

      <!-- Theme toggle -->
      <button
        @click="$emit('toggle-dark', $event)"
        :class="darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-orange-700'
          : 'bg-gray-50 border-gray-200 hover:border-orange-300'"
        class="relative w-16 h-8 rounded-full border focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors duration-300 overflow-hidden shrink-0">
        <span
          :class="darkMode ? 'translate-x-8 bg-gray-900' : 'translate-x-0 bg-white shadow'"
          class="absolute left-0.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md">
          <svg v-if="darkMode" class="theme-icon spin-in w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.75 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.598.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
          </svg>
          <svg v-else class="theme-icon spin-in w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
          </svg>
        </span>
      </button>
    </div>
  </header>
</template>
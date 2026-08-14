<script setup>
defineProps({ darkMode: Boolean })
</script>

<template>
  <footer
    :class="darkMode
      ? 'bg-gray-950 border-gray-800/60 text-gray-600'
      : 'bg-white/60 border-gray-100 text-gray-400'"
    class="border-t px-6 py-5 mt-16 backdrop-blur-sm text-xs">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="text-orange-500 font-semibold">FoodOrdering Management System</span>
        <span>—</span>
        <span>Module 7 Prototype</span>
      </div>
      <span>Ruben L. Puno Jr. | BSCS 3A | Software Engineering 1</span>
    </div>
  </footer>
</template>
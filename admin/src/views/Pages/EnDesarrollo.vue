<template>
  <admin-layout>
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div class="flex flex-col items-center gap-4 text-center">
        <div class="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">En desarrollo</h1>
        <p class="text-gray-500 dark:text-gray-400 max-w-sm">
          Esta sección está actualmente en desarrollo. Pronto estará disponible.
        </p>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>

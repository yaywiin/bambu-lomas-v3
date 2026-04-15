<template>
  <AdminLayout>
    <div class="h-[calc(100vh-100px)] relative flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl m-6">
      
      <!-- Content En Desarrollo -->
      <div class="flex flex-col items-center text-center">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white capitalize">{{ moduloName }}</h1>
        <p class="mt-3 text-lg font-medium text-brand-600 dark:text-brand-400">Módulo en Desarrollo</p>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">Esta sección de gestión interna para el punto de venta está siendo trabajada.</p>
      </div>

      <!-- ================= FAB BACK BUTTON ================= -->
      <div class="absolute bottom-6 left-6">
        <router-link 
          to="/caja/pos/gestion"
          class="px-6 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-md flex items-center justify-center font-semibold hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 transition-all gap-2 active:scale-95"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Regresar a Menú
        </router-link>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const moduloName = computed(() => {
  const mod = route.params.modulo as string
  return mod ? mod.replace('-', ' ') : 'Módulo'
})
</script>

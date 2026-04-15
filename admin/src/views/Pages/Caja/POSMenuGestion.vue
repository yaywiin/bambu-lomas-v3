<template>
  <AdminLayout>
    <div class="h-[calc(100vh-100px)] relative flex flex-col items-center justify-center pt-8">

      <!-- Title -->
      <div class="absolute top-8 md:top-12 text-center w-full">
        <h1 class="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white tracking-tight">Menú De Gestión</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2 font-medium">Panel Administrativo del Punto de Venta</p>
      </div>

      <!-- ================= MAIN MENU CARDS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-6 mt-16 md:mt-20">
        
        <!-- Venta / POS Button -->
        <router-link 
          to="/caja/pos/gestion/venta"
          class="group flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 h-72 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div class="w-20 h-20 bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Venta</h2>
          <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Historial, devoluciones y tickets</p>
        </router-link>

        <!-- Inventario Button -->
        <router-link 
          to="/caja/pos/gestion/inventario"
          class="group flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 h-72 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div class="w-20 h-20 bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Inventario</h2>
          <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Revisión de stock rápido POS</p>
        </router-link>

        <!-- Cierre de Caja Button -->
        <router-link 
          to="/caja/pos/gestion/cierre"
          class="group flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 h-72 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div class="w-20 h-20 bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Cierre de Caja</h2>
          <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Arqueo y cortes de turno</p>
        </router-link>

      </div>

      <!-- ================= FAB BACK BUTTON ================= -->
      <div class="absolute bottom-6 left-6">
        <router-link 
          to="/caja/pos"
          class="px-6 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-md flex items-center justify-center font-semibold hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 transition-all gap-2 active:scale-95"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Regresar a POS
        </router-link>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>

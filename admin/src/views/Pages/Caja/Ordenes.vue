<template>
  <AdminLayout>
    <div class="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <!-- Header -->
      <div class="px-6 py-4 flex-shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Gestión de Órdenes</h1>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50 dark:bg-gray-900/50 p-6 custom-scrollbar">
        <div class="flex h-full gap-6 items-start min-w-max">
          
          <!-- Columna: Recibidos -->
          <div class="w-80 flex flex-col max-h-full bg-gray-100 dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800 flex justify-between items-center">
              <h3 class="font-bold text-gray-700 dark:text-gray-200">1. Nuevas</h3>
              <span class="bg-gray-200 dark:bg-gray-700 text-xs py-1 px-2.5 rounded-full font-bold">{{ ordenesRecibidas.length }}</span>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              <div 
                v-for="orden in ordenesRecibidas" 
                :key="orden.id"
                @click="abrirOrden(orden)"
                class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all text-gray-800 dark:text-gray-200"
              >
                <div class="flex items-center gap-2 mb-3">
                  <span class="font-bold text-sm">{{ orden.id }}</span>
                  <div class="flex flex-1 items-center gap-1 text-sm font-medium truncate">
                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                    <span class="truncate">{{ orden.cliente }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <span class="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-[11px] px-3 py-1 rounded-full font-semibold">Por preparar</span>
                </div>
                <div class="space-y-3 mt-2">
                  <div v-for="(item, idx) in orden.items" :key="idx" class="text-sm">
                    <div class="flex items-start text-gray-800 dark:text-gray-200 leading-tight">
                      <span class="w-6 text-gray-500 font-mono text-xs pt-0.5">{{ item.cantidad }}x</span>
                      <span class="font-medium flex-1">{{ item.producto }}</span>
                    </div>
                    <div v-if="item.extras?.length" class="pl-6 text-[11px] text-gray-500 mt-1">
                      - Extras : {{ item.extras.join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna: En Preparación -->
          <div class="w-80 flex flex-col max-h-full bg-gray-100 dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800 flex justify-between items-center">
              <h3 class="font-bold text-gray-700 dark:text-gray-200">2. En Preparación</h3>
              <span class="bg-gray-200 dark:bg-gray-700 text-xs py-1 px-2.5 rounded-full font-bold">{{ ordenesPreparacion.length }}</span>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              <div 
                v-for="orden in ordenesPreparacion" 
                :key="orden.id"
                @click="abrirOrden(orden)"
                class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all text-gray-800 dark:text-gray-200"
              >
                <div class="flex items-center gap-2 mb-3">
                  <span class="font-bold text-sm">{{ orden.id }}</span>
                  <div class="flex flex-1 items-center gap-1 text-sm font-medium truncate">
                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                    <span class="truncate">{{ orden.cliente }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <span class="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-[11px] px-3 py-1 rounded-full font-semibold">Preparando</span>
                </div>
                <div class="space-y-3 mt-2">
                  <div v-for="(item, idx) in orden.items" :key="idx" class="text-sm">
                    <div class="flex items-start text-gray-800 dark:text-gray-200 leading-tight">
                      <span class="w-6 text-gray-500 font-mono text-xs pt-0.5">{{ item.cantidad }}x</span>
                      <span class="font-medium flex-1">{{ item.producto }}</span>
                    </div>
                    <div v-if="item.extras?.length" class="pl-6 text-[11px] text-gray-500 mt-1">
                      - Extras : {{ item.extras.join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna: Listos -->
          <div class="w-80 flex flex-col max-h-full bg-gray-100 dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800 flex justify-between items-center">
              <h3 class="font-bold text-gray-700 dark:text-gray-200">3. Listas para Pago</h3>
              <span class="bg-gray-200 dark:bg-gray-700 text-xs py-1 px-2.5 rounded-full font-bold">{{ ordenesListas.length }}</span>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              <div 
                v-for="orden in ordenesListas" 
                :key="orden.id"
                @click="abrirOrden(orden)"
                class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all text-gray-800 dark:text-gray-200"
              >
                <div class="flex items-center gap-2 mb-3">
                  <span class="font-bold text-sm">{{ orden.id }}</span>
                  <div class="flex flex-1 items-center gap-1 text-sm font-medium truncate">
                    <svg class="w-4 h-4 text-gray-800 dark:text-gray-200 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                    <span class="truncate">{{ orden.cliente }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <span class="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-[11px] px-3 py-1 rounded-full font-semibold">Esperando Pago</span>
                </div>
                <div class="space-y-3 mt-2">
                  <div v-for="(item, idx) in orden.items" :key="idx" class="text-sm">
                    <div class="flex items-start text-gray-800 dark:text-gray-200 leading-tight">
                      <span class="w-6 text-gray-500 font-mono text-xs pt-0.5">{{ item.cantidad }}x</span>
                      <span class="font-medium flex-1">{{ item.producto }}</span>
                    </div>
                    <div v-if="item.extras?.length" class="pl-6 text-[11px] text-gray-500 mt-1">
                      - Extras : {{ item.extras.join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL DETALLE DE ORDEN -->
    <div v-if="showModal && ordenSeleccionada" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white/90">Orden {{ ordenSeleccionada.id }}</h2>
            <p class="text-sm text-gray-500">{{ ordenSeleccionada.origen }} • {{ ordenSeleccionada.cliente }}</p>
          </div>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <h3 class="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Artículos del Pedido</h3>
          <div class="space-y-3">
            <div v-for="(item, idx) in ordenSeleccionada.items" :key="idx" class="flex justify-between items-start text-sm">
              <div class="flex gap-3">
                <span class="font-bold text-gray-800 dark:text-gray-200 w-5">{{ item.cantidad }}x</span>
                <div>
                  <p class="font-medium text-gray-700 dark:text-gray-300">{{ item.producto }}</p>
                  <p v-if="item.extras?.length" class="text-xs text-gray-500 mt-0.5">+ {{ item.extras.join(', ') }}</p>
                </div>
              </div>
              <span class="font-medium text-gray-600 dark:text-gray-400">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-800 mt-4 pt-4 flex justify-between items-center">
            <span class="font-bold text-gray-600 dark:text-gray-400">Total Aproximado</span>
            <span class="text-xl font-black text-brand-500">${{ calcularTotalOrden.toFixed(2) }}</span>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex gap-3 justify-end">
          <button @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Cerrar
          </button>
          
          <!-- Botón de acción dinámica según el estado -->
          <button 
            v-if="ordenSeleccionada.estado === 'recibido'"
            @click="ejecutarAccion(ordenSeleccionada, 'preparacion')" 
            class="px-4 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 shadow-sm"
          >
            Aceptar y Preparar
          </button>
          
          <button 
            v-else-if="ordenSeleccionada.estado === 'preparacion'"
            @click="ejecutarAccion(ordenSeleccionada, 'listo')" 
            class="px-4 py-2 text-sm font-bold text-white bg-warning-500 border border-transparent rounded-lg hover:bg-warning-600 shadow-sm"
          >
            Orden Lista
          </button>

          <button 
            v-else-if="ordenSeleccionada.estado === 'listo'"
            @click="irACobrar(ordenSeleccionada)" 
            class="px-4 py-2 flex items-center gap-2 text-sm font-bold text-white bg-success-500 border border-transparent rounded-lg hover:bg-success-600 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Pasar a Caja (POS)
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useOrdenes, type OrdenRemota, type EstadoOrden } from '@/composables/useOrdenes'

const router = useRouter()
const { ordenes, cambiarEstado } = useOrdenes()

const ordenesRecibidas = computed(() => ordenes.value.filter(o => o.estado === 'recibido'))
const ordenesPreparacion = computed(() => ordenes.value.filter(o => o.estado === 'preparacion'))
const ordenesListas = computed(() => ordenes.value.filter(o => o.estado === 'listo'))

const showModal = ref(false)
const ordenSeleccionada = ref<OrdenRemota | null>(null)

const calcularTotalOrden = computed(() => {
  if (!ordenSeleccionada.value) return 0
  return ordenSeleccionada.value.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
})

const abrirOrden = (orden: OrdenRemota) => {
  ordenSeleccionada.value = orden
  showModal.value = true
}

const ejecutarAccion = (orden: OrdenRemota, nuevoEstado: EstadoOrden) => {
  cambiarEstado(orden.id, nuevoEstado)
  showModal.value = false
}

const irACobrar = (orden: OrdenRemota) => {
  showModal.value = false
  router.push({ path: '/caja/pos', query: { orden_remota: orden.id } })
}
</script>

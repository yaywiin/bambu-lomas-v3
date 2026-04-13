<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Inventario</h1>
      </div>

      <!-- Error banner -->
      <div v-if="apiError" class="flex items-center gap-3 rounded-lg border border-error-200 bg-error-50 px-4 py-3 dark:border-error-500/20 dark:bg-error-500/10">
        <svg class="w-5 h-5 text-error-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p class="text-sm text-error-700 dark:text-error-400">{{ apiError }}</p>
      </div>

      <!-- Tabla -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Producto</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Tipo</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Existencia</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Costo Promedio</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">U/M</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Última Compra</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <!-- Skeleton loading -->
              <tr v-if="loading" v-for="i in 4" :key="`sk-${i}`">
                <td v-for="j in 6" :key="j" class="px-5 py-4 sm:px-6">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>

              <!-- Filas reales -->
              <tr
                v-else
                v-for="item in inventario"
                :key="item.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm font-medium dark:text-white/90">{{ item.producto }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="{
                      'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400': item.tipo === 'Insumo',
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': item.tipo !== 'Insumo'
                    }"
                  >{{ item.tipo }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p
                    class="text-sm font-medium"
                    :class="Number(item.existencia) < 10
                      ? 'text-error-500 dark:text-error-400'
                      : 'text-gray-800 dark:text-white/90'"
                  >
                    {{ Number(item.existencia).toLocaleString('es-GT', { maximumFractionDigits: 2 }) }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm font-medium dark:text-white/90">
                    {{ Number(item.costo_promedio).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-sm dark:text-gray-400">{{ item.u_m }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-sm dark:text-gray-400">{{ formatFecha(item.ultima_compra) }}</p>
                </td>
              </tr>

              <tr v-if="!loading && inventario.length === 0">
                <td colspan="6" class="px-5 py-10 text-center sm:px-6">
                  <div class="flex flex-col items-center gap-2">
                    <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-sm text-gray-500 dark:text-gray-400">No hay registros de inventario.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useInventario, type InventarioItem } from '@/composables/useInventario'

const { getInventario } = useInventario()

// ── Estado ─────────────────────────────────────────────────────
const inventario = ref<InventarioItem[]>([])
const loading    = ref(false)
const apiError   = ref('')

const loadInventario = async () => {
  loading.value  = true
  apiError.value = ''
  try {
    inventario.value = await getInventario()
  } catch (err: any) {
    apiError.value = `No se pudo conectar a la API: ${err.message}`
  } finally {
    loading.value = false
  }
}
onMounted(loadInventario)

// ── Formatters ─────────────────────────────────────────────────
const formatFecha = (fecha: string) => {
  if (!fecha) return '-'
  const f = fecha.toString().substring(0, 10)
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}
</script>

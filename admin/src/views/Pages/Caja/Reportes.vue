<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-800 dark:text-white/90 sm:text-2xl">
            Corte de Caja
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ isAdministrativo ? 'Viendo el corte global de todos los usuarios.' : `Viendo tu corte de ventas personal.` }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">Total Recaudado:</span>
          <span class="text-xl font-black text-brand-500">${{ totalVentas.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Métodos de pago (Resumen) -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Efectivo</p>
          <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">${{ totalPorMetodo('Efectivo').toFixed(2) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tarjeta</p>
          <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">${{ totalPorMetodo('Tarjeta').toFixed(2) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Transferencia</p>
          <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">${{ totalPorMetodo('Transferencia').toFixed(2) }}</p>
        </div>
      </div>

      <!-- Desglose por Cajero (Solo si es administrativo) -->
      <div v-if="isAdministrativo && desglosePorCajero.length > 0" class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 class="font-bold text-gray-800 dark:text-white/90 mb-4">Ingresos por Cajero</h3>
        <div class="space-y-3">
          <div v-for="cajero in desglosePorCajero" :key="cajero.nombre" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{{ cajero.nombre }}</span>
            <span class="text-sm font-bold text-gray-800 dark:text-white/90">${{ cajero.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Lista de Ventas Aplicables -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 class="font-bold text-gray-800 dark:text-white/90">Registro de Transacciones</h3>
        </div>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th class="px-5 py-3 text-left">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400"># Orden</p>
                </th>
                <th class="px-5 py-3 text-left">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Hora</p>
                </th>
                <th v-if="isAdministrativo" class="px-5 py-3 text-left">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Atendió</p>
                </th>
                <th class="px-5 py-3 text-left">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Método</p>
                </th>
                <th class="px-5 py-3 text-right">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Total</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="venta in ventasFiltradas" :key="venta.orden" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-5 py-4">
                  <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ venta.orden }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <p class="text-gray-500 text-sm dark:text-gray-400">{{ venta.horaPedido }}</p>
                </td>
                <td v-if="isAdministrativo" class="px-5 py-4">
                  <p class="text-gray-800 text-sm capitalize dark:text-white/90">{{ venta.cajero }}</p>
                </td>
                <td class="px-5 py-4">
                  <p class="text-gray-800 text-sm dark:text-white/90">{{ venta.formaPago }}</p>
                </td>
                <td class="px-5 py-4 text-right">
                  <p class="text-gray-800 text-sm font-medium dark:text-white/90">
                    ${{ venta.total.toFixed(2) }}
                  </p>
                </td>
              </tr>
              <tr v-if="ventasFiltradas.length === 0">
                <td :colspan="isAdministrativo ? 5 : 4" class="px-5 py-10 text-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400">No hay ventas registradas en el momento.</p>
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
import { computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { useVentas } from '@/composables/useVentas'

const { currentUser } = useAuth()
const { ventas, cargarVentas } = useVentas()

const isAdministrativo = computed(() => currentUser.value?.rol?.toLowerCase() === 'administrativo')

onMounted(() => {
  // Administrativo carga todo; los demás solo su propio corte
  if (isAdministrativo.value) {
    cargarVentas()
  } else {
    const cajero = currentUser.value?.usuario || currentUser.value?.nombre || ''
    cargarVentas(cajero)
  }
})

// Ventas dependiendo del rol
const ventasFiltradas = computed(() => {
  if (isAdministrativo.value) {
    return ventas.value
  }
  return ventas.value.filter(v => v.cajero === currentUser.value?.usuario || v.cajero === currentUser.value?.nombre)
})

// Cálculos
const totalVentas = computed(() => ventasFiltradas.value.reduce((acc, v) => acc + v.total, 0))

const totalPorMetodo = (metodo: string) => {
  return ventasFiltradas.value
    .filter(v => v.formaPago?.toLowerCase() === metodo.toLowerCase())
    .reduce((acc, v) => acc + v.total, 0)
}

// Desglose por cajero
const desglosePorCajero = computed(() => {
  const map: Record<string, number> = {}
  ventasFiltradas.value.forEach(v => {
    const cajero = v.cajero || 'Desconocido'
    map[cajero] = (map[cajero] || 0) + v.total
  })
  
  return Object.keys(map).map(nombre => ({
    nombre,
    total: map[nombre]
  })).sort((a, b) => b.total - a.total)
})

</script>

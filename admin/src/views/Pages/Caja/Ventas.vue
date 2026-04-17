<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      
      <!-- Page header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Ventas</h1>
        
        <!-- Search -->
        <div class="relative w-full sm:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar orden, cliente o fecha..."
            class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <!-- Tabla -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400"># Orden</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Cliente</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Fecha</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Total</p>
                </th>
                <th class="px-5 py-3 text-right sm:px-6 w-32">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="venta in ventasFiltradas"
                :key="venta.orden"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-5 py-4 sm:px-6">
                  <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ venta.orden }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm dark:text-white/90">{{ venta.cliente }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-sm dark:text-gray-400">{{ venta.fecha }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm font-medium dark:text-white/90">
                    {{ Number(venta.total).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6 flex justify-end gap-2">
                  <button @click="verVenta(venta)" class="text-gray-500 hover:text-brand-500 transition-colors" title="Ver">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="ventasFiltradas.length === 0">
                <td colspan="5" class="px-5 py-10 text-center sm:px-6">
                  <div class="flex flex-col items-center gap-2">
                    <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-sm text-gray-500 dark:text-gray-400">No hay ventas registradas.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL: TICKET DE VENTA -->
    <div v-if="showModal && ventaSeleccionada" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <!-- Contenedor con aspecto de Ticket de compra -->
      <div class="bg-gray-50 rounded-lg shadow-2xl w-full max-w-sm overflow-hidden relative border border-gray-300 animate-in fade-in zoom-in duration-200 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        <!-- Borde dentado superior (opcional, simulado con CSS) -->
        <div class="h-3 w-full" style="background-image: radial-gradient(circle at 10px 0, transparent 10px, #f9fafb 11px); background-size: 20px 20px; background-position: -10px -10px;"></div>

        <!-- Contenido del Ticket -->
        <div class="px-6 py-4 font-mono text-gray-800 text-sm bg-gray-50 print:bg-white">
          
          <!-- Encabezado del ticket -->
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold tracking-widest uppercase mb-1">Bambú Lomas</h2>
            <div class="mt-2 text-xs">
              <p>Orden: <span class="font-bold text-base">{{ ventaSeleccionada.orden }}</span></p>
            </div>
          </div>

          <div class="border-t-2 border-dashed border-gray-300 my-4"></div>

          <!-- Detalles de tiempos y personas -->
          <div class="space-y-1 mb-4 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">Cliente:</span> <span class="font-bold">{{ ventaSeleccionada.cliente }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Fecha:</span> <span>{{ ventaSeleccionada.fecha }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Hora Pedido:</span> <span>{{ ventaSeleccionada.horaPedido }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Hora Entrega:</span> <span>{{ ventaSeleccionada.horaEntrega }}</span></div>
          </div>

          <div class="border-t-2 border-dashed border-gray-300 my-4"></div>

          <!-- Lista de Items -->
          <div class="mb-4">
            <div class="flex justify-between font-bold text-xs mb-2">
              <span>CANT DESC</span>
              <span>IMPORTE</span>
            </div>
            
            <div 
              v-for="(item, i) in ventaSeleccionada.items" 
              :key="i"
              class="flex justify-between items-start mb-2 text-xs"
            >
              <div class="flex gap-2 flex-1 pr-2">
                <span class="w-4 text-center shrink-0">{{ item.cantidad }}</span>
                <span class="break-words">{{ item.descripcion }}</span>
              </div>
              <span class="font-medium shrink-0 pt-0.5">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t-2 border-dashed border-gray-300 my-4"></div>

          <!-- Totales y Pago -->
          <div class="space-y-1 text-sm">
            <div class="flex justify-between font-black text-base">
              <span>TOTAL</span>
              <span>${{ ventaSeleccionada.total.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs mt-2">
              <span class="text-gray-500">Forma de pago:</span>
              <span class="font-bold uppercase">{{ ventaSeleccionada.formaPago }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Lo atendió:</span>
              <span class="uppercase">{{ ventaSeleccionada.cajero }}</span>
            </div>
          </div>

          <!-- Omitimos el footer del ticket a petición -->

        </div>

        <!-- Borde dentado inferior -->
        <div class="h-3 w-full print:hidden" style="background-image: radial-gradient(circle at 10px 10px, transparent 10px, #f9fafb 11px); background-size: 20px 20px; background-position: -10px 0;"></div>

        <!-- Botón cerrar (Oculto en impresión por si en el futuro imprimen) -->
        <div class="p-4 bg-gray-50 flex border-t border-gray-200 print:hidden">
          <button @click="showModal = false" class="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors">
            Cerrar
          </button>
        </div>

      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useVentas, type Venta } from '@/composables/useVentas'

const { ventas, cargarVentas } = useVentas()
onMounted(() => cargarVentas())

const searchQuery = ref('')

const ventasFiltradas = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return ventas.value

  return ventas.value.filter(venta => 
    venta.orden.toLowerCase().includes(query) ||
    venta.cliente.toLowerCase().includes(query) ||
    venta.fecha.toLowerCase().includes(query)
  )
})

// --- Botones y Estado del Modal
const showModal = ref(false)
const ventaSeleccionada = ref<Venta | null>(null)

const verVenta = (venta: Venta) => {
  ventaSeleccionada.value = venta
  showModal.value = true
}
</script>

<style scoped>
/* Para ocultar botones al imprimir, asumiendo una futura función de print() */
@media print {
  .print\:hidden {
    display: none !important;
  }
  .print\:border-none {
    border: none !important;
  }
  .print\:shadow-none {
    box-shadow: none !important;
  }
  .print\:w-full {
    width: 100% !important;
  }
  .print\:max-w-none {
    max-width: none !important;
  }
  .print\:bg-white {
    background-color: white !important;
  }
}
</style>

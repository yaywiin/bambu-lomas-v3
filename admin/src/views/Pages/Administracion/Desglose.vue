<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">

      <!-- Back button & Title -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <router-link to="/admin/compras" class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Desglose de Compra</h1>
        </div>
      </div>

      <!-- Error banner -->
      <div v-if="apiError" class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p class="text-sm text-red-700 dark:text-red-400">{{ apiError }}</p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingCompra" class="animate-pulse space-y-6">
        <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>

      <!-- Not found -->
      <div v-else-if="!compra" class="flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Compra no encontrada</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1">El ticket especificado no existe o ha sido eliminado.</p>
      </div>

      <template v-else>

        <!-- ============== CARD 1: HEADER ============== -->
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white">Información General</h2>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Ticket</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">#{{ compra.id }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Proveedor</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ compra.proveedor }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Fecha de Compra</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatFecha(compra.fecha_compra) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total del Ticket</p>
              <p class="text-lg font-bold text-brand-600 dark:text-brand-400">
                ${{ Number(compra.total).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </p>
            </div>
          </div>
        </div>

        <!-- ============== CARD 2: RENGLONES ============== -->
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white">Registrar</h2>
          </div>

          <!-- Form -->
          <form @submit.prevent="addRenglon" class="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">

              <!-- Producto -->
              <div class="sm:col-span-2 xl:col-span-2 relative">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Producto</label>
                <input
                  type="text"
                  v-model="formData.producto"
                  required
                  autocomplete="off"
                  @focus="showSuggestions = true"
                  @blur="handleBlurSuggestions"
                  placeholder="Descripción del producto..."
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                />
                
                <!-- Suggestions Dropdown -->
                <div 
                  v-if="showSuggestions && filteredProducts.length > 0" 
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-60 overflow-y-auto"
                >
                  <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li 
                      v-for="item in filteredProducts" 
                      :key="item.producto"
                      @mousedown.prevent="selectProduct(item)"
                      class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <span class="font-medium text-gray-900 dark:text-white">{{ item.producto }}</span>
                      <span class="text-xs text-gray-500">{{ item.tipo }} • {{ item.u_m }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Tipo de producto -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                <select
                  v-model="formData.tipo_producto"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="" disabled>Seleccionar...</option>
                  <option>Insumo</option>
                  <option>Desechable</option>
                  <option>Limpieza</option>
                  <option>Terminado</option>
                </select>
              </div>

              <!-- Unidad de medida -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Unidad</label>
                <select
                  v-model="formData.unidad_medida"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="" disabled>Seleccionar...</option>
                  <option>Kilos</option>
                  <option>Gramos</option>
                  <option>Litros</option>
                  <option>Mililitros</option>
                  <option>Piezas</option>
                </select>
              </div>

              <!-- Cantidad -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                <input
                  type="number"
                  v-model.number="formData.cantidad"
                  required
                  step="0.001"
                  min="0"
                  placeholder="0.000"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                />
              </div>

              <!-- Precio Unitario -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">P. Unitario ($)</label>
                <input
                  type="number"
                  v-model.number="formData.precio_unitario"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                />
              </div>

              <!-- Descuento -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Descuento ($)</label>
                <input
                  type="number"
                  v-model.number="formData.descuento"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                />
              </div>

              <!-- Precio Total (auto) -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total ($)
                  <span class="ml-1 text-xs font-normal text-gray-400">auto</span>
                </label>
                <input
                  type="number"
                  v-model.number="formData.total"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                />
              </div>

              <!-- Submit -->
              <div class="sm:col-span-2 xl:col-span-2 flex items-end">
                <button
                  type="submit"
                  :disabled="saving"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar renglón
                </button>
              </div>

            </div>

            <p v-if="formError" class="mt-3 text-xs text-red-500">{{ formError }}</p>
          </form>

          <!-- Tabla de renglones -->
          <div class="overflow-hidden">
            <!-- Loading renglones skeleton -->
            <div v-if="loadingRenglones" class="p-8 flex justify-center">
              <svg class="w-6 h-6 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>

            <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/10">
                    <th class="px-5 py-3 text-left"><p class="font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">Producto</p></th>
                    <th class="px-5 py-3 text-left"><p class="font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">Tipo</p></th>
                    <th class="px-5 py-3 text-right"><p class="font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">Cant / U.M.</p></th>
                    <th class="px-5 py-3 text-right"><p class="font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">P. Unit.</p></th>
                    <th class="px-5 py-3 text-right"><p class="font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">Descuento</p></th>
                    <th class="px-5 py-3 text-right"><p class="font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400">Total</p></th>
                    <th class="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
                  <!-- Empty state -->
                  <tr v-if="renglones.length === 0">
                    <td colspan="7" class="px-5 py-10 text-center">
                      <div class="flex flex-col items-center gap-2">
                        <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Aún no hay renglones registrados.</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Rows -->
                  <tr
                    v-for="(renglon, idx) in renglones"
                    :key="renglon.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td class="px-5 py-3 max-w-xs">
                      <p class="text-sm text-gray-800 dark:text-white/90 break-words whitespace-pre-wrap">{{ renglon.producto }}</p>
                    </td>
                    <td class="px-5 py-3">
                      <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                        :class="{
                          'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400': renglon.tipo_producto === 'Insumo',
                          'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400': renglon.tipo_producto === 'Desechable',
                          'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400': renglon.tipo_producto === 'Limpieza',
                          'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400': renglon.tipo_producto === 'Terminado',
                        }"
                      >{{ renglon.tipo_producto }}</span>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <p class="text-sm text-gray-800 dark:text-white/90">
                        {{ Number(renglon.cantidad).toLocaleString('es-GT', { maximumFractionDigits: 3 }) }}
                        <span class="text-gray-500 text-xs ml-1">{{ renglon.unidad_medida }}</span>
                      </p>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <p class="text-sm text-gray-800 dark:text-white/90">${{ Number(renglon.precio_unitario).toFixed(2) }}</p>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ Number(renglon.descuento) > 0 ? `$${Number(renglon.descuento).toFixed(2)}` : '—' }}
                      </p>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <p class="text-sm font-semibold text-brand-600 dark:text-brand-400">${{ Number(renglon.total).toFixed(2) }}</p>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <button
                        @click="deleteRenglon(renglon.id)"
                        :disabled="deletingId === renglon.id"
                        class="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Eliminar renglón"
                      >
                        <svg v-if="deletingId !== renglon.id" class="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <svg v-else class="w-4 h-4 animate-spin ml-auto" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals footer -->
            <div v-if="renglones.length > 0" class="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 px-6 py-4">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ renglones.length }} renglón{{ renglones.length !== 1 ? 'es' : '' }} registrado{{ renglones.length !== 1 ? 's' : '' }}
                </p>
                <p class="text-base font-bold text-gray-900 dark:text-white">
                  Total acumulado:
                  <span class="text-brand-600 dark:text-brand-400 ml-1">
                    ${{ renglones.reduce((s, r) => s + Number(r.total), 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>

      </template>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCompras, type Compra, type Renglon } from '@/composables/useCompras'
import { useInventario, type InventarioItem } from '@/composables/useInventario'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const { getCompra, getRenglones, crearRenglon, eliminarRenglon } = useCompras()
const { getInventario } = useInventario()

// ── Estado ──────────────────────────────────────────────────
const compraId      = ref<number>(Number(route.params.id))
const compra        = ref<Compra | null>(null)
const renglones     = ref<Renglon[]>([])
const loadingCompra = ref(true)
const loadingRenglones = ref(true)
const saving        = ref(false)
const deletingId    = ref<number | null>(null)
const apiError      = ref('')
const formError     = ref('')

// ── Autocomplete ────────────────────────────────────────────
const inventarioItems = ref<InventarioItem[]>([])
const showSuggestions = ref(false)

const filteredProducts = computed(() => {
  const query = formData.producto.toLowerCase().trim()
  if (!query) return []
  return inventarioItems.value.filter(item => 
    item.producto.toLowerCase().includes(query)
  ).slice(0, 8)
})

const selectProduct = (item: InventarioItem) => {
  formData.producto = item.producto
  formData.tipo_producto = item.tipo as any
  formData.unidad_medida = item.u_m as any
  if (item.costo_promedio) formData.precio_unitario = item.costo_promedio
  showSuggestions.value = false
}

const handleBlurSuggestions = () => {
  showSuggestions.value = false
}

// ── Form ────────────────────────────────────────────────────
const formData = reactive({
  producto: '',
  tipo_producto: '',
  cantidad: null as number | null,
  unidad_medida: '',
  precio_unitario: null as number | null,
  descuento: null as number | null,
  total: null as number | null,
})

// Auto-calcular total cuando cambian campos relevantes
watch(
  () => [formData.cantidad, formData.precio_unitario, formData.descuento],
  ([qty, pu, desc]) => {
    if (qty !== null && pu !== null && qty >= 0 && pu >= 0) {
      const raw = Number(qty) * Number(pu)
      const descuento = desc ? Number(desc) : 0
      formData.total = Number((raw - descuento).toFixed(2))
    }
  }
)

const resetForm = () => {
  formData.producto       = ''
  formData.tipo_producto  = ''
  formData.cantidad       = null
  formData.unidad_medida  = ''
  formData.precio_unitario = null
  formData.descuento      = null
  formData.total          = null
  formError.value         = ''
}

// ── CRUD Renglones ──────────────────────────────────────────
const addRenglon = async () => {
  if (
    !formData.producto ||
    !formData.tipo_producto ||
    !formData.unidad_medida ||
    formData.cantidad === null ||
    formData.precio_unitario === null ||
    formData.total === null
  ) {
    formError.value = 'Por favor completa todos los campos requeridos.'
    return
  }

  formError.value = ''
  saving.value = true
  try {
    const nuevo = await crearRenglon(compraId.value, {
      producto:       formData.producto,
      tipo_producto:  formData.tipo_producto,
      unidad_medida:  formData.unidad_medida,
      cantidad:       formData.cantidad,
      precio_unitario: formData.precio_unitario,
      descuento:      formData.descuento || 0,
      total:          formData.total,
    })
    renglones.value.push(nuevo)
    resetForm()
  } catch (err: any) {
    formError.value = err.message || 'Error al guardar el renglón'
  } finally {
    saving.value = false
  }
}

const deleteRenglon = async (id: number) => {
  deletingId.value = id
  try {
    await eliminarRenglon(compraId.value, id)
    renglones.value = renglones.value.filter(r => r.id !== id)
  } catch (err: any) {
    apiError.value = err.message || 'Error al eliminar el renglón'
  } finally {
    deletingId.value = null
  }
}

// ── Formatters ──────────────────────────────────────────────
const formatFecha = (fecha: string | undefined) => {
  if (!fecha) return '-'
  const f = fecha.toString().substring(0, 10)
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}

// ── Mount ───────────────────────────────────────────────────
onMounted(async () => {
  // Cargar cabecera de la compra
  try {
    compra.value = await getCompra(compraId.value)
  } catch (e: any) {
    apiError.value = 'No se pudo cargar la información del ticket.'
  } finally {
    loadingCompra.value = false
  }

  // Cargar renglones existentes
  try {
    renglones.value = await getRenglones(compraId.value)
  } catch (e: any) {
    // No mostramos error crítico si falla el listado de renglones
    console.error('Error cargando renglones:', e)
  } finally {
    loadingRenglones.value = false
  }

  // Cargar catálogo de inventario para sugerencias
  try {
    inventarioItems.value = await getInventario()
  } catch (e: any) {
    console.error('Error cargando inventario para autocompletado:', e)
  }
})
</script>

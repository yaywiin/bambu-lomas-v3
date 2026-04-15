<template>
  <AdminLayout>
    <div class="h-[calc(100vh-100px)] flex flex-col p-4 md:p-8 space-y-6">
      
      <!-- ================= VISTA: LISTA DE RECETAS ================= -->
      <template v-if="viewMode === 'lista'">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Recetas</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Administración de recetario y costeo de insumos</p>
          </div>
          <button 
            @click="abrirNuevaReceta"
            class="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-md shadow-brand-500/30 transition-all active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Agregar Nuevo
          </button>
        </div>

        <!-- Error Banner -->
        <div v-if="apiError" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          {{ apiError }}
        </div>

        <!-- Main Table -->
        <div class="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col">
          <!-- Loading -->
          <div v-if="loading" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          </div>
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar flex-1">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th class="px-5 py-3 text-left sm:px-6 w-1/3">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Nombre</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6 w-1/4">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Último Costo Real</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6 w-1/4">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Fecha de Alta</p>
                  </th>
                  <th class="px-5 py-3 text-center sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Acciones</p>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                
                <tr v-for="receta in recetas" :key="receta.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ receta.nombre }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      ${{ Number(receta.costo).toFixed(2) }}
                    </span>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatFecha(receta.created_at) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <div class="flex items-center justify-center gap-3">
                      <button @click="verReceta(receta)" class="text-gray-400 hover:text-brand-500 transition-colors tooltip" title="Ver detalle">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button @click="editarReceta(receta)" class="text-gray-400 hover:text-amber-500 transition-colors tooltip" title="Editar receta">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button @click="borrarReceta(receta)" class="text-gray-400 hover:text-red-500 transition-colors tooltip" title="Borrar receta">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="recetas.length === 0">
                  <td colspan="4" class="px-6 py-20 text-center">
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <span class="text-lg font-medium text-gray-600 dark:text-gray-300">No hay recetas registradas todavía</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ================= VISTA: NUEVA / EDITAR / VER RECETA ================= -->
      <template v-if="['nueva', 'editar', 'ver'].includes(viewMode)">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <div class="flex items-center gap-3">
            <button @click="cerrarVista" class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">
              <template v-if="viewMode === 'nueva'">Construir Receta</template>
              <template v-else-if="viewMode === 'editar'">Editando: {{ busquedaReceta }}</template>
              <template v-else>Receta: {{ busquedaReceta }}</template>
            </h1>
          </div>
          <button 
            v-if="viewMode !== 'ver'"
            @click="guardarInstanciaReceta" 
            :disabled="saving"
            class="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
          >
            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            {{ saving ? 'Guardando...' : (viewMode === 'nueva' ? 'Guardar Receta' : 'Aplicar Cambios') }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-12 pr-2">
          <!-- CARD 1: Nombre de Receta -->
          <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 p-6">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Receta</label>
            <div class="relative w-full md:w-1/2">
              <input
                type="text"
                v-model="busquedaReceta"
                :disabled="viewMode !== 'nueva'"
                placeholder="Ej. Frappé Cookies & Cream..."
                :class="[
                  'w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 dark:text-white transition-colors',
                  viewMode !== 'nueva' 
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700' 
                    : 'border-gray-300 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800'
                ]"
              />
            </div>
          </div>

          <!-- CARD 2: Ingredientes (Desglose) -->
          <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
              <h2 class="text-base font-semibold text-gray-800 dark:text-white">Ingredientes (Desglose)</h2>
            </div>

            <!-- Formulario de Ingrediente (Oculto en vista de Visualización) -->
            <form v-if="viewMode !== 'ver'" @submit.prevent="agregarIngrediente" class="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                
                <!-- Buscador Insumo -->
                <div class="lg:col-span-2 relative">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Insumo</label>
                  <input
                    type="text"
                    v-model="formIngrediente.producto"
                    @focus="showSugerenciasInsumo = true"
                    @blur="hideSugerenciasInsumo"
                    required
                    autocomplete="off"
                    placeholder="Buscar insumo..."
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  
                  <div 
                    v-if="showSugerenciasInsumo && inventarioFiltradoInsumo.length > 0" 
                    class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
                  >
                    <ul class="max-h-48 overflow-y-auto custom-scrollbar">
                      <li 
                        v-for="item in inventarioFiltradoInsumo" 
                        :key="item.producto"
                        @mousedown.prevent="seleccionarInsumo(item)"
                        class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                      >
                        <span class="font-medium text-gray-900 dark:text-white text-sm">{{ item.producto }}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ item.u_m }}</span>
                          <span class="text-xs text-brand-500 font-semibold">${{ Number(item.costo_promedio).toFixed(2) }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Unidad -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Unidad uso</label>
                  <select
                    v-model="formIngrediente.unidad"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option>Gramos (g)</option>
                    <option>Mililitros (ml)</option>
                    <option>Piezas (pz)</option>
                  </select>
                </div>

                <!-- Cantidad -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                  <input
                    type="number"
                    v-model.number="formIngrediente.cantidad"
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <!-- Botón Agregar -->
                <div>
                  <button type="submit" class="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white rounded-lg font-bold shadow-sm transition-all focus:ring-2 focus:ring-gray-900/20 active:scale-95 flex justify-center items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Añadir
                  </button>
                </div>
              </div>
            </form>

            <!-- Tabla de Ingredientes Agregados -->
            <div class="overflow-x-auto custom-scrollbar">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th class="px-5 py-3 text-left sm:px-6">
                      <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Insumo</p>
                    </th>
                    <th class="px-5 py-3 text-center sm:px-6">
                      <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Unidad</p>
                    </th>
                    <th class="px-5 py-3 text-center sm:px-6">
                      <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Cantidad</p>
                    </th>
                    <th class="px-5 py-3 text-right sm:px-6">
                      <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Costo Estimado</p>
                    </th>
                    <th class="px-5 py-3 text-center w-16" v-if="viewMode !== 'ver'">
                      <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Acciones</p>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
                  <tr v-for="(ing, idx) in ingredientesLista" :key="idx" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td class="px-5 py-4 sm:px-6">
                      <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ ing.producto }}</p>
                    </td>
                    <td class="px-5 py-4 sm:px-6 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        {{ ing.unidad }}
                      </span>
                    </td>
                    <td class="px-5 py-4 sm:px-6 text-center">
                      <p class="text-sm text-gray-800 dark:text-white/90 font-medium">{{ ing.cantidad }}</p>
                    </td>
                    <td class="px-5 py-4 sm:px-6 text-right">
                      <p class="text-sm text-brand-600 dark:text-brand-400 font-medium">${{ Number(ing.costo_calculado).toFixed(2) }}</p>
                    </td>
                    <td class="px-5 py-4 text-center" v-if="viewMode !== 'ver'">
                      <button @click="removerIngrediente(idx)" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remover">
                        <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                  <!-- Empty -->
                  <tr v-if="ingredientesLista.length === 0">
                    <td colspan="5" class="px-6 py-10 text-center text-gray-400 text-sm">
                      Aún no has agregado insumos a esta receta.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer con totales -->
            <div class="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-6 py-5 flex justify-between items-center">
              <span class="text-sm font-medium text-gray-500">Total de Costo de Receta:</span>
              <span class="text-xl font-black text-brand-600 dark:text-brand-500">${{ costoTotalReceta.toFixed(2) }}</span>
            </div>
            
          </div>
        </div>
      </template>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useInventario, type InventarioItem } from '@/composables/useInventario'
import { useRecetas, type Receta } from '@/composables/useRecetas'

const { getInventario } = useInventario()
const { getRecetas, getReceta, crearReceta, actualizarReceta, eliminarReceta } = useRecetas()

// ── Estado General ─────────────────────────────────────────
const viewMode   = ref<'lista'|'nueva'|'editar'|'ver'>('lista')
const recetas    = ref<Receta[]>([])
const loading    = ref(false)
const saving     = ref(false)
const apiError   = ref('')
const recetaEditando = ref<Receta | null>(null)

// ── Inventario (autocompletado de insumos) ──────────────────
const inventarioData = ref<InventarioItem[]>([])

const cargarDatos = async () => {
  loading.value = true
  apiError.value = ''
  try {
    const [recetasData, invData] = await Promise.all([
      getRecetas(),
      getInventario(),
    ])
    recetas.value = recetasData
    inventarioData.value = invData
  } catch (err: any) {
    apiError.value = err.message || 'Error al cargar datos'
  } finally {
    loading.value = false
  }
}

onMounted(cargarDatos)

// ── Helpers de fecha ────────────────────────────────────────
const formatFecha = (isoStr: string) => {
  if (!isoStr) return '—'
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const d = new Date(isoStr)
  return `${d.getDate()}/${meses[d.getMonth()]}/${d.getFullYear()}`
}

// ── Navegación entre vistas ─────────────────────────────────
const abrirNuevaReceta = () => {
  busquedaReceta.value = ''
  ingredientesLista.value = []
  recetaEditando.value = null
  viewMode.value = 'nueva'
}

const cerrarVista = () => {
  viewMode.value = 'lista'
  recetaEditando.value = null
}

const verReceta = async (receta: Receta) => {
  try {
    const detalle = await getReceta(receta.id)
    if (!detalle) return
    busquedaReceta.value = detalle.nombre
    ingredientesLista.value = [...(detalle.ingredientes || [])]
    recetaEditando.value = detalle
    viewMode.value = 'ver'
  } catch (err: any) {
    alert('Error al cargar la receta: ' + err.message)
  }
}

const editarReceta = async (receta: Receta) => {
  try {
    const detalle = await getReceta(receta.id)
    if (!detalle) return
    busquedaReceta.value = detalle.nombre
    ingredientesLista.value = [...(detalle.ingredientes || [])]
    recetaEditando.value = detalle
    viewMode.value = 'editar'
  } catch (err: any) {
    alert('Error al cargar la receta: ' + err.message)
  }
}

const borrarReceta = async (receta: Receta) => {
  if (!confirm(`¿Eliminar la receta "${receta.nombre}"?`)) return
  try {
    await eliminarReceta(receta.id)
    recetas.value = recetas.value.filter(r => r.id !== receta.id)
  } catch (err: any) {
    alert('Error al eliminar: ' + err.message)
  }
}

// ── Nombre de receta ────────────────────────────────────────
const busquedaReceta = ref('')

// ── Ingredientes ────────────────────────────────────────────
const formIngrediente = reactive({
  producto: '',
  unidad: '',
  cantidad: null as number | null,
  costo_referencia: 0
})

const ingredientesLista = ref<any[]>([])
const showSugerenciasInsumo = ref(false)

const inventarioFiltradoInsumo = computed(() => {
  const q = formIngrediente.producto.toLowerCase().trim()
  if (!q) return []
  return inventarioData.value.filter(i => i.producto.toLowerCase().includes(q)).slice(0, 8)
})

const seleccionarInsumo = (item: InventarioItem) => {
  formIngrediente.producto = item.producto
  formIngrediente.costo_referencia = Number(item.costo_promedio) || 0
  if (item.u_m === 'Kilos')   formIngrediente.unidad = 'Gramos (g)'
  else if (item.u_m === 'Litros') formIngrediente.unidad = 'Mililitros (ml)'
  else formIngrediente.unidad = 'Piezas (pz)'
  showSugerenciasInsumo.value = false
}

const hideSugerenciasInsumo = () => {
  setTimeout(() => { showSugerenciasInsumo.value = false }, 150)
}

const agregarIngrediente = () => {
  if (!formIngrediente.producto || !formIngrediente.unidad || !formIngrediente.cantidad) return

  // Validación estricta: verificar que existe en el inventario
  const itemMatch = inventarioData.value.find(
    item => item.producto.toLowerCase() === formIngrediente.producto.trim().toLowerCase()
  )

  if (!itemMatch) {
    alert("Error: Producto no encontrado en el inventario.")
    return
  }

  // Extraer valores reales por si el usuario lo escribió manualmente sin hacer clic en autocompletar
  const productoReal = itemMatch.producto
  const costoRef = Number(itemMatch.costo_promedio) || 0

  const factor = (formIngrediente.unidad === 'Gramos (g)' || formIngrediente.unidad === 'Mililitros (ml)')
    ? 0.001 : 1

  const costoCalc = formIngrediente.cantidad * costoRef * factor

  ingredientesLista.value.push({
    producto:         productoReal,
    unidad:           formIngrediente.unidad,
    cantidad:         formIngrediente.cantidad,
    costo_calculado:  costoCalc || 0
  })

  formIngrediente.producto        = ''
  formIngrediente.cantidad        = null
  formIngrediente.costo_referencia = 0
}

const removerIngrediente = (index: number) => {
  ingredientesLista.value.splice(index, 1)
}

const costoTotalReceta = computed(() =>
  ingredientesLista.value.reduce((sum, item) => sum + item.costo_calculado, 0)
)

// ── Guardar / Actualizar ────────────────────────────────────
const guardarInstanciaReceta = async () => {
  if (!busquedaReceta.value.trim()) {
    alert('Por favor ingresa un nombre para la receta.')
    return
  }
  if (ingredientesLista.value.length === 0) {
    alert('Por favor agrega al menos un ingrediente.')
    return
  }

  saving.value = true
  try {
    if (viewMode.value === 'editar' && recetaEditando.value) {
      await actualizarReceta(recetaEditando.value.id, ingredientesLista.value)
      // Actualizar la fila local sin recargar todo
      const idx = recetas.value.findIndex(r => r.id === recetaEditando.value!.id)
      if (idx !== -1) recetas.value[idx].costo = costoTotalReceta.value
    } else {
      const nueva = await crearReceta(busquedaReceta.value.trim(), ingredientesLista.value)
      recetas.value.unshift(nueva)
    }
    cerrarVista()
  } catch (err: any) {
    alert('Error al guardar: ' + err.message)
  } finally {
    saving.value = false
  }
}
</script>


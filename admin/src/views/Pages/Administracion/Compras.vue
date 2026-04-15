<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Compras</h1>
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-colors"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Agregar Nuevo
        </button>
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
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Ticket</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Proveedor</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Fecha de Compra</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Total</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Forma de Pago</p>
                </th>
                <th class="px-5 py-3 text-right sm:px-6 w-32">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <!-- Skeleton loading -->
              <tr v-if="loading" v-for="i in 3" :key="`sk-${i}`">
                <td v-for="j in 6" :key="j" class="px-5 py-4 sm:px-6">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>

              <!-- Filas de datos -->
              <tr
                v-else
                v-for="compra in compras"
                :key="compra.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-5 py-4 sm:px-6">
                  <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    #{{ compra.id }}
                  </span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm dark:text-white/90">{{ compra.proveedor }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-sm dark:text-gray-400">{{ formatFecha(compra.fecha_compra) }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm font-medium dark:text-white/90">
                    {{ Number(compra.total).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="{
                      'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400': compra['forma-pago'] === 'Efectivo',
                      'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400': compra['forma-pago'] === 'Tarjeta',
                      'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400': compra['forma-pago'] === 'Transferencia',
                    }"
                  >{{ compra['forma-pago'] }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6 flex justify-end gap-2">
                  <button @click="goToDesglose(compra)" class="text-gray-500 hover:text-green-500 transition-colors" title="Desglose">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button @click="openViewModal(compra)" class="text-gray-500 hover:text-brand-500 transition-colors" title="Ver">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(compra)" class="text-gray-500 hover:text-blue-500 transition-colors" title="Editar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(compra)" class="text-gray-500 hover:text-error-500 transition-colors" title="Borrar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr v-if="!loading && compras.length === 0">
                <td colspan="6" class="px-5 py-10 text-center sm:px-6">
                  <div class="flex flex-col items-center gap-2">
                    <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-sm text-gray-500 dark:text-gray-400">No hay compras registradas.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Modal Agregar / Editar / Ver ───────────────────────────── -->
    <Modal v-if="isModalOpen" :fullScreenBackdrop="true" @close="closeModal">
      <template #body>
        <div class="relative w-full max-w-lg sm:my-8 rounded-xl bg-white shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-50">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              {{ modalMode === 'add' ? 'Nueva Compra' : modalMode === 'edit' ? 'Editar Compra' : 'Detalle de Compra' }}
              <span v-if="modalMode !== 'add' && selectedId" class="ml-2 text-sm font-normal text-gray-400">#{{ selectedId }}</span>
            </h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="space-y-4">

              <!-- Ticket (id manual) -->
              <div v-if="modalMode !== 'view' || selectedId">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ticket <span class="text-xs text-gray-400">(identificador)</span>
                </label>
                <input
                  type="number"
                  v-model.number="formData.ticketId"
                  required
                  :disabled="modalMode !== 'add'"
                  placeholder="Ej. 1001"
                  min="1"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
                <p v-if="ticketDuplicado" class="mt-1 text-xs text-error-500">Este ticket ya existe en la lista.</p>
              </div>

              <!-- Proveedor -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Proveedor</label>
                <input
                  type="text"
                  v-model="formData.proveedor"
                  required
                  :disabled="modalMode === 'view'"
                  placeholder="Nombre del proveedor"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>

              <!-- Fecha & Forma de Pago -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Fecha -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Fecha de Compra</label>
                  <div class="relative">
                    <input
                      ref="fechaInputRef"
                      type="date"
                      v-model="formData.fechaCompra"
                      required
                      :disabled="modalMode === 'view'"
                      class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <button
                      type="button"
                      :disabled="modalMode === 'view'"
                      @click="abrirCalendario"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 transition-colors disabled:pointer-events-none"
                      tabindex="-1"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Forma de Pago -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Forma de Pago</label>
                  <div class="relative">
                    <select
                      v-model="formData.formaPago"
                      required
                      :disabled="modalMode === 'view'"
                      class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    >
                      <option value="" disabled>Seleccionar...</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                    <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                      <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Total</label>
                <input
                  type="number"
                  v-model="formData.total"
                  required
                  :disabled="modalMode === 'view'"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>

              <p v-if="formError" class="text-xs text-error-500">{{ formError }}</p>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 pt-5">
              <button type="button" @click="closeModal"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                {{ modalMode === 'view' ? 'Cerrar' : 'Cancelar' }}
              </button>
              <button v-if="modalMode !== 'view'" type="submit" :disabled="saving || ticketDuplicado"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                {{ modalMode === 'add' ? 'Guardar Compra' : 'Actualizar Compra' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- ── Confirm Delete Modal ─────────────────────────────────── -->
    <Modal v-if="isDeleteModalOpen" :fullScreenBackdrop="true" @close="isDeleteModalOpen = false">
      <template #body>
        <div class="relative w-full max-w-sm sm:my-8 rounded-xl bg-white shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-50 p-6 text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
            <svg class="w-7 h-7 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">¿Eliminar compra?</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Se eliminará el ticket <strong>#{{ compraToDelete?.id }}</strong> de
            <strong>{{ compraToDelete?.proveedor }}</strong>.
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button @click="isDeleteModalOpen = false"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button @click="doDelete" :disabled="saving"
              class="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white hover:bg-error-600 disabled:opacity-50 transition-colors">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import { useCompras, type Compra } from '@/composables/useCompras'

const { getCompras, crearCompra, actualizarCompra, eliminarCompra } = useCompras()

const router = useRouter()
const goToDesglose = (c: Compra) => {
  router.push(`/admin/compras/desglose/${c.id}`)
}

// ── Estado ─────────────────────────────────────────────────────
const compras  = ref<Compra[]>([])
const loading  = ref(false)
const saving   = ref(false)
const apiError = ref('')

const loadCompras = async () => {
  loading.value = true
  apiError.value = ''
  try {
    compras.value = await getCompras()
  } catch (err: any) {
    apiError.value = `No se pudo conectar a la API: ${err.message}`
  } finally {
    loading.value = false
  }
}
onMounted(loadCompras)

// ── Modal ──────────────────────────────────────────────────────
const isModalOpen = ref(false)
const modalMode   = ref<'add' | 'edit' | 'view'>('add')
const selectedId  = ref<number | null>(null)
const formError   = ref('')
const fechaInputRef = ref<HTMLInputElement | null>(null)

const formData = reactive({
  ticketId:    0,
  proveedor:   '',
  fechaCompra: '',
  formaPago:   '',
  total:       0,
})

const resetForm = () => {
  formData.ticketId    = 0
  formData.proveedor   = ''
  formData.fechaCompra = ''
  formData.formaPago   = ''
  formData.total       = 0
  formError.value      = ''
}

const populateForm = (c: Compra) => {
  formData.ticketId    = c.id
  formData.proveedor   = c.proveedor
  // fecha_compra viene como 'YYYY-MM-DD' desde la BD
  formData.fechaCompra = c.fecha_compra ? c.fecha_compra.toString().substring(0, 10) : ''
  formData.formaPago   = c['forma-pago']
  formData.total       = Number(c.total)
  formError.value      = ''
}

// Validar ticket duplicado (solo en modo add)
const ticketDuplicado = computed(() => {
  if (modalMode.value !== 'add' || !formData.ticketId) return false
  return compras.value.some(c => c.id === formData.ticketId)
})

const openAddModal = () => {
  modalMode.value = 'add'
  selectedId.value = null
  resetForm()
  isModalOpen.value = true
}

const openEditModal = (c: Compra) => {
  modalMode.value = 'edit'
  selectedId.value = c.id
  populateForm(c)
  isModalOpen.value = true
}

const openViewModal = (c: Compra) => {
  modalMode.value = 'view'
  selectedId.value = c.id
  populateForm(c)
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const abrirCalendario = () => {
  if (fechaInputRef.value) {
    try { fechaInputRef.value.showPicker() }
    catch { fechaInputRef.value.click() }
  }
}

// ── Submit ─────────────────────────────────────────────────────
const submitForm = async () => {
  if (modalMode.value === 'view') return
  formError.value = ''
  saving.value = true
  try {
    const payload = {
      id:          formData.ticketId,
      proveedor:   formData.proveedor,
      formaPago:   formData.formaPago,
      fechaCompra: formData.fechaCompra,
      total:       Number(formData.total),
    }
    if (modalMode.value === 'add') {
      const nueva = await crearCompra(payload)
      compras.value.unshift(nueva)
    } else if (modalMode.value === 'edit' && selectedId.value) {
      const updated = await actualizarCompra(selectedId.value, payload)
      const idx = compras.value.findIndex(c => c.id === selectedId.value)
      if (idx !== -1) compras.value[idx] = updated
    }
    closeModal()
  } catch (err: any) {
    formError.value = err.message
  } finally {
    saving.value = false
  }
}

// ── Delete ─────────────────────────────────────────────────────
const isDeleteModalOpen = ref(false)
const compraToDelete    = ref<Compra | null>(null)

const confirmDelete = (c: Compra) => {
  compraToDelete.value = c
  isDeleteModalOpen.value = true
}

const doDelete = async () => {
  if (!compraToDelete.value) return
  saving.value = true
  try {
    await eliminarCompra(compraToDelete.value.id)
    compras.value = compras.value.filter(c => c.id !== compraToDelete.value!.id)
    isDeleteModalOpen.value = false
  } catch (err: any) {
    apiError.value = err.message
    isDeleteModalOpen.value = false
  } finally {
    saving.value = false
  }
}

// ── Formatters ─────────────────────────────────────────────────
const formatFecha = (fecha: string) => {
  if (!fecha) return '-'
  const f = fecha.toString().substring(0, 10)
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}
</script>

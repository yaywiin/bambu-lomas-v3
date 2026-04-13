<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Usuarios</h1>
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Nombre</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Correo</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Usuario</p>
                </th>
                <th class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Rol</p>
                </th>
                <th class="px-5 py-3 text-right sm:px-6 w-32">
                  <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <!-- Loading skeleton -->
              <tr v-if="loading" v-for="i in 3" :key="`sk-${i}`">
                <td v-for="j in 5" :key="j" class="px-5 py-4 sm:px-6">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>

              <!-- Rows -->
              <tr
                v-else
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-800 text-sm dark:text-white/90">{{ user.nombre }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-sm dark:text-gray-400">{{ user.correo }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <p class="text-gray-500 text-sm dark:text-gray-400">@{{ user.usuario }}</p>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="{
                      'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400': user.rol === 'Administrador',
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': user.rol !== 'Administrador'
                    }"
                  >{{ user.rol }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6 flex justify-end gap-2">
                  <button @click="openViewModal(user)" class="text-gray-500 hover:text-brand-500 transition-colors" title="Ver">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(user)" class="text-gray-500 hover:text-blue-500 transition-colors" title="Editar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(user)" class="text-gray-500 hover:text-error-500 transition-colors" title="Borrar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr v-if="!loading && users.length === 0">
                <td colspan="5" class="px-5 py-8 text-center sm:px-6">
                  <p class="text-sm text-gray-500 dark:text-gray-400">No hay usuarios registrados.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Modal Agregar / Editar / Ver ───────────────────────── -->
    <Modal v-if="isModalOpen" :fullScreenBackdrop="true" @close="closeModal">
      <template #body>
        <div class="relative w-full max-w-lg sm:my-8 rounded-xl bg-white shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-50">
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              {{ modalMode === 'add' ? 'Agregar Nuevo Usuario' : modalMode === 'edit' ? 'Editar Usuario' : 'Detalles del Usuario' }}
            </h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6">
            <div class="space-y-4">
              <!-- Nombre -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombre</label>
                <input type="text" v-model="formData.nombre" required :disabled="modalMode === 'view'" placeholder="Ej. Juan Pérez"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800" />
              </div>

              <!-- Correo & Usuario -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Correo</label>
                  <input type="email" v-model="formData.correo" required :disabled="modalMode === 'view'" placeholder="juan@ejemplo.com"
                    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Usuario</label>
                  <input type="text" v-model="formData.usuario" required :disabled="modalMode === 'view'" placeholder="juanp"
                    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800" />
                </div>
              </div>

              <!-- Rol -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Rol</label>
                <div class="relative">
                  <select v-model="formData.rol" required :disabled="modalMode === 'view'"
                    class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800">
                    <option value="" disabled>Seleccionar Rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Mesero">Mesero</option>
                  </select>
                  <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                    <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Contraseña -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div :class="{ 'sm:col-span-2': modalMode === 'view' }">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contraseña</label>
                  <input
                    type="password"
                    v-model="formData.contraseña"
                    :required="modalMode === 'add'"
                    :disabled="modalMode === 'view'"
                    placeholder="••••••••"
                    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div v-if="modalMode !== 'view'">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Confirmar Contraseña</label>
                  <input
                    type="password"
                    v-model="formData.confirmPassword"
                    :required="modalMode === 'add'"
                    placeholder="••••••••"
                    class="h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    :class="passwordMismatch && formData.confirmPassword ? 'border-error-500 focus:ring-error-500/10' : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'"
                  />
                  <p v-if="passwordMismatch && formData.confirmPassword" class="mt-1 text-xs text-error-500">
                    Las contraseñas no coinciden.
                  </p>
                </div>
              </div>

              <!-- Error del formulario -->
              <p v-if="formError" class="text-xs text-error-500 mt-1">{{ formError }}</p>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 pt-5">
              <button type="button" @click="closeModal"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                {{ modalMode === 'view' ? 'Cerrar' : 'Cancelar' }}
              </button>
              <button v-if="modalMode !== 'view'" type="submit" :disabled="saving || (modalMode === 'add' && (passwordMismatch || !isFormValid))"
                class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                {{ modalMode === 'add' ? 'Guardar Usuario' : 'Actualizar Usuario' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- ── Confirm Delete Modal ────────────────────────────────── -->
    <Modal v-if="isDeleteModalOpen" :fullScreenBackdrop="true" @close="isDeleteModalOpen = false">
      <template #body>
        <div class="relative w-full max-w-sm sm:my-8 rounded-xl bg-white shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-50 p-6 text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
            <svg class="w-7 h-7 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">¿Eliminar usuario?</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Esta acción eliminará a <strong>{{ userToDelete?.nombre }}</strong>. El registro se marcará como eliminado.
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import { useUsuarios, type Usuario } from '@/composables/useUsuarios'

const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = useUsuarios()

// ── Estado general ─────────────────────────────────────────────
const users = ref<Usuario[]>([])
const loading = ref(false)
const saving = ref(false)
const apiError = ref('')

// ── Cargar lista desde BD ──────────────────────────────────────
const loadUsers = async () => {
  loading.value = true
  apiError.value = ''
  try {
    users.value = await getUsuarios()
  } catch (err: any) {
    apiError.value = `No se pudo conectar a la API: ${err.message}`
  } finally {
    loading.value = false
  }
}
onMounted(loadUsers)

// ── Modal ──────────────────────────────────────────────────────
const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const selectedUserId = ref<number | null>(null)
const formError = ref('')

const formData = reactive({
  nombre: '',
  correo: '',
  usuario: '',
  rol: '',
  contraseña: '',
  confirmPassword: '',
})

const resetForm = () => {
  formData.nombre = ''
  formData.correo = ''
  formData.usuario = ''
  formData.rol = ''
  formData.contraseña = ''
  formData.confirmPassword = ''
  formError.value = ''
}

const populateForm = (user: Usuario) => {
  formData.nombre = user.nombre
  formData.correo = user.correo
  formData.usuario = user.usuario
  formData.rol = user.rol
  formData.contraseña = ''        // no exponemos el hash
  formData.confirmPassword = ''
  formError.value = ''
}

const openAddModal = () => {
  modalMode.value = 'add'
  selectedUserId.value = null
  resetForm()
  isModalOpen.value = true
}

const openEditModal = (user: Usuario) => {
  modalMode.value = 'edit'
  selectedUserId.value = user.id
  populateForm(user)
  isModalOpen.value = true
}

const openViewModal = (user: Usuario) => {
  modalMode.value = 'view'
  selectedUserId.value = user.id
  populateForm(user)
  // En modo vista ponemos placeholder de contraseña
  formData.contraseña = '••••••••••••'
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// ── Validaciones ───────────────────────────────────────────────
const passwordMismatch = computed(() =>
  formData.contraseña !== formData.confirmPassword
)

const isFormValid = computed(() =>
  formData.nombre && formData.correo && formData.usuario && formData.rol &&
  formData.contraseña && formData.confirmPassword && !passwordMismatch.value
)

// ── Submit formulario ──────────────────────────────────────────
const submitForm = async () => {
  if (modalMode.value === 'view') return
  formError.value = ''
  saving.value = true

  try {
    if (modalMode.value === 'add') {
      const nuevo = await crearUsuario({
        nombre: formData.nombre,
        correo: formData.correo,
        usuario: formData.usuario,
        rol: formData.rol,
        contraseña: formData.contraseña,
      })
      users.value.push(nuevo)
    } else if (modalMode.value === 'edit' && selectedUserId.value) {
      const payload: any = {
        nombre: formData.nombre,
        correo: formData.correo,
        usuario: formData.usuario,
        rol: formData.rol,
      }
      // Solo mandamos contraseña si se cambió
      if (formData.contraseña && formData.contraseña === formData.confirmPassword) {
        payload.contraseña = formData.contraseña
      }
      const updated = await actualizarUsuario(selectedUserId.value, payload)
      const idx = users.value.findIndex(u => u.id === selectedUserId.value)
      if (idx !== -1) users.value[idx] = updated
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
const userToDelete = ref<Usuario | null>(null)

const confirmDelete = (user: Usuario) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const doDelete = async () => {
  if (!userToDelete.value) return
  saving.value = true
  try {
    await eliminarUsuario(userToDelete.value.id)
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id)
    isDeleteModalOpen.value = false
  } catch (err: any) {
    apiError.value = err.message
    isDeleteModalOpen.value = false
  } finally {
    saving.value = false
  }
}
</script>

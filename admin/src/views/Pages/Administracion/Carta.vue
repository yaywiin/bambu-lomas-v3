<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">

      <!-- ================= VISTA: LISTA ================= -->
      <template v-if="viewMode === 'lista'">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">Carta</h1>
          <button
            @click="abrirNuevo"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-colors"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Nuevo
          </button>
        </div>

        <!-- Error Banner -->
        <div v-if="apiError" class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p class="text-sm text-red-700 dark:text-red-400">{{ apiError }}</p>
        </div>

        <!-- Tabla -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th class="px-5 py-3 text-left sm:px-6 w-16">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Foto</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Nombre</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Descripción</p>
                  </th>
                  <th class="px-5 py-3 text-center sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Stock</p>
                  </th>
                  <th class="px-5 py-3 text-right sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Precio</p>
                  </th>
                  <th class="px-5 py-3 text-center sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Disponible</p>
                  </th>
                  <th class="px-5 py-3 text-center sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Variaciones</p>
                  </th>
                  <th class="px-5 py-3 text-center sm:px-6">
                    <p class="font-medium text-gray-500 text-sm dark:text-gray-400">Acciones</p>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Skeleton -->
                <tr v-if="loading" v-for="i in 3" :key="`sk-${i}`">
                  <td v-for="j in 8" :key="j" class="px-5 py-4 sm:px-6">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                </tr>

                <!-- Filas -->
                <tr
                  v-for="item in items" :key="item.id"
                  class="transition-colors"
                  :class="item.disponible ? 'hover:bg-gray-50 dark:hover:bg-white/[0.02]' : 'bg-gray-50/80 dark:bg-gray-800/30 opacity-60'"
                >
                  <!-- Foto -->
                  <td class="px-5 py-3 sm:px-6">
                    <div v-if="item.foto_principal" class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img :src="item.foto_principal" class="w-full h-full object-cover" :alt="item.nombre" />
                    </div>
                    <div v-else class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </td>
                  <!-- Nombre -->
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ item.nombre }}</p>
                    <p v-if="item.receta_id" class="text-xs text-brand-600 mt-0.5">Receta: {{ item.receta_nombre }}</p>
                    <p v-else class="text-xs text-gray-400 mt-0.5">Sin receta vinculada</p>
                  </td>
                  <!-- Descripción -->
                  <td class="px-5 py-4 sm:px-6 max-w-xs">
                    <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ item.descripcion || '—' }}</p>
                  </td>
                  <!-- Stock -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <span v-if="item.stock !== null && item.stock !== undefined"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="item.stock > 0 ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400'"
                    >{{ item.stock }}</span>
                    <span v-else class="text-gray-400 text-sm">—</span>
                  </td>
                  <!-- Precio -->
                  <td class="px-5 py-4 sm:px-6 text-right">
                    <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                      ${{ Number(item.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 }) }}
                    </p>
                  </td>
                  <!-- Disponible switch -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <button
                      @click="toggleDisponible(item)"
                      :class="item.disponible ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                      :title="item.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'"
                    >
                      <span
                        :class="item.disponible ? 'translate-x-6' : 'translate-x-1'"
                        class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                      ></span>
                    </button>
                  </td>
                  <!-- Variaciones badge -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="item.tiene_variaciones ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="item.tiene_variaciones ? 'bg-brand-500' : 'bg-gray-400'"></span>
                      {{ item.tiene_variaciones ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <!-- Acciones -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button @click="verItem(item)" class="text-gray-500 hover:text-brand-500 transition-colors" title="Ver">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button @click="editarItem(item)" class="text-gray-500 hover:text-blue-500 transition-colors" title="Editar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button @click="borrarItem(item)" class="text-gray-500 hover:text-red-500 transition-colors" title="Eliminar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="!loading && items.length === 0">
                  <td colspan="7" class="px-5 py-14 text-center">
                    <div class="flex flex-col items-center gap-3">
                      <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p class="text-sm text-gray-500 dark:text-gray-400">No hay artículos en la carta todavía.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ================= VISTA: FORMULARIO (NUEVA / EDITAR / VER) ================= -->
      <template v-else>
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <button @click="cerrar" class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white/90">
              <span v-if="viewMode === 'nueva'">Nuevo artículo</span>
              <span v-else-if="viewMode === 'editar'">Editando: {{ form.nombre }}</span>
              <span v-else>{{ form.nombre }}</span>
            </h1>
          </div>
          <button
            v-if="viewMode !== 'ver'"
            @click="guardar"
            :disabled="saving"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60 transition-colors"
          >
            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            {{ saving ? 'Guardando...' : (viewMode === 'nueva' ? 'Guardar artículo' : 'Aplicar cambios') }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Columna izquierda: datos principales -->
          <div class="lg:col-span-2 space-y-5">

            <!-- CARD: Información General -->
            <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
              <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
                <h2 class="text-sm font-semibold text-gray-800 dark:text-white">Información General</h2>
              </div>
              <div class="p-6 space-y-4">
                <!-- Nombre del platillo -->
                <div class="mb-4">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del platillo <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="form.nombre"
                    :disabled="viewMode === 'ver'"
                    placeholder="Ej. Frappé de Oreo"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <!-- Fila 1: Receta base y Categoría -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Receta -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Receta base (Estadística) <span class="text-gray-400 font-normal">(opcional)</span></label>

                    <!-- Solo lectura -->
                    <div v-if="viewMode === 'ver'" class="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {{ form.receta_nombre || 'Ninguna' }}
                    </div>

                    <!-- Selector con autocomplete -->
                    <div v-else class="relative">
                      <input
                        type="text"
                        v-model="busquedaReceta"
                        @focus="showRecetaDropdown = true"
                        @blur="hideRecetaDropdown"
                        @input="form.receta_id = null; form.receta_nombre = ''"
                        autocomplete="off"
                        :placeholder="loadingRecetas ? 'Cargando recetas...' : 'Buscar receta...' "
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <!-- Receta seleccionada badge -->
                      <div v-if="form.receta_id && !showRecetaDropdown" class="absolute right-3 top-1/2 -translate-y-1/2">
                        <span @click="desvincularReceta" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400 cursor-pointer hover:bg-brand-200 transition-colors" title="Desvincular receta">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          Vinculada
                        </span>
                      </div>
                      <!-- Dropdown -->
                      <div
                        v-if="showRecetaDropdown && recetasFiltradas.length > 0"
                        class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
                      >
                        <ul class="max-h-52 overflow-y-auto custom-scrollbar">
                          <li
                            v-for="r in recetasFiltradas"
                            :key="r.id"
                            @mousedown.prevent="seleccionarReceta(r)"
                            class="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                          >
                            <span class="font-medium text-gray-900 dark:text-white text-sm">{{ r.nombre }}</span>
                            <span class="text-xs text-brand-500 font-semibold">${{ Number(r.costo).toFixed(2) }} costo</span>
                          </li>
                        </ul>
                      </div>
                      <!-- Sin resultados -->
                      <div
                        v-if="showRecetaDropdown && busquedaReceta && recetasFiltradas.length === 0"
                        class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 px-4 py-3"
                      >
                        <p class="text-sm text-gray-400">No se encontró ninguna receta con ese nombre.</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Categoría -->
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría <span class="text-red-500">*</span></label>
                    <select
                      v-model="form.categoria"
                      :disabled="viewMode === 'ver'"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled selected>Selecciona una categoría</option>
                      <option v-for="cat in categoriasPOS" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                </div>

                <!-- Descripción -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                  <textarea
                    v-model="form.descripcion"
                    :disabled="viewMode === 'ver'"
                    rows="3"
                    placeholder="Describe el producto brevemente..."
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  ></textarea>
                </div>
                <!-- Precio / Stock -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Precio <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input
                        type="number"
                        v-model.number="form.precio"
                        :disabled="viewMode === 'ver'"
                        step="0.01" min="0"
                        placeholder="0.00"
                        class="w-full rounded-lg border border-gray-300 bg-white pl-7 pr-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Stock <span class="text-gray-400 font-normal">(opcional)</span></label>
                    <input
                      type="number"
                      v-model.number="form.stock"
                      :disabled="viewMode === 'ver'"
                      min="0"
                      placeholder="Sin límite"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- CARD: Variaciones -->
            <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
              <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 class="text-sm font-semibold text-gray-800 dark:text-white">Variaciones</h2>
                  <p class="text-xs text-gray-400 mt-0.5">Opciones adicionales que puede elegir el cliente</p>
                </div>
                <!-- Toggle Switch -->
                <button
                  v-if="viewMode !== 'ver'"
                  @click="form.tiene_variaciones = !form.tiene_variaciones"
                  :class="form.tiene_variaciones ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                >
                  <span
                    :class="form.tiene_variaciones ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                  ></span>
                </button>
                <span v-else class="text-sm font-medium" :class="form.tiene_variaciones ? 'text-brand-600' : 'text-gray-400'">
                  {{ form.tiene_variaciones ? 'Activadas' : 'Desactivadas' }}
                </span>
              </div>

              <!-- Panel de variaciones (visible cuando switch ON) -->
              <div v-if="form.tiene_variaciones" class="p-6 space-y-4">

                <!-- Grupos existentes -->
                <div v-for="(grupo, gi) in form.grupos_variacion" :key="gi" class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <!-- Header del grupo -->
                  <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3 flex-1">
                      <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupo:</span>
                      <input
                        v-if="viewMode !== 'ver'"
                        v-model="grupo.nombre"
                        placeholder="Ej. Leche, Tamaño, Temperatura..."
                        class="flex-1 bg-transparent text-sm font-semibold text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none border-b border-transparent focus:border-brand-300"
                      />
                      <span v-else class="text-sm font-semibold text-gray-800 dark:text-white">{{ grupo.nombre }}</span>
                    </div>
                    <button v-if="viewMode !== 'ver'" @click="eliminarGrupo(gi)" class="text-gray-400 hover:text-red-500 transition-colors ml-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Opciones del grupo -->
                  <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                    <div v-for="(op, oi) in grupo.opciones" :key="oi" class="flex items-center gap-3 px-4 py-2.5">
                      <input
                        v-if="viewMode !== 'ver'"
                        v-model="op.variacion"
                        placeholder="Variación (Ej. Deslactosada)"
                        class="flex-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:text-white"
                      />
                      <span v-else class="flex-1 text-sm text-gray-700 dark:text-gray-300">{{ op.variacion }}</span>
                      <div class="relative flex items-center w-28">
                        <span class="absolute left-2.5 text-gray-400 text-xs font-medium">+$</span>
                        <input
                          v-if="viewMode !== 'ver'"
                          v-model.number="op.precio_adicional"
                          type="number" min="0" step="0.50"
                          placeholder="0.00"
                          class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-7 pr-3 py-1.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:text-white"
                        />
                        <span v-else class="w-full pl-7 text-sm text-gray-700 dark:text-gray-300">{{ Number(op.precio_adicional || 0).toFixed(2) }}</span>
                      </div>
                      <button v-if="viewMode !== 'ver'" @click="eliminarOpcion(gi, oi)" class="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Botón agregar opción -->
                  <div v-if="viewMode !== 'ver'" class="px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-700/50">
                    <button @click="agregarOpcion(gi)" class="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar opción
                    </button>
                  </div>
                </div>

                <!-- Botón agregar grupo -->
                <button
                  v-if="viewMode !== 'ver'"
                  @click="agregarGrupo"
                  class="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 hover:border-brand-300 hover:text-brand-500 transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar grupo de variación
                </button>

                <p v-if="form.grupos_variacion.length === 0 && viewMode === 'ver'" class="text-sm text-gray-400 text-center py-4">Sin grupos de variación registrados.</p>
              </div>

              <!-- Panel desactivado -->
              <div v-else class="px-6 py-8 text-center">
                <p class="text-sm text-gray-400">Las variaciones están desactivadas para este artículo.</p>
              </div>
            </div>
          </div>

          <!-- Columna derecha: imágenes -->
          <div class="space-y-5">

            <!-- CARD: Foto Principal -->
            <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
              <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
                <h2 class="text-sm font-semibold text-gray-800 dark:text-white">Foto principal</h2>
              </div>
              <div class="p-6">
                <!-- Preview -->
                <div
                  v-if="form.foto_principal"
                  class="relative mb-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video"
                >
                  <img :src="form.foto_principal" class="w-full h-full object-cover" alt="Foto principal" />
                  <button
                    v-if="viewMode !== 'ver'"
                    @click="form.foto_principal = ''"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <!-- Input file foto principal -->
                <div v-if="viewMode !== 'ver'">
                  <input
                    ref="inputFotoPrincipal"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onFotoPrincipalChange"
                  />
                  <button
                    @click="inputFotoPrincipal?.click()"
                    :disabled="uploadingFoto"
                    type="button"
                    class="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 py-6 text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg v-if="uploadingFoto" class="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs font-medium">{{ uploadingFoto ? 'Subiendo a Cloudinary...' : 'Haz clic para seleccionar una imagen' }}</span>
                    <span class="text-xs text-gray-300">PNG, JPG, WEBP hasta 8MB</span>
                  </button>
                </div>
                <p v-else-if="!form.foto_principal" class="text-sm text-gray-400 text-center py-2">Sin foto principal</p>
              </div>
            </div>

            <!-- CARD: Galería -->
            <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
              <div class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
                <h2 class="text-sm font-semibold text-gray-800 dark:text-white">Galería</h2>
              </div>
              <div class="p-6 space-y-3">
                <!-- Grid de imágenes galería -->
                <div v-if="form.galeria.length > 0" class="grid grid-cols-3 gap-2">
                  <div v-for="(img, idx) in form.galeria" :key="idx" class="relative rounded-lg overflow-hidden aspect-square border border-gray-200 dark:border-gray-700">
                    <img :src="img" class="w-full h-full object-cover" :alt="`Galería ${idx+1}`" />
                    <button
                      v-if="viewMode !== 'ver'"
                      @click="form.galeria.splice(idx, 1)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Agregar imágenes a galería desde archivo -->
                <div v-if="viewMode !== 'ver'">
                  <input
                    ref="inputGaleria"
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="onGaleriaChange"
                  />
                  <button
                    @click="inputGaleria?.click()"
                    :disabled="uploadingGaleria"
                    type="button"
                    class="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 py-5 text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg v-if="uploadingGaleria" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="text-xs font-medium">{{ uploadingGaleria ? 'Subiendo imágenes...' : 'Agregar imágenes a la galería' }}</span>
                    <span class="text-xs text-gray-300">Puedes seleccionar varias a la vez</span>
                  </button>
                </div>
                <p v-else-if="form.galeria.length === 0" class="text-sm text-gray-400 text-center">Sin imágenes en galería</p>
              </div>
            </div>

          </div>
        </div>
      </template>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRecetas, type Receta } from '@/composables/useRecetas'

// ── Tipos ───────────────────────────────────────────────────
interface Opcion {
  variacion: string
  precio_adicional: number
}

interface GrupoVariacion {
  nombre: string
  opciones: Opcion[]
}

interface CartaItem {
  id: number
  nombre: string
  receta_id?: number | null
  receta_nombre?: string | null
  categoria: string
  descripcion: string
  stock: number | null
  precio: number
  foto_principal: string
  galeria: string[]
  tiene_variaciones: boolean
  grupos_variacion: GrupoVariacion[]
  disponible: boolean
}

// Opciones de Categorías como en POS
const categoriasPOS = ['Bebida Caliente', 'Bebida Fria', 'Panaderia', 'Comida', 'Postres', 'Extras']

// ── Estado ──────────────────────────────────────────────────
const viewMode = ref<'lista' | 'nueva' | 'editar' | 'ver'>('lista')
const items = ref<CartaItem[]>([])
const loading = ref(false)
const saving = ref(false)
const apiError = ref('')
const editandoId = ref<number | null>(null)

// refs para los file inputs
const inputFotoPrincipal = ref<HTMLInputElement | null>(null)
const inputGaleria = ref<HTMLInputElement | null>(null)

// Estado de subida de imágenes
const uploadingFoto    = ref(false)
const uploadingGaleria = ref(false)

// ── Recetas (selector) ────────────────────────────────────────
const { getRecetas } = useRecetas()
const recetasDisponibles = ref<Receta[]>([])
const loadingRecetas = ref(false)
const busquedaReceta = ref('')
const showRecetaDropdown = ref(false)

const recetasFiltradas = computed(() => {
  const q = busquedaReceta.value.toLowerCase().trim()
  if (!q) return recetasDisponibles.value
  return recetasDisponibles.value.filter(r => r.nombre.toLowerCase().includes(q))
})

const seleccionarReceta = (r: Receta) => {
  form.receta_id = r.id
  form.receta_nombre = r.nombre
  busquedaReceta.value = r.nombre
  showRecetaDropdown.value = false
}

const desvincularReceta = () => {
  form.receta_id = null
  form.receta_nombre = ''
  busquedaReceta.value = ''
}

const hideRecetaDropdown = () => {
  setTimeout(() => { showRecetaDropdown.value = false }, 150)
}

const formVacio = (): Omit<CartaItem, 'id'> => ({
  nombre: '',
  receta_id: null,
  receta_nombre: '',
  categoria: '',
  descripcion: '',
  stock: null,
  precio: 0,
  foto_principal: '',
  galeria: [],
  tiene_variaciones: false,
  grupos_variacion: [],
  disponible: true
})

const form = reactive(formVacio())

// ── Local storage (datos locales mientras no hay API) ────────
const STORAGE_KEY = 'bambu_carta'

const cargarItems = () => {
  loading.value = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    items.value = raw ? JSON.parse(raw) : []
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

const cargarRecetas = async () => {
  loadingRecetas.value = true
  try {
    recetasDisponibles.value = await getRecetas()
  } catch {
    recetasDisponibles.value = []
  } finally {
    loadingRecetas.value = false
  }
}

onMounted(() => { cargarItems(); cargarRecetas() })

// ── Formulario helpers ───────────────────────────────────────
const resetForm = () => {
  const vacio = formVacio()
  Object.assign(form, vacio)
  editandoId.value = null
  busquedaReceta.value = ''
}

const llenarForm = (item: CartaItem) => {
  form.nombre = item.nombre
  form.receta_id = item.receta_id ?? null
  form.receta_nombre = item.receta_nombre || ''
  form.categoria = item.categoria || ''
  form.descripcion = item.descripcion
  form.stock = item.stock
  form.precio = item.precio
  form.foto_principal = item.foto_principal
  form.galeria = [...(item.galeria || [])]
  form.tiene_variaciones = item.tiene_variaciones
  form.grupos_variacion = JSON.parse(JSON.stringify(item.grupos_variacion || []))
  form.disponible = item.disponible ?? true
  busquedaReceta.value = item.receta_nombre || ''
}

const persistir = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

// ── Navegación ───────────────────────────────────────────────
const abrirNuevo = () => {
  resetForm()
  viewMode.value = 'nueva'
}

const verItem = (item: CartaItem) => {
  llenarForm(item)
  editandoId.value = item.id
  viewMode.value = 'ver'
}

const editarItem = (item: CartaItem) => {
  llenarForm(item)
  editandoId.value = item.id
  viewMode.value = 'editar'
}

const cerrar = () => {
  resetForm()
  viewMode.value = 'lista'
}

const borrarItem = (item: CartaItem) => {
  if (!confirm(`¿Eliminar "${item.nombre}" de la carta?`)) return
  items.value = items.value.filter(i => i.id !== item.id)
  persistir()
}

const toggleDisponible = (item: CartaItem) => {
  item.disponible = !item.disponible
  persistir()
}

// ── Guardar ──────────────────────────────────────────────────
const guardar = () => {
  if (!form.nombre.trim()) { alert('Debes ingresar un nombre para el platillo'); return }
  if (!form.categoria) { alert('Debes seleccionar una categoría'); return }
  if (!form.precio || form.precio <= 0) { alert('El precio debe ser mayor a 0'); return }

  saving.value = true
  try {
    if (viewMode.value === 'nueva') {
      const nuevo: CartaItem = {
        id: Date.now(),
        nombre: form.nombre.trim(),
        receta_id: form.receta_id,
        receta_nombre: form.receta_nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        stock: form.stock,
        precio: form.precio,
        foto_principal: form.foto_principal,
        galeria: [...form.galeria],
        tiene_variaciones: form.tiene_variaciones,
        grupos_variacion: JSON.parse(JSON.stringify(form.grupos_variacion)),
        disponible: true
      }
      items.value.unshift(nuevo)
    } else {
      const idx = items.value.findIndex(i => i.id === editandoId.value)
      if (idx !== -1) {
        items.value[idx] = {
          ...items.value[idx],
          nombre: form.nombre.trim(),
          receta_id: form.receta_id,
          receta_nombre: form.receta_nombre,
          categoria: form.categoria,
          descripcion: form.descripcion,
          stock: form.stock,
          precio: form.precio,
          foto_principal: form.foto_principal,
          galeria: [...form.galeria],
          tiene_variaciones: form.tiene_variaciones,
          grupos_variacion: JSON.parse(JSON.stringify(form.grupos_variacion))
        }
      }
    }
    persistir()
    cerrar()
  } finally {
    saving.value = false
  }
}

// ── Variaciones ──────────────────────────────────────────────
const agregarGrupo = () => {
  form.grupos_variacion.push({ nombre: '', opciones: [{ variacion: '', precio_adicional: 0 }] })
}

const eliminarGrupo = (gi: number) => {
  form.grupos_variacion.splice(gi, 1)
}

const agregarOpcion = (gi: number) => {
  form.grupos_variacion[gi].opciones.push({ variacion: '', precio_adicional: 0 })
}

const eliminarOpcion = (gi: number, oi: number) => {
  form.grupos_variacion[gi].opciones.splice(oi, 1)
}

// ── Imágenes (subida a Cloudinary via servidor) ──────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Sube un archivo al endpoint /api/upload/single del servidor,
 * que lo almacena en Cloudinary y devuelve la URL pública.
 */
const subirImagen = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('imagen', file)
  const res = await fetch(`${API_BASE}/upload/single`, {
    method: 'POST',
    body: formData,
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Error al subir imagen')
  return json.url
}

const onFotoPrincipalChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 8 * 1024 * 1024) { alert('La imagen no debe superar 8MB'); return }
  uploadingFoto.value = true
  try {
    form.foto_principal = await subirImagen(file)
  } catch (err: any) {
    alert('Error al subir la imagen: ' + err.message)
  } finally {
    uploadingFoto.value = false
    if (inputFotoPrincipal.value) inputFotoPrincipal.value.value = ''
  }
}

const onGaleriaChange = async (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  if (files.length === 0) return
  uploadingGaleria.value = true
  try {
    for (const file of files) {
      if (file.size > 8 * 1024 * 1024) { alert(`"${file.name}" supera 8MB y no fue agregada`); continue }
      const url = await subirImagen(file)
      form.galeria.push(url)
    }
  } catch (err: any) {
    alert('Error al subir imágenes de galería: ' + err.message)
  } finally {
    uploadingGaleria.value = false
    if (inputGaleria.value) inputGaleria.value.value = ''
  }
}
</script>

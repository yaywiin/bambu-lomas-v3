<template>
  <AdminLayout>
    <div class="h-[calc(100vh-100px)] flex flex-col-reverse md:flex-row gap-4 md:gap-6">

      <!-- ================= LEFT SIDEBAR: ORDER SUMMARY ================= -->
      <div class="w-full md:w-72 lg:w-80 h-[280px] md:h-auto flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 relative">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">Orden Actual</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Pendiente de cobro</p>
          </div>
          <button v-if="orden.length > 0" @click="orden = []" class="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 bg-red-50 dark:bg-red-500/10 rounded-md">
            Limpiar
          </button>
        </div>

        <!-- Order Items -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          
          <div v-if="orden.length === 0" class="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-600 gap-2">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-sm font-medium">Orden vacía</p>
            <p class="text-xs">Selecciona productos del catálogo</p>
          </div>

          <div 
            v-for="item in orden" :key="item.id"
            class="flex flex-col pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
          >
            <div class="flex justify-between items-start gap-2">
              <span class="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                {{ item.cantidad }}x {{ item.producto }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
            </div>
            <div class="mt-1 pl-4 space-y-0.5" v-if="item.extras && item.extras.length > 0">
              <p v-for="ex in item.extras" :key="ex" class="text-[11px] text-gray-500 dark:text-gray-400">
                - {{ ex }}
              </p>
            </div>
            <!-- Botonoes de ajuste qty -->
            <div class="flex items-center gap-3 mt-2 pl-4">
              <button @click="reducirCantidad(item)" class="text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="text-xs text-gray-600 dark:text-gray-300 font-medium">{{ item.cantidad }}</span>
              <button @click="incrementarCantidad(item)" class="text-gray-400 hover:text-green-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Total -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
            <span class="text-xl font-bold text-brand-600 dark:text-brand-400">${{ calcularTotal.toFixed(2) }}</span>
          </div>
          <button 
            :disabled="orden.length === 0" 
            @click="abrirCobro"
            class="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            Cobrar Orden
          </button>
        </div>
      </div>

      <!-- ================= RIGHT AREA: CATALOG ================= -->
      <div class="flex-1 flex flex-col relative overflow-hidden">
        
        <div class="relative h-12 flex mb-4 z-[60] w-full">
          
          <!-- Categories Top Bar (Oculto visualmente cuando el buscador está expandido) -->
          <div 
            class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar flex-1 pr-12 transition-opacity duration-300"
            :class="searchExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
          >
            <button 
              v-for="cat in categorias" 
              :key="cat"
              :class="['px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm',
                categoriaActiva === cat 
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800'
              ]"
              @click="categoriaActiva = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Lupa Trigger (Aparece a la derecha cuando NO está expandido) -->
          <button 
            v-if="!searchExpanded"
            @click="expandirBuscador"
            class="absolute right-0 top-0 w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-500 hover:border-brand-300 transition-all z-10"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          <!-- Search Bar Expandible (Cubre todo el ancho) -->
          <div 
            class="absolute right-0 top-0 h-10 z-[60] transition-all duration-300 ease-in-out origin-right flex"
            :class="searchExpanded ? 'w-full opacity-100' : 'w-10 opacity-0 pointer-events-none'"
          >
            <div class="relative w-full h-full flex">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                ref="searchInputRef"
                type="text" 
                v-model="searchQuery" 
                @focus="searchFocused = true"
                @blur="handleSearchBlur"
                placeholder="Buscar cualquier producto en el menú..."
                class="w-full h-full bg-white dark:bg-gray-900 border-2 border-brand-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full pl-11 pr-12 focus:outline-none shadow-md transition-all"
              />
              <button 
                @click="cerrarBuscador"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
                title="Cerrar buscador"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Search Dropdown -->
            <div v-if="searchFocused && searchQuery" class="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden text-sm z-[70]">
              <ul v-if="searchResults.length > 0" class="py-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                <li v-for="res in searchResults" :key="res.nombre" class="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                  <button 
                    @mousedown.prevent="seleccionarBusqueda(res)" 
                    class="w-full text-left px-5 py-3 hover:bg-brand-50 dark:hover:bg-gray-700 flex justify-between items-center transition-colors group"
                  >
                    <div>
                      <span class="block font-semibold text-gray-800 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400">{{ res.nombre }}</span>
                      <span class="block text-xs font-medium text-gray-500 mt-0.5">{{ res.categoria }}</span>
                    </div>
                    <span class="font-bold text-gray-900 dark:text-gray-100">${{ res.precio }}</span>
                  </button>
                </li>
              </ul>
              <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400 font-medium">
                No se encontraron resultados para "{{ searchQuery }}"
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar pb-24 flex flex-col">
          <!-- Loading state -->
          <div v-if="loadingProductos" class="flex-1 flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-3 text-gray-400">
              <svg class="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p class="text-sm font-medium">Cargando carta...</p>
            </div>
          </div>

          <div v-else class="grid grid-cols-2 lg:grid-cols-3 mx-auto max-w-4xl xl:grid-cols-4 gap-6 p-2 flex-1 content-start w-full">
            <!-- Product Cards -->
            <button 
              v-for="prod in productosPaginados" :key="prod.nombre"

              @click="handleProductClick(prod)"
              class="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-1"
            >
              <div class="w-full aspect-square bg-white dark:bg-gray-800 rounded-[2rem] relative overflow-hidden shadow-sm group-hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                <img 
                  :src="prod.foto_principal || 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                  :alt="prod.nombre"
                />
                
                <!-- Price Overlay -->
                <div 
                  v-if="mostrarPrecios" 
                  class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity"
                >
                  <span class="text-white text-2xl font-black tracking-wider drop-shadow-lg">
                    ${{ prod.precio }}
                  </span>
                </div>
              </div>
              
              <div class="mt-3 w-full px-2 text-center flex flex-col items-center">
                <span class="text-[13px] md:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                  {{ prod.nombre }}
                </span>
              </div>
            </button>
          </div>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 py-4 mt-1 w-full">
            <button 
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
              class="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div class="flex gap-1.5">
              <button 
                v-for="p in totalPages" :key="p"
                @click="currentPage = p"
                :class="['w-9 h-9 rounded-full font-bold text-xs transition-all',
                   currentPage === p ? 'bg-brand-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <button 
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
              class="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <!-- ================= FLOATING ACTION BUTTONS ================= -->
        <div class="absolute bottom-6 right-6 flex items-center gap-4">
          <!-- Mostrar Precios Button (Round with $$ Icon) -->
          <button 
            @click="mostrarPrecios = !mostrarPrecios"
            :class="['w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95',
              mostrarPrecios ? 'bg-amber-500 text-white' : 'bg-gray-800 text-white dark:bg-white dark:text-gray-900 border border-transparent'
            ]"
            title="Mostrar Precios"
          >
            <span class="text-[22px] font-black tracking-tighter">$$</span>
          </button>
        </div>

      </div>
    </div>

    <!-- ================= MODAL: PERSONALIZACIÓN DE BEBIDA (VARIACIONES) ================= -->
    <div v-if="showModalVariaciones" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 text-center">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">{{ itemPendiente?.nombre }}</h3>
        </div>

        <div class="p-6 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div v-for="grupo in itemPendiente?.grupos_variacion" :key="grupo.nombre">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{{ grupo.nombre }}</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="opcion in grupo.opciones" :key="opcion.variacion"
                @click="toggleVariacion(grupo.nombre, opcion)"
                :class="['p-4 text-base font-semibold rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-1 min-h-[80px]',
                  variacionesSeleccionadas[grupo.nombre]?.variacion === opcion.variacion
                    ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md dark:bg-brand-500/20 dark:border-brand-500/50 dark:text-brand-400'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50'
                ]"
              >
                <span>{{ opcion.variacion }}</span>
                <span v-if="opcion.precio_adicional > 0" class="text-xs font-bold text-brand-600 dark:text-brand-400 opacity-90">(+${{ Number(opcion.precio_adicional).toFixed(2) }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button @click="cancelarPersonalizacion" class="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            Cancelar
          </button>
          <button @click="confirmarPersonalizacion" class="flex-1 py-3 px-4 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors shadow-sm">
            Agregar a la Orden
          </button>
        </div>

      </div>
    </div>

    <!-- ================= MODAL: COBRO ================= -->
    <div v-if="showModalCobro" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 text-center">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Procesar Cobro</h3>
          <p class="text-3xl font-black text-brand-600 dark:text-brand-400 mt-2">${{ calcularTotal.toFixed(2) }}</p>
        </div>

        <div class="p-6 space-y-6">
          <!-- Nombre del Cliente -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre del Cliente</label>
            <input 
              type="text" 
              v-model="datosCobro.nombre"
              placeholder="Opcional (Ej. Juan Pérez)"
              autocomplete="off"
              class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <!-- Método de Pago -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Método de Pago</label>
            <div class="grid grid-cols-3 gap-3">
              <button 
                v-for="metodo in metodosDePago" :key="metodo!"
                @click="datosCobro.metodo = metodo"
                :class="['p-3 text-sm font-semibold rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 h-24 hover:-translate-y-1',
                  datosCobro.metodo === metodo
                    ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md shadow-brand-500/20 dark:bg-brand-500/20 dark:border-brand-500/50 dark:text-brand-400'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:border-brand-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                ]"
              >
                <!-- Efectivo -->
                <svg v-if="metodo === 'Efectivo'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <!-- Tarjeta -->
                <svg v-else-if="metodo === 'Tarjeta'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <!-- Transferencia -->
                <svg v-else-if="metodo === 'Transferencia'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                
                <span class="text-xs">{{ metodo }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button @click="showModalCobro = false" class="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            Volver
          </button>
          <button @click="finalizarCobro" class="flex-[2] py-3 px-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            Completar Cobro
          </button>
        </div>

      </div>
    </div>

    <!-- ================= MODAL: ADVERTENCIA DE CIERRE ================= -->
    <div v-if="showModalCierreAdvertencia" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        <div class="p-8 text-center space-y-4">
          <div class="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Cerrar Orden</h3>
          <p class="text-gray-600 dark:text-gray-300">¿Estás seguro de que quieres cerrar la orden <span class="font-bold text-gray-900 dark:text-white">{{ mockFolio }}</span> por un total de <span class="font-bold text-brand-600 dark:text-brand-400">${{ calcularTotal.toFixed(2) }}</span>?</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button @click="cancelarCierre" class="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            Cancelar
          </button>
          <button @click="aceptarCierre" class="flex-1 py-3 px-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm">
            Aceptar
          </button>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Estado del UI
const categorias = ['Bebida Caliente', 'Bebida Fria', 'Panaderia', 'Comida', 'Postres', 'Extras']
const categoriaActiva = ref(categorias[0])
const mostrarPrecios = ref(false)
const currentPage = ref(1)
const itemsPerPage = 8

// Estado Buscador Global
const searchQuery = ref('')
const searchFocused = ref(false)
const searchExpanded = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

const expandirBuscador = () => {
  searchExpanded.value = true
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 100) // Delay pequeño para permitir la animación CSS y que no salte
}

const cerrarBuscador = () => {
  searchExpanded.value = false
  searchQuery.value = ''
  searchFocused.value = false
}

const handleSearchBlur = () => {
  setTimeout(() => { cerrarBuscador() }, 150)
}

// Resetear paginación si se cambia de categoría
watch(categoriaActiva, () => {
  currentPage.value = 1
})

// Estado de la Orden
interface OrdenItem {
  id: string
  cantidad: number
  producto: string
  precio: number
  extras: string[]
  extrasStr: string
}
const orden = ref<OrdenItem[]>([])

const calcularTotal = computed(() => {
  return orden.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
})

// Estado del Modal de Personalización (Variaciones)
const showModalVariaciones = ref(false)
const itemPendiente = ref<any>(null)

// Guardamos la opción seleccionada por grupo. Ej: { "Leches": { variacion: "Avena", precio_adicional: 15 } }
const variacionesSeleccionadas = ref<Record<string, any>>({})

const toggleVariacion = (grupoNombre: string, opcion: any) => {
  if (variacionesSeleccionadas.value[grupoNombre]?.variacion === opcion.variacion) {
    delete variacionesSeleccionadas.value[grupoNombre]
  } else {
    variacionesSeleccionadas.value[grupoNombre] = opcion
  }
}

const handleProductClick = (prod: any) => {
  if (prod.tiene_variaciones && prod.grupos_variacion && prod.grupos_variacion.length > 0) {
    itemPendiente.value = prod
    variacionesSeleccionadas.value = {}
    showModalVariaciones.value = true
  } else {
    // Agregar directo sin modal
    agregarAOrden(prod, [], 0)
  }
}

const seleccionarBusqueda = (prod: any) => {
  categoriaActiva.value = prod.categoria
  searchQuery.value = ''
  searchFocused.value = false
  handleProductClick(prod)
}

const cancelarPersonalizacion = () => {
  showModalVariaciones.value = false
  itemPendiente.value = null
}

const confirmarPersonalizacion = () => {
  const extras: string[] = []
  let costoExtraTotal = 0

  for (const grupo in variacionesSeleccionadas.value) {
    const opcion = variacionesSeleccionadas.value[grupo]
    if (opcion) {
      if (opcion.precio_adicional > 0) {
        extras.push(`+ ${opcion.variacion} (+$${opcion.precio_adicional})`)
        costoExtraTotal += Number(opcion.precio_adicional)
      } else {
         extras.push(`+ ${opcion.variacion}`)
      }
    }
  }
  
  agregarAOrden(itemPendiente.value, extras, costoExtraTotal)
  showModalVariaciones.value = false
  itemPendiente.value = null
}

const agregarAOrden = (prod: any, extras: string[], costoExtraTotal: number) => {
  const extrasStr = extras.join(', ')
  const precioFinal = Number(prod.precio) + costoExtraTotal
  
  const existing = orden.value.find(o => o.producto === prod.nombre && o.extrasStr === extrasStr && o.precio === precioFinal)
  
  if (existing) {
    existing.cantidad++
  } else {
    orden.value.push({
      id: Date.now().toString() + Math.random().toString(),
      cantidad: 1,
      producto: prod.nombre,
      precio: precioFinal,
      extras: extras,
      extrasStr: extrasStr
    })
  }
}

const incrementarCantidad = (item: OrdenItem) => {
  item.cantidad++
}
const reducirCantidad = (item: OrdenItem) => {
  if (item.cantidad > 1) {
    item.cantidad--
  } else {
    orden.value = orden.value.filter(o => o.id !== item.id)
  }
}

// Estado del Modal de Cobro
const showModalCobro = ref(false)
const metodosDePago = ['Efectivo', 'Tarjeta', 'Transferencia']
const datosCobro = reactive({
  nombre: '',
  metodo: 'Efectivo'
})

const abrirCobro = () => {
  datosCobro.nombre = ''
  datosCobro.metodo = 'Efectivo'
  showModalCobro.value = true
}

const mockFolio = ref(`ORD-${Math.floor(1000 + Math.random() * 9000)}`)
const showModalCierreAdvertencia = ref(false)

const finalizarCobro = () => {
  showModalCobro.value = false
  showModalCierreAdvertencia.value = true
}

const cancelarCierre = () => {
  showModalCierreAdvertencia.value = false
  showModalCobro.value = true
}

const aceptarCierre = () => {
  // Lógica ficticia para finalizar (luego se enlazará a backend)
  console.log(`Orden completada: ${calcularTotal.value} pagado por ${datosCobro.nombre || 'Cliente General'} vía ${datosCobro.metodo}`)
  orden.value = []
  showModalCierreAdvertencia.value = false
  mockFolio.value = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
}

// Base de datos local mock de productos con precios integrados
const todosLosProductos = ref<any[]>([])

// Cargar productos desde la API (carta en BD)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const loadingProductos = ref(false)

onMounted(async () => {
  loadingProductos.value = true
  try {
    const res = await fetch(`${API_BASE}/carta`)
    const json = await res.json()
    if (json.success) {
      todosLosProductos.value = (json.data as any[]).filter((p: any) => p.disponible !== false)
    }
  } catch (e) {
    console.error('Error al cargar la carta desde el servidor', e)
  } finally {
    loadingProductos.value = false
  }
})


const productosFiltrados = computed(() => {
  return todosLosProductos.value.filter(p => p.categoria === categoriaActiva.value)
})

const totalPages = computed(() => {
  return Math.ceil(productosFiltrados.value.length / itemsPerPage)
})

const productosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return productosFiltrados.value.slice(start, start + itemsPerPage)
})

const searchResults = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return []
  return todosLosProductos.value.filter(p => 
    p.nombre.toLowerCase().includes(query) || 
    p.categoria.toLowerCase().includes(query)
  ).slice(0, 6)
})

</script>

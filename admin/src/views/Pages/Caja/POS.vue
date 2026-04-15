<template>
  <AdminLayout>
    <div class="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">

      <!-- ================= LEFT SIDEBAR: ORDER SUMMARY ================= -->
      <div class="w-full md:w-72 lg:w-80 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 relative">
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
        
        <!-- Categories Top Bar -->
        <div class="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-2">
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

        <!-- Products Grid -->
        <div class="flex-1 overflow-y-auto custom-scrollbar pb-24">
          <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            <!-- Product Cards -->
            <button 
              v-for="prod in productosFiltrados" :key="prod.nombre"
              @click="handleProductClick(prod)"
              class="group relative flex flex-col items-center transition-all duration-200 hover:-translate-y-1"
            >
              <div class="w-full aspect-square bg-white dark:bg-gray-800 rounded-[2rem] relative overflow-hidden shadow-sm group-hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                  alt="Product"
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

          <!-- POS Menu Gestor Button -->
          <router-link 
            to="/caja/pos/gestion"
            class="px-8 h-14 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center font-bold tracking-wide hover:bg-brand-500 hover:scale-105 active:scale-95 transition-all text-lg"
          >
            Gestión
          </router-link>
        </div>

      </div>
    </div>

    <!-- ================= MODAL: PERSONALIZACIÓN DE BEBIDA ================= -->
    <div v-if="showModalLeche" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 text-center">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Personalizar Bebida</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ itemPendiente?.nombre }}</p>
        </div>

        <div class="p-6 space-y-6">
          <!-- Tipo de leche -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tipo de Leche</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="leche in tiposDeLeche" :key="leche"
                @click="personalizacion.tipoLeche = leche"
                :class="['px-3 py-2 text-sm font-medium rounded-xl border transition-all',
                  personalizacion.tipoLeche === leche
                    ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                ]"
              >
                {{ leche }}
              </button>
            </div>
          </div>

          <!-- Endulzantes -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Endulzantes</label>
            <div class="space-y-3">
              <!-- Azúcar -->
              <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Azúcar (cucharadas)</span>
                <div class="flex items-center gap-4">
                  <button @click="quitarCucharada('azucar')" :disabled="personalizacion.azucar === 0" class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                  </button>
                  <span class="w-4 text-center font-bold text-gray-800 dark:text-white">{{ personalizacion.azucar }}</span>
                  <button @click="agregarCucharada('azucar')" :disabled="personalizacion.azucar === 5" class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
              
              <!-- Splenda -->
              <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Splenda (sobres)</span>
                <div class="flex items-center gap-4">
                  <button @click="quitarCucharada('splenda')" :disabled="personalizacion.splenda === 0" class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                  </button>
                  <span class="w-4 text-center font-bold text-gray-800 dark:text-white">{{ personalizacion.splenda }}</span>
                  <button @click="agregarCucharada('splenda')" :disabled="personalizacion.splenda === 5" class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
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
    <div v-if="showModalCobro" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
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

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Estado del UI
const categorias = ['Bebida Caliente', 'Bebida Fria', 'Panaderia', 'Comida', 'Postres', 'Extras']
const categoriaActiva = ref(categorias[0])
const mostrarPrecios = ref(false)

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

// Estado del Modal de Personalización
const showModalLeche = ref(false)
const itemPendiente = ref<any>(null)
const tiposDeLeche = ['Entera', 'Deslactosada', 'Almendra', 'Avena', 'Coco', 'Soya']

const personalizacion = reactive({
  tipoLeche: 'Entera',
  azucar: 0,
  splenda: 0
})

const agregarCucharada = (tipo: 'azucar' | 'splenda') => {
  if (personalizacion[tipo] < 5) personalizacion[tipo]++
}
const quitarCucharada = (tipo: 'azucar' | 'splenda') => {
  if (personalizacion[tipo] > 0) personalizacion[tipo]--
}

const handleProductClick = (prod: any) => {
  // Definimos qué productos llevan personalización de leche/endulzante.
  // Puede ser por categoría entera o coincidencia de nombres.
  // Por simplicidad, todo lo de Bebida Caliente/Fría que no sea Té, Tisana o Americano
  // Lo más fácil es pedir a todo lo que suena a café o leche.
  const requiereLeche = /latte|capuchino|frappé|chocolate|mocha|macchiato|chai|smoothie|flat white|affogato/i.test(prod.nombre)
  
  if (requiereLeche) {
    itemPendiente.value = prod
    personalizacion.tipoLeche = 'Entera'
    personalizacion.azucar = 0
    personalizacion.splenda = 0
    showModalLeche.value = true
  } else {
    // Agregar directo sin modal
    agregarAOrden(prod, [])
  }
}

const cancelarPersonalizacion = () => {
  showModalLeche.value = false
  itemPendiente.value = null
}

const confirmarPersonalizacion = () => {
  const extras: string[] = []
  if (personalizacion.tipoLeche !== 'Entera') {
    extras.push(`Leche de ${personalizacion.tipoLeche}`)
  }
  if (personalizacion.azucar > 0) {
    extras.push(`${personalizacion.azucar}x Azúcar`)
  }
  if (personalizacion.splenda > 0) {
    extras.push(`${personalizacion.splenda}x Splenda`)
  }
  
  agregarAOrden(itemPendiente.value, extras)
  showModalLeche.value = false
  itemPendiente.value = null
}

const agregarAOrden = (prod: any, extras: string[]) => {
  const extrasStr = extras.join(', ')
  const existing = orden.value.find(o => o.producto === prod.nombre && o.extrasStr === extrasStr)
  
  if (existing) {
    existing.cantidad++
  } else {
    orden.value.push({
      id: Date.now().toString() + Math.random().toString(),
      cantidad: 1,
      producto: prod.nombre,
      precio: prod.precio,
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

const finalizarCobro = () => {
  // Lógica ficticia para finalizar (luego se enlazará a backend)
  console.log(`Orden completada: ${calcularTotal.value} pagado por ${datosCobro.nombre || 'Cliente General'} vía ${datosCobro.metodo}`)
  orden.value = []
  showModalCobro.value = false
}

// Base de datos local mock de productos con precios integrados
const todosLosProductos = [
  // BEBIDA CALIENTE
  { categoria: 'Bebida Caliente', nombre: 'Espresso Americano', precio: 45 },
  { categoria: 'Bebida Caliente', nombre: 'Capuchino Italiano', precio: 65 },
  { categoria: 'Bebida Caliente', nombre: 'Latte Macchiato', precio: 70 },
  { categoria: 'Bebida Caliente', nombre: 'Flat White', precio: 68 },
  { categoria: 'Bebida Caliente', nombre: 'Mocha Caliente', precio: 75 },
  { categoria: 'Bebida Caliente', nombre: 'Chocolate Abuelita', precio: 55 },
  { categoria: 'Bebida Caliente', nombre: 'Espresso Sencillo', precio: 35 },
  { categoria: 'Bebida Caliente', nombre: 'Té Chai Latte Caliente', precio: 75 },
  { categoria: 'Bebida Caliente', nombre: 'Infusión Herbal (Manzanilla/Menta)', precio: 50 },
  { categoria: 'Bebida Caliente', nombre: 'Tisana Frutal Caliente', precio: 60 },

  // BEBIDA FRÍA
  { categoria: 'Bebida Fria', nombre: 'Iced Latte', precio: 70 },
  { categoria: 'Bebida Fria', nombre: 'Frappé Cookies & Cream', precio: 95 },
  { categoria: 'Bebida Fria', nombre: 'Cold Brew Tonic', precio: 85 },
  { categoria: 'Bebida Fria', nombre: 'Smoothie de Frutos Rojos', precio: 80 },
  { categoria: 'Bebida Fria', nombre: 'Chamoyada de Mango', precio: 75 },
  { categoria: 'Bebida Fria', nombre: 'Frappé de Caramelo', precio: 90 },
  { categoria: 'Bebida Fria', nombre: 'Iced Americano', precio: 50 },
  { categoria: 'Bebida Fria', nombre: 'Matcha Iced Latte', precio: 85 },
  { categoria: 'Bebida Fria', nombre: 'Té Helado de la Casa', precio: 45 },
  { categoria: 'Bebida Fria', nombre: 'Affogato (Helado + Espresso)', precio: 75 },

  // PANADERIA
  { categoria: 'Panaderia', nombre: 'Croissant de Mantequilla', precio: 48 },
  { categoria: 'Panaderia', nombre: 'Chocolatín', precio: 52 },
  { categoria: 'Panaderia', nombre: 'Concha de Vainilla', precio: 35 },
  { categoria: 'Panaderia', nombre: 'Muffin de Chocolate', precio: 45 },
  { categoria: 'Panaderia', nombre: 'Rol de Canela con Glaseado', precio: 55 },
  { categoria: 'Panaderia', nombre: 'Bagel con Queso Crema', precio: 65 },
  { categoria: 'Panaderia', nombre: 'Galleta de Chispas (Grande)', precio: 40 },
  { categoria: 'Panaderia', nombre: 'Dona de Chocolate', precio: 30 },
  { categoria: 'Panaderia', nombre: 'Pan de Elote', precio: 45 },
  { categoria: 'Panaderia', nombre: 'Rebanada de Hogaza Tostada', precio: 25 },

  // COMIDA
  { categoria: 'Comida', nombre: 'Avocado Toast Clásico', precio: 130 },
  { categoria: 'Comida', nombre: 'Panini de Pollo al Pesto', precio: 155 },
  { categoria: 'Comida', nombre: 'Baguette de Jamón y Queso', precio: 145 },
  { categoria: 'Comida', nombre: 'Molletes con Pico de Gallo', precio: 95 },
  { categoria: 'Comida', nombre: 'Chilaquiles Rojos o Verdes', precio: 140 },
  { categoria: 'Comida', nombre: 'Ensalada César', precio: 130 },
  { categoria: 'Comida', nombre: 'Sándwich de Pavo y Panela', precio: 110 },
  { categoria: 'Comida', nombre: 'Bagel de Salmón y Alcaparras', precio: 175 },
  { categoria: 'Comida', nombre: 'Omelette de Espinacas', precio: 120 },
  { categoria: 'Comida', nombre: 'Cuernito de Jamón y Queso', precio: 85 },

  // POSTRES
  { categoria: 'Postres', nombre: 'Cheesecake de Frutos Rojos', precio: 90 },
  { categoria: 'Postres', nombre: 'Pastel de Zanahoria', precio: 85 },
  { categoria: 'Postres', nombre: 'Brownie con Helado', precio: 98 },
  { categoria: 'Postres', nombre: 'Tarta de Manzana Caliente', precio: 80 },
  { categoria: 'Postres', nombre: 'Tiramisú', precio: 115 },
  { categoria: 'Postres', nombre: 'Crepa de Nutella y Plátano', precio: 95 },
  { categoria: 'Postres', nombre: 'Mousse de Chocolate', precio: 75 },
  { categoria: 'Postres', nombre: 'Pay de Limón', precio: 70 },
  { categoria: 'Postres', nombre: 'Alfajor de Maicena', precio: 45 },
  { categoria: 'Postres', nombre: 'Volcán de Chocolate', precio: 105 },

  // EXTRAS
  { categoria: 'Extras', nombre: 'Carga de Espresso Extra', precio: 20 },
  { categoria: 'Extras', nombre: 'Leche de Almendra (Cambio)', precio: 18 },
  { categoria: 'Extras', nombre: 'Leche de Avena (Cambio)', precio: 22 },
  { categoria: 'Extras', nombre: 'Leche Deslactosada (Cambio)', precio: 10 },
  { categoria: 'Extras', nombre: 'Jarabe de Vainilla', precio: 12 },
  { categoria: 'Extras', nombre: 'Jarabe de Caramelo', precio: 12 },
  { categoria: 'Extras', nombre: 'Jarabe de Avellana', precio: 12 },
  { categoria: 'Extras', nombre: 'Porción de Crema Batida', precio: 15 },
  { categoria: 'Extras', nombre: 'Porción de Aguacate Extra', precio: 35 },
  { categoria: 'Extras', nombre: 'Porción de Queso Crema', precio: 20 },
]

const productosFiltrados = computed(() => {
  return todosLosProductos.filter(p => p.categoria === categoriaActiva.value)
})

</script>

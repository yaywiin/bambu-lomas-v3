<template>
  <div class="min-h-screen bg-white pb-24">
    <!-- Header / Hero Banner -->
    <header class="relative bg-brand-900 overflow-hidden w-full">
      <div class="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920&fit=crop')] bg-cover bg-center"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/40 to-transparent"></div>
      <div class="relative max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center sm:py-24">
        
        <img src="/images/logo/logo.png" class="h-28 sm:h-40 w-auto object-contain mb-6 brightness-0 invert drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500" alt="Bambú Lomas Logo" />
        <p class="text-white max-w-md mx-auto text-base sm:text-lg font-semibold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Explora nuestros platillos preparados con ingredientes frescos. Ordena desde tu mesa.
        </p>

      </div>
    </header>

    <!-- Barra de Categorias Full-Width (Sticky) -->
    <div class="w-full bg-brand-500 shadow-md sticky top-0 z-30">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex overflow-x-auto custom-scrollbar snap-x items-stretch h-14">
          <button 
            @click="categoriaActiva = 'Todos'"
            :class="[
              'px-6 flex items-center justify-center whitespace-nowrap text-[15px] font-bold transition-all shrink-0 snap-start h-full',
              categoriaActiva === 'Todos' ? 'bg-[#0a192f] text-white shadow-inner' : 'bg-transparent text-white/80 hover:bg-white/10 hover:text-white'
            ]"
          >
            Todos
          </button>
          <button 
            v-for="cat in categorias" 
            :key="cat"
            @click="categoriaActiva = cat"
            :class="[
              'px-6 flex items-center justify-center whitespace-nowrap text-[15px] font-bold transition-all shrink-0 snap-start h-full',
              categoriaActiva === cat ? 'bg-[#0a192f] text-white shadow-inner' : 'bg-transparent text-white/80 hover:bg-white/10 hover:text-white'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-5xl mx-auto px-4 mt-8">

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse bg-white rounded-2xl h-80 shadow-sm border border-gray-100" />
      </div>

      <!-- Error State -->
      <div v-else-if="errorCarta" class="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div class="text-5xl">⚠️</div>
        <p class="text-brand-800 font-bold text-lg">No pudimos cargar el menú</p>
        <p class="text-brand-600 text-sm max-w-sm">{{ errorCarta }}</p>
        <button @click="fetchCarta()" class="mt-2 px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 transition-colors">
          Reintentar
        </button>
      </div>

      <!-- Menu Grid con Animaciones -->
      <transition-group 
        v-else 
        name="menu-fade" 
        tag="div" 
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-max relative"
      >
        <div 
          v-for="producto in productosFiltrados" 
          :key="producto.id"
          class="group bg-white shadow-sm hover:shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
        >
          <!-- Imagen del producto (usando url real o un unsplash de placeholder si no hay foto) -->
          <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            <img 
               :src="producto.foto_principal || getDefaultImage(producto.categoria)" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               alt="Platillo"
            />
            <div class="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-gray-800 dark:text-gray-200 shadow-sm">
              ${{ Number(producto.precio).toFixed(2) }}
            </div>
          </div>
          
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-brand-900 leading-tight">
                  {{ producto.nombre }}
                </h3>
              </div>
              <p class="text-sm text-brand-800 line-clamp-2 mb-4 font-medium">
                {{ producto.descripcion || 'Delicioso platillo preparado al instante con ingredientes frescos.' }}
              </p>
            </div>
            
            <button 
              @click="addToCart(producto)"
              class="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 active:scale-95 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Agregar a la Orden
            </button>
          </div>
        </div>
      </transition-group>

    </main>

    <!-- Botón de Carrito Flotante (FAB) -->
    <button 
      @click="showCart = true" 
      class="fixed bottom-8 right-8 z-40 p-4 bg-brand-500 text-white rounded-full shadow-2xl shadow-brand-500/40 hover:bg-brand-600 hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
      <span v-if="cartTotalItems > 0" class="absolute -top-2 -right-2 inline-flex items-center justify-center w-7 h-7 text-xs font-black text-brand-600 bg-white border-[2.5px] border-brand-500 rounded-full shadow-sm">
        {{ cartTotalItems }}
      </span>
    </button>

    <!-- Overlay Carrito -->
    <div v-if="showCart" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="showCart = false"></div>
      
      <div class="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0 border-l border-gray-200 dark:border-gray-800">
        
        <!-- Cart Header -->
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Tu Orden
            <span class="bg-brand-100 text-brand-600 text-xs px-2.5 py-1 rounded-full font-bold">
              {{ cartTotalItems }} items
            </span>
          </h2>
          <button @click="showCart = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <p class="text-gray-500 font-medium">Bolsa vacía. ¡Agrega tus antojos!</p>
            <button @click="showCart = false" class="text-brand-500 font-bold text-sm">Explorar Menú</button>
          </div>

          <!-- Product in Cart -->
          <div v-for="item in cart" :key="item.id" class="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <img :src="item.producto.foto_principal || getDefaultImage(item.producto.categoria)" class="w-20 h-20 object-cover rounded-lg" />
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ item.producto.nombre }}</h4>
                <p class="font-semibold text-brand-600 dark:text-brand-400 text-sm mt-1">${{ Number(item.producto.precio).toFixed(2) }}</p>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                  <button @click="updateQty(item, -1)" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">-</button>
                  <span class="w-8 text-center text-sm font-bold text-gray-800 dark:text-gray-200">{{ item.cantidad }}</span>
                  <button @click="updateQty(item, 1)" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-500 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Footer -->
        <div v-if="cart.length > 0" class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
          <div class="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${{ cartTotalAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center text-lg font-black text-gray-900 dark:text-white">
            <span>Total a Pagar</span>
            <span class="text-brand-500">${{ cartTotalAmount.toFixed(2) }}</span>
          </div>

          <div class="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre o Número de Mesa <span class="text-red-500">*</span></label>
              <input v-model="customerName" type="text" placeholder="Ej. Mesa 4 o Maria" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" />
            </div>

            <button 
              @click="enviarOrden"
              :disabled="isSending || !customerName.trim()"
              class="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-all flex justify-center shadow-lg shadow-brand-500/25"
            >
              <span v-if="isSending" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Procesando...
              </span>
              <span v-else>Confirmar Pedido</span>
            </button>
          </div>
        </div>

      </div>
    </div>
    
    <!-- Modal de Orden Exitosa -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showSuccessModal = false"></div>
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full mx-auto relative z-10 shadow-2xl transform transition-all text-center">
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Orden Recibida!</h3>
        <p class="text-gray-500 dark:text-gray-400 font-medium mb-6">
          Tu pedido está en la cocina preparándose con amor. 
          <br><br>
          <span class="text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold">Folio de Orden</span><br>
          <span class="text-3xl font-black text-gray-900 dark:text-white">#{{ orderFolio }}</span>
        </p>
        <button 
          @click="showSuccessModal = false"
          class="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95"
        >
          ¡Excelente!
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const categorias = ref<string[]>([])
const categoriaActiva = ref('Todos')
const productos = ref<any[]>([])
const loading = ref(true)

const API_BASE = import.meta.env.VITE_API_URL ?? ''

const errorCarta = ref('')

// Fetch real desde backend (misma db que admin)
const fetchCarta = async () => {
  try {
    const res = await fetch(`${API_BASE}/carta`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.success) {
      // Filtrar no disponibles
      const items = json.data.filter((p: any) => p.disponible !== false)
      productos.value = items
      // Obtener categorías únicas
      const catSet = new Set(items.map((p: any) => p.categoria))
      categorias.value = Array.from(catSet) as string[]
    } else {
      errorCarta.value = 'No se pudo cargar el menú.'
    }
  } catch (err: any) {
    console.error('Error fetching menu:', err)
    errorCarta.value = `Error al conectar con el servidor: ${err.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCarta()
})

const productosFiltrados = computed(() => {
  if (categoriaActiva.value === 'Todos') return productos.value
  return productos.value.filter(p => p.categoria === categoriaActiva.value)
})

// UI Helpers
const getDefaultImage = (categoria: string) => {
  const map: Record<string, string> = {
    'Bebida Fria': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400&fit=crop',
    'Bebida Caliente': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&fit=crop',
    'Comida': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&fit=crop',
    'Postres': 'https://images.unsplash.com/photo-1551024506-0cbdd828faa4?q=80&w=400&fit=crop',
    'Panaderia': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&fit=crop'
  }
  return map[categoria] || 'https://images.unsplash.com/photo-1546069901-ba6a84c28646?q=80&w=400&fit=crop'
}

// ---- CART SYSTEM ----
interface CartItem {
  id: string; // key unica en carrito
  producto: any;
  cantidad: number;
}

const cart = ref<CartItem[]>([])
const showCart = ref(false)
const customerName = ref('')
const isSending = ref(false)

const showSuccessModal = ref(false)
const orderFolio = ref('')

const addToCart = (producto: any) => {
  const exist = cart.value.find(c => c.producto.id === producto.id)
  if (exist) {
    exist.cantidad++
  } else {
    cart.value.push({
      id: Date.now().toString(),
      producto,
      cantidad: 1
    })
  }
  showCart.value = true
}

const updateQty = (item: CartItem, delta: number) => {
  const nw = item.cantidad + delta
  if (nw <= 0) {
    cart.value = cart.value.filter(c => c.id !== item.id)
  } else {
    item.cantidad = nw
  }
}

const cartTotalItems = computed(() => cart.value.reduce((acc, c) => acc + c.cantidad, 0))
const cartTotalAmount = computed(() => cart.value.reduce((acc, c) => acc + (c.cantidad * parseFloat(c.producto.precio)), 0))

// ----- POST ORDER TO ADMIN KANBAN -----
const enviarOrden = async () => {
  if (!customerName.value.trim() || cart.value.length === 0) return
  isSending.value = true
  
  // Mapear al modelo que espera Kanban
  const orderItems = cart.value.map(c => ({
    producto: c.producto.nombre,
    cantidad: c.cantidad,
    precio: parseFloat(c.producto.precio)
  }))

  try {
    const res = await fetch(`${API_BASE}/ordenes_remotas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: customerName.value.trim(),
        origen: 'App Cliente',
        items: orderItems
      })
    })

    const json = await res.json()
    if (json.success) {
      // Limpiar carrito
      cart.value = []
      showCart.value = false
      customerName.value = ''
      
      // Mostrar modal de éxito
      orderFolio.value = json.data.id || 'Nuevo'
      showSuccessModal.value = true
    } else {
      alert("No se pudo procesar la orden: " + (json.message || "Error desconocido"))
    }
  } catch(err) {
    alert("Error al enviar la orden. Verifica la conexión.")
  } finally {
    isSending.value = false
  }
}
</script>

<style>
/* Transiciones suaves para la cuadrícula del Menú */
.menu-fade-move,
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Ocultar elementos salientes para no romper el grid */
.menu-fade-leave-active {
  position: absolute;
  visibility: hidden;
}

/* Ocultar barra de desplazamiento en filtros */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

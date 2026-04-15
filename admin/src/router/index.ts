import { createRouter, createWebHistory } from 'vue-router'

const EnDesarrollo = () => import('../views/Pages/EnDesarrollo.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // ── Estadísticas ──────────────────────────────────────────────
    {
      path: '/',
      name: 'Estadisticas',
      component: EnDesarrollo,
      meta: { title: 'Estadísticas' },
    },

    // ── Administración ────────────────────────────────────────────
    {
      path: '/admin/usuarios',
      name: 'Usuarios',
      component: () => import('../views/Pages/Administracion/Usuarios.vue'),
      meta: { title: 'Usuarios' },
    },
    {
      path: '/admin/compras',
      name: 'Compras',
      component: () => import('../views/Pages/Administracion/Compras.vue'),
      meta: { title: 'Compras' },
    },
    {
      path: '/admin/compras/desglose/:id',
      name: 'DesgloseCompra',
      component: () => import('../views/Pages/Administracion/Desglose.vue'),
      meta: { title: 'Desglose' },
    },
    {
      path: '/admin/gastos',
      name: 'Gastos',
      component: () => import('../views/Pages/Administracion/Gastos.vue'),
      meta: { title: 'Gastos' },
    },
    {
      path: '/admin/inventarios',
      name: 'Inventarios',
      component: () => import('../views/Pages/Administracion/Inventario.vue'),
      meta: { title: 'Inventario' },
    },
    {
      path: '/admin/recetas',
      name: 'Recetas',
      component: EnDesarrollo,
      meta: { title: 'Recetas' },
    },
    {
      path: '/admin/carta',
      name: 'Carta',
      component: EnDesarrollo,
      meta: { title: 'Carta' },
    },
    {
      path: '/admin/clientes',
      name: 'Clientes',
      component: EnDesarrollo,
      meta: { title: 'Clientes' },
    },
    {
      path: '/admin/cxc',
      name: 'CXC',
      component: EnDesarrollo,
      meta: { title: 'CXC' },
    },

    // ── Caja ──────────────────────────────────────────────────────
    {
      path: '/caja/ordenes',
      name: 'Ordenes',
      component: EnDesarrollo,
      meta: { title: 'Órdenes' },
    },
    {
      path: '/caja/pos',
      name: 'POS',
      component: EnDesarrollo,
      meta: { title: 'POS' },
    },
    {
      path: '/caja/ventas',
      name: 'Ventas',
      component: EnDesarrollo,
      meta: { title: 'Ventas' },
    },
    {
      path: '/caja/reportes',
      name: 'Reportes',
      component: EnDesarrollo,
      meta: { title: 'Reportes' },
    },

    // ── Errores ───────────────────────────────────────────────────
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Signin' },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Admin'} | Bambu Lomas`
  next()
})

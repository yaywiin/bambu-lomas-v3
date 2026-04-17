import { createRouter, createWebHistory } from 'vue-router'
import Carta from '../views/Carta.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Carta',
      component: Carta,
    }
  ],
})

export default router

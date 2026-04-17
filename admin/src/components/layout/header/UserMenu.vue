<template>
  <div class="relative flex items-center gap-4">
    <!-- User Info -->
    <div v-if="currentUser" class="hidden sm:flex flex-col items-end text-right">
      <span class="text-sm font-semibold text-gray-800 dark:text-white/90">{{ currentUser.usuario || currentUser.nombre }}</span>
      <span class="text-xs font-medium text-brand-500 dark:text-brand-400 capitalize">{{ currentUser.rol }}</span>
    </div>

    <!-- Divider (optional, looks nice) -->
    <div v-if="currentUser" class="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

    <!-- Sign Out -->
    <router-link
      to="/signin"
      @click="handleLogout"
      class="flex items-center gap-2.5 px-3 py-2 font-medium text-error-500 rounded-lg group text-theme-sm hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10 dark:hover:text-error-400 transition-colors"
      title="Cerrar sesión"
    >
      <LogoutIcon class="text-error-500 group-hover:text-error-600 dark:group-hover:text-error-400" />
      <span class="hidden md:inline">Cerrar Sesión</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { LogoutIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { currentUser, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

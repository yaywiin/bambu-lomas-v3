<template>
  <div class="relative">
    <router-link
      to="/signin"
      class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
    >
      <LogoutIcon
        class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
      />
      Sign out
    </router-link>
  </div>
</template>

<script setup>
import { LogoutIcon } from '@/icons'
import { RouterLink } from 'vue-router'
</script>

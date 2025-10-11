<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Navigation Bar -->
    <nav class="bg-white dark:bg-gray-800 shadow-soft border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo dan Brand -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
            <h1 class="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">Expense Tracker</h1>
            </router-link>
          </div>

          <!-- Desktop Navigation & Dark Mode Toggle -->
          <div class="hidden md:block">
            <div class="flex items-center space-x-6">
              <router-link
                v-for="item in menuItems"
                :key="item.name"
                :to="item.path"
                class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                :class="{ 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30': $route.path === item.path }"
              >
                <component :is="item.icon" class="w-5 h-5 inline mr-2" />
                {{ item.name }}
              </router-link>
              
              <!-- Dark Mode Toggle -->
              <button
                @click="toggleDarkMode"
                class="p-2 rounded-lg transition-all duration-200 
                       bg-gray-100 hover:bg-gray-200 
                       dark:bg-gray-700 dark:hover:bg-gray-600
                       text-gray-600 dark:text-gray-300"
                :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              >
                <!-- Sun Icon (Light Mode) -->
                <svg 
                  v-if="!isDark"
                  class="w-5 h-5 text-yellow-500 transform rotate-0 transition-transform duration-200" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                </svg>
                
                <!-- Moon Icon (Dark Mode) -->
                <svg 
                  v-else
                  class="w-5 h-5 text-blue-400 transform rotate-0 transition-transform duration-200" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center space-x-2">
            <!-- Mobile Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg transition-all duration-200 
                     bg-gray-100 hover:bg-gray-200 
                     dark:bg-gray-700 dark:hover:bg-gray-600
                     text-gray-600 dark:text-gray-300"
            >
              <svg 
                v-if="!isDark"
                class="w-5 h-5 text-yellow-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg 
                v-else
                class="w-5 h-5 text-blue-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-100 dark:border-gray-700">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors duration-200"
            :class="{ 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30': $route.path === item.path }"
          >
            <component :is="item.icon" class="w-5 h-5 inline mr-2" />
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-12 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            © {{ currentYear }} Dwiki Noviandika. Dibuat dengan ❤️ menggunakan Vue.js dan Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>

    <!-- Toast Notifications Container -->
    <div class="fixed top-20 right-4 z-50 space-y-2">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :message="toast.message"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, provide, reactive } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'

// Import icons dari Heroicons
import {
  HomeIcon,
  CurrencyDollarIcon,
  TagIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'App',
  components: {
    HomeIcon,
    CurrencyDollarIcon,
    TagIcon,
    ChartBarIcon,
    PlusIcon,
  },
  setup() {
    const mobileMenuOpen = ref(false)
    const toasts = reactive([])
    
    // Dark mode functionality
    const { isDark, toggleDarkMode } = useDarkMode()

    // Menu items untuk navigasi
    const menuItems = [
      {
        name: 'Dashboard',
        path: '/',
        icon: 'HomeIcon'
      },
      {
        name: 'Pengeluaran',
        path: '/pengeluaran',
        icon: 'CurrencyDollarIcon'
      },
      {
        name: 'Kategori',
        path: '/kategori',
        icon: 'TagIcon'
      },
      {
        name: 'Laporan',
        path: '/laporan',
        icon: 'ChartBarIcon'
      }
    ]

    // Tahun saat ini untuk footer
    const currentYear = computed(() => new Date().getFullYear())

    // Toast notification system
    let toastId = 0

    const addToast = (type, message, duration = 5000) => {
      const id = ++toastId
      toasts.push({
        id,
        type,
        message,
        duration
      })
    }

    const removeToast = (id) => {
      const index = toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        toasts.splice(index, 1)
      }
    }

    // Provide toast functions untuk digunakan di komponen lain
    provide('toast', {
      success: (message, duration) => addToast('success', message, duration),
      error: (message, duration) => addToast('error', message, duration),
      warning: (message, duration) => addToast('warning', message, duration),
      info: (message, duration) => addToast('info', message, duration),
    })

    return {
      mobileMenuOpen,
      menuItems,
      currentYear,
      toasts,
      addToast,
      removeToast,
      isDark,
      toggleDarkMode
    }
  }
}
</script>

<style>
/* Global styles sudah di main.css */
</style>
<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
    <!-- Navigation Bar (hanya tampil jika user sudah login) -->
    <nav v-if="isAuthenticated && !isAuthPage" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300 animate-slideDown">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo dan Brand -->
          <div class="flex items-center animate-scaleIn">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 class="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 dark:from-primary-400 dark:via-purple-400 dark:to-pink-400 group-hover:scale-105 transition-transform duration-300">Expense Tracker</h1>
            </router-link>
          </div>

          <!-- Desktop Navigation & Dark Mode Toggle -->
          <div class="hidden md:block">
            <div class="flex items-center space-x-6">
              <router-link
                v-for="item in menuItems"
                :key="item.name"
                :to="item.path"
                class="relative text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group"
                :class="{ 
                  'text-primary-600 dark:text-primary-400 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/20 shadow-md': $route.path === item.path 
                }"
              >
                <component :is="item.icon" class="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform duration-300" />
                {{ item.name }}
                <span v-if="$route.path === item.path" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></span>
              </router-link>
              
              <!-- Profile Dropdown -->
              <div class="relative">
                <button
                  @click="profileDropdownOpen = !profileDropdownOpen"
                  class="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span class="hidden md:block font-medium">{{ currentUser?.username || 'User' }}</span>
                  <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': profileDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <transition name="dropdown">
                  <div
                    v-if="profileDropdownOpen"
                    class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    @click.stop
                  >
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ currentUser?.username || 'User' }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ currentUser?.email || '' }}</p>
                    </div>
                    <div class="py-1">
                      <router-link
                        to="/profile/edit"
                        @click="profileDropdownOpen = false"
                        class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Edit Profile
                      </router-link>
                      <button
                        @click="handleLogout"
                        class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
              
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
            <!-- Profile Dropdown Mobile -->
            <div class="relative">
              <button
                @click="profileDropdownOpen = !profileDropdownOpen"
                class="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': profileDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu Mobile -->
              <transition name="dropdown">
                <div
                  v-if="profileDropdownOpen"
                  class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  @click.stop
                >
                  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ currentUser?.username || 'User' }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ currentUser?.email || '' }}</p>
                  </div>
                  <div class="py-1">
                    <router-link
                      to="/profile/edit"
                      @click="profileDropdownOpen = false"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </router-link>
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </transition>
            </div>
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
    <main class="flex-1 animate-fadeIn">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Footer (hanya tampil jika user sudah login) -->
    <footer v-if="isAuthenticated && !isAuthPage" class="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-12 transition-colors duration-200">
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
import { ref, computed, provide, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import { authService } from '@/services/api'

// Import icons dari Heroicons
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'App',
  components: {
    HomeIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const mobileMenuOpen = ref(false)
    const profileDropdownOpen = ref(false)
    const toasts = reactive([])
    const currentUser = ref(null)
    
    // Dark mode functionality
    const { isDark, toggleDarkMode } = useDarkMode()
    
    // Check authentication
    const isAuthenticated = computed(() => authService.isAuthenticated())
    const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')
    
    // Get current user
    const updateCurrentUser = () => {
      currentUser.value = authService.getCurrentUser()
    }
    
    // Logout handler
    const handleLogout = async () => {
      profileDropdownOpen.value = false
      try {
        await authService.logout()
        currentUser.value = null
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        // Force logout even if API call fails
        currentUser.value = null
        router.push('/login')
      }
    }
    
    // Update user on mount and route change
    onMounted(() => {
      updateCurrentUser()
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
          profileDropdownOpen.value = false
        }
      })
    })

    // Watch route changes to update user
    watch(() => route.path, () => {
      updateCurrentUser()
    })

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
      profileDropdownOpen,
      menuItems,
      currentYear,
      toasts,
      addToast,
      removeToast,
      isDark,
      toggleDarkMode,
      isAuthenticated,
      isAuthPage,
      currentUser,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Page transition animations */
.page-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active {
  transition: all 0.3s cubic-bezier(0.7, 0, 0.84, 0);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dropdown animations */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 2s"></div>
    </div>
    
    <div class="max-w-md w-full space-y-8 relative z-10 animate-scaleIn">
      <!-- Header -->
      <div class="animate-slideDown">
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-float">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h2 class="text-center text-4xl font-black text-gray-900 dark:text-white mb-2 gradient-text">
          Masuk ke akun Anda
        </h2>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
          Atau
          <router-link to="/register" class="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
            daftar akun baru
          </router-link>
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-slideUp">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <!-- Email -->
            <div class="animate-slideUp" style="animation-delay: 0.1s">
              <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="form-input"
                placeholder="nama@email.com"
              />
            </div>

            <!-- Password -->
            <div class="animate-slideUp" style="animation-delay: 0.2s">
              <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="form-input"
                placeholder="Password Anda"
              />
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <div v-if="errorMessage" class="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-700 p-4 animate-slideDown">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-red-800 dark:text-red-200">
                    {{ errorMessage }}
                  </p>
                </div>
              </div>
            </div>
          </transition>

          <!-- Submit Button -->
          <div class="animate-slideUp" style="animation-delay: 0.3s">
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full text-base py-3"
            >
              <span v-if="!loading" class="flex items-center justify-center">
                <span>Masuk</span>
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const errorMessage = ref('')
    const form = ref({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      loading.value = true
      errorMessage.value = ''

      try {
        const response = await authService.login(form.value.email, form.value.password)
        
        if (response.success) {
          // Redirect to dashboard
          router.push('/')
        } else {
          errorMessage.value = response.message || 'Login gagal'
        }
      } catch (error) {
        errorMessage.value = error.message || 'Terjadi kesalahan saat login'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      errorMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>


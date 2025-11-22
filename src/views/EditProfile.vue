<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
    <!-- Header -->
    <div class="mb-8 animate-slideDown">
      <div class="flex items-center space-x-4 mb-4">
        <button
          @click="$router.go(-1)"
          class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-4xl font-black text-gray-900 dark:text-white mb-2 gradient-text">Edit Profile</h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">Perbarui informasi profil Anda</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="card dark:bg-gray-800 dark:border-gray-700 animate-slideUp">
      <form @submit.prevent="submitForm">
        <div class="card-body space-y-6">
          <!-- Username -->
          <div>
            <label class="form-label dark:text-gray-200">
              Username <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.username"
              type="text"
              placeholder="Masukkan username"
              class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.username }"
              required
            >
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="form-label dark:text-gray-200">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="nama@email.com"
              class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.email }"
              required
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">Ubah Password</span>
            </div>
          </div>

          <!-- Current Password -->
          <div>
            <label class="form-label dark:text-gray-200">
              Password Lama
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Masukkan password lama"
                class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 pr-10"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.currentPassword }"
              >
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600">{{ errors.currentPassword }}</p>
          </div>

          <!-- New Password -->
          <div>
            <label class="form-label dark:text-gray-200">
              Password Baru
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Masukkan password baru (min. 6 karakter)"
                class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 pr-10"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.newPassword }"
              >
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">{{ errors.newPassword }}</p>
          </div>

          <!-- Confirm New Password -->
          <div>
            <label class="form-label dark:text-gray-200">
              Konfirmasi Password Baru
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Konfirmasi password baru"
                class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 pr-10"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.confirmPassword }"
              >
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            <p v-if="passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword" class="mt-1 text-sm text-green-600">
              ✓ Password cocok
            </p>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <div v-if="errorMessage" class="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-700 p-4">
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

          <!-- Success Message -->
          <transition name="fade">
            <div v-if="successMessage" class="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-green-800 dark:text-green-200">
                    {{ successMessage }}
                  </p>
                </div>
              </div>
            </div>
          </transition>

          <!-- Password Error Message -->
          <transition name="fade">
            <div v-if="passwordErrorMessage" class="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-700 p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-red-800 dark:text-red-200">
                    {{ passwordErrorMessage }}
                  </p>
                </div>
              </div>
            </div>
          </transition>

          <!-- Password Success Message -->
          <transition name="fade">
            <div v-if="passwordSuccessMessage" class="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-green-800 dark:text-green-200">
                    {{ passwordSuccessMessage }}
                  </p>
                </div>
              </div>
            </div>
          </transition>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$router.go(-1)"
              class="btn-secondary"
              :disabled="loading"
            >
              Batal
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading || loadingPassword"
            >
              <span v-if="!loading" class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Simpan Perubahan
              </span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loadingPassword ? 'Mengubah password...' : 'Menyimpan...' }}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'EditProfile',
  components: {
    ArrowLeftIcon,
  },
  setup() {
    const router = useRouter()
    const toast = inject('toast')
    const loading = ref(false)
    const loadingPassword = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')
    const passwordErrorMessage = ref('')
    const passwordSuccessMessage = ref('')
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)
    const form = ref({
      username: '',
      email: ''
    })
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const errors = ref({})
    const passwordErrors = ref({})

    // Load user data
    const loadUserData = async () => {
      try {
        loading.value = true
        const currentUser = authService.getCurrentUser()
        
        if (currentUser) {
          form.value = {
            username: currentUser.username || '',
            email: currentUser.email || ''
          }
        } else {
          // Fetch from API if not in localStorage
          const response = await authService.getProfile()
          if (response.success && response.data) {
            form.value = {
              username: response.data.username || '',
              email: response.data.email || ''
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Gagal memuat data profil: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // Validate form
    const validateForm = () => {
      errors.value = {}
      
      if (!form.value.username || form.value.username.trim().length < 3) {
        errors.value.username = 'Username minimal 3 karakter'
        return false
      }

      if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Email tidak valid'
        return false
      }

      return true
    }

    // Validate password form
    const validatePasswordForm = () => {
      passwordErrors.value = {}
      
      // Check if any password field is filled
      const hasAnyPassword = passwordForm.value.currentPassword || 
                            passwordForm.value.newPassword || 
                            passwordForm.value.confirmPassword

      if (!hasAnyPassword) {
        // If no password field is filled, skip validation (optional change)
        return true
      }

      // If any field is filled, all must be filled
      if (!passwordForm.value.currentPassword) {
        passwordErrors.value.currentPassword = 'Password lama harus diisi'
        return false
      }

      if (!passwordForm.value.newPassword) {
        passwordErrors.value.newPassword = 'Password baru harus diisi'
        return false
      }

      if (passwordForm.value.newPassword.length < 6) {
        passwordErrors.value.newPassword = 'Password baru minimal 6 karakter'
        return false
      }

      if (!passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword = 'Konfirmasi password harus diisi'
        return false
      }

      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword = 'Password baru dan konfirmasi password tidak cocok'
        return false
      }

      return true
    }

    // Submit form
    const submitForm = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      errors.value = {}

      if (!validateForm()) {
        return
      }

      // Validate password only if any password field is filled
      const hasPasswordData = passwordForm.value.currentPassword || 
                             passwordForm.value.newPassword || 
                             passwordForm.value.confirmPassword
      
      if (hasPasswordData && !validatePasswordForm()) {
        return
      }

      try {
        loading.value = true
        
        // Update profile
        const profileResponse = await authService.updateProfile(
          form.value.username.trim(),
          form.value.email.trim()
        )
        
        if (!profileResponse.success) {
          errorMessage.value = profileResponse.message || 'Gagal memperbarui profile'
          toast.error(errorMessage.value)
          loading.value = false
          return
        }

        // Update password if all password fields are filled
        const hasPasswordData = passwordForm.value.currentPassword && 
                               passwordForm.value.newPassword && 
                               passwordForm.value.confirmPassword

        if (hasPasswordData) {
          try {
            loadingPassword.value = true
            const passwordResponse = await authService.updatePassword(
              passwordForm.value.currentPassword,
              passwordForm.value.newPassword,
              passwordForm.value.confirmPassword
            )

            if (passwordResponse.success) {
              passwordSuccessMessage.value = 'Password berhasil diubah!'
              toast.success('Profile dan password berhasil diperbarui')
              // Reset password form
              passwordForm.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              }
            } else {
              passwordErrorMessage.value = passwordResponse.message || 'Gagal mengubah password'
              toast.error(passwordErrorMessage.value)
              
              // Set field errors if available
              if (passwordResponse.errors) {
                passwordErrors.value = passwordResponse.errors
              }
            }
          } catch (passwordError) {
            passwordErrorMessage.value = passwordError.response?.data?.message || passwordError.message || 'Terjadi kesalahan saat mengubah password'
            toast.error(passwordErrorMessage.value)
            
            if (passwordError.response?.data?.errors) {
              passwordErrors.value = passwordError.response.data.errors
            }
          } finally {
            loadingPassword.value = false
          }
        } else {
          successMessage.value = 'Profile berhasil diperbarui!'
          toast.success('Profile berhasil diperbarui')
        }
        
        // Update current user in App.vue by reloading
        if (hasPasswordData && passwordSuccessMessage.value) {
          setTimeout(() => {
            router.go(-1)
          }, 2000)
        } else if (!hasPasswordData) {
          setTimeout(() => {
            router.go(-1)
          }, 1500)
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || error.message || 'Terjadi kesalahan saat memperbarui profile'
        toast.error(errorMessage.value)
        
        // Set field errors if available
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadUserData()
    })

    return {
      form,
      passwordForm,
      errors,
      passwordErrors,
      loading,
      loadingPassword,
      errorMessage,
      successMessage,
      passwordErrorMessage,
      passwordSuccessMessage,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      submitForm
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


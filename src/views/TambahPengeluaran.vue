<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <button
          @click="$router.go(-1)"
          class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tambah Pengeluaran</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Catat pengeluaran baru Anda</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="card dark:bg-gray-800 dark:border-gray-700">
      <form @submit.prevent="submitForm">
        <div class="card-body space-y-6">
          <!-- Judul Pengeluaran -->
          <div>
            <label class="form-label dark:text-gray-200">
              Judul Pengeluaran <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.judul"
              type="text"
              placeholder="Contoh: Makan siang di restoran"
              class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.judul }"
              required
            >
            <p v-if="errors.judul" class="mt-1 text-sm text-red-600">{{ errors.judul }}</p>
          </div>

          <!-- Jumlah dan Kategori -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Jumlah -->
            <div>
              <label class="form-label dark:text-gray-200">
                Jumlah <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Rp</span>
                </div>
                <input
                  v-model="form.jumlah"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  class="form-input pl-10 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                  :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.jumlah }"
                  required
                  @input="formatJumlah"
                >
              </div>
              <p v-if="errors.jumlah" class="mt-1 text-sm text-red-600">{{ errors.jumlah }}</p>
              <p v-if="form.jumlah" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ formatRupiah(form.jumlah) }}
              </p>
            </div>

            <!-- Kategori -->
            <div>
              <label class="form-label dark:text-gray-200">Kategori</label>
              <select
                v-model="form.kategori_id"
                class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.kategori_id }"
              >
                <option value="">Pilih Kategori</option>
                <option
                  v-for="kategori in daftarKategori"
                  :key="kategori.id"
                  :value="kategori.id"
                >
                  {{ kategori.nama }}
                </option>
              </select>
              <p v-if="errors.kategori_id" class="mt-1 text-sm text-red-600">{{ errors.kategori_id }}</p>
            </div>
          </div>

          <!-- Tanggal Transaksi -->
          <div>
            <label class="form-label dark:text-gray-200">
              Tanggal Transaksi <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.tanggal_transaksi"
              type="date"
              class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.tanggal_transaksi }"
              required
            >
            <p v-if="errors.tanggal_transaksi" class="mt-1 text-sm text-red-600">{{ errors.tanggal_transaksi }}</p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="form-label dark:text-gray-200">Deskripsi</label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              placeholder="Tambahkan catatan atau deskripsi (opsional)"
              class="form-input resize-none dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.deskripsi }"
            ></textarea>
            <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">{{ errors.deskripsi }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ form.deskripsi.length }}/500 karakter
            </p>
          </div>

          <!-- Quick Amount Buttons -->
          <div>
            <label class="form-label dark:text-gray-200">Jumlah Cepat</label>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                v-for="amount in quickAmounts"
                :key="amount"
                type="button"
                @click="setQuickAmount(amount)"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-700 dark:text-gray-200 
                       hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {{ formatRupiah(amount) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="card-body border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="$router.go(-1)"
              class="btn-secondary"
              :disabled="loading"
            >
              Batal
            </button>
            
            <div class="flex items-center space-x-3">
              <!-- Save & Add Another -->
              <button
                type="button"
                @click="submitForm(true)"
                class="btn-secondary"
                :disabled="loading"
              >
                <span v-if="loading">Menyimpan...</span>
                <span v-else>Simpan & Tambah Lagi</span>
              </button>
              
              <!-- Save -->
              <button
                type="submit"
                class="btn-primary"
                :disabled="loading || !isFormValid"
              >
                <span v-if="loading" class="flex items-center">
                  <LoadingSpinner size="xs" color="white" class="mr-2" />
                  Menyimpan...
                </span>
                <span v-else>Simpan Pengeluaran</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Tips Card -->
    <div class="mt-8 card bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
      <div class="card-body">
        <div class="flex items-start space-x-3">
          <InformationCircleIcon class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Tips Pencatatan Pengeluaran</h3>
            <ul class="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Catat pengeluaran sesegera mungkin agar tidak lupa</li>
              <li>• Gunakan judul yang deskriptif untuk memudahkan pencarian</li>
              <li>• Pilih kategori yang tepat untuk analisis yang lebih baik</li>
              <li>• Tambahkan deskripsi untuk detail tambahan jika diperlukan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { pengeluaranService, kategoriService } from '@/services/api'

// Import icons
import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'TambahPengeluaran',
  components: {
    ArrowLeftIcon,
    InformationCircleIcon,
  },
  setup() {
    const router = useRouter()
    const toast = inject('toast')
    const loading = ref(false)
    const daftarKategori = ref([])

    // Form data
    const form = ref({
      judul: '',
      jumlah: '',
      kategori_id: '',
      tanggal_transaksi: new Date().toISOString().split('T')[0],
      deskripsi: ''
    })

    // Form errors
    const errors = ref({})

    // Quick amount buttons
    const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000]

    // Computed properties
    const isFormValid = computed(() => {
      return form.value.judul.trim() && 
             form.value.jumlah && 
             parseFloat(form.value.jumlah) > 0 && 
             form.value.tanggal_transaksi
    })

    // Format functions
    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatJumlah = (event) => {
      // Remove any non-numeric characters except decimal point
      let value = event.target.value.replace(/[^\d.]/g, '')
      
      // Ensure only one decimal point
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      form.value.jumlah = value
    }

    // Load categories
    const loadKategori = async () => {
      try {
        const response = await kategoriService.dapatkanSemua()
        daftarKategori.value = response.data || []
      } catch (error) {
        console.error('Error loading kategori:', error)
        toast.error('Gagal memuat data kategori: ' + error.message)
      }
    }

    // Set quick amount
    const setQuickAmount = (amount) => {
      form.value.jumlah = amount.toString()
    }

    // Validate form
    const validateForm = () => {
      const newErrors = {}

      if (!form.value.judul.trim()) {
        newErrors.judul = 'Judul harus diisi'
      } else if (form.value.judul.length < 3) {
        newErrors.judul = 'Judul minimal 3 karakter'
      } else if (form.value.judul.length > 200) {
        newErrors.judul = 'Judul maksimal 200 karakter'
      }

      if (!form.value.jumlah) {
        newErrors.jumlah = 'Jumlah harus diisi'
      } else if (parseFloat(form.value.jumlah) <= 0) {
        newErrors.jumlah = 'Jumlah harus lebih besar dari 0'
      }

      if (!form.value.tanggal_transaksi) {
        newErrors.tanggal_transaksi = 'Tanggal transaksi harus diisi'
      }

      if (form.value.deskripsi.length > 500) {
        newErrors.deskripsi = 'Deskripsi maksimal 500 karakter'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    // Submit form
    const submitForm = async (addAnother = false) => {
      if (!validateForm()) {
        toast.error('Mohon perbaiki kesalahan pada form')
        return
      }

      try {
        loading.value = true

        const data = {
          judul: form.value.judul.trim(),
          jumlah: parseFloat(form.value.jumlah),
          kategori_id: form.value.kategori_id || null,
          tanggal_transaksi: form.value.tanggal_transaksi,
          deskripsi: form.value.deskripsi.trim()
        }

        await pengeluaranService.tambah(data)
        toast.success('Pengeluaran berhasil ditambahkan')

        if (addAnother) {
          // Reset form for adding another
          form.value = {
            judul: '',
            jumlah: '',
            kategori_id: form.value.kategori_id, // Keep the same category
            tanggal_transaksi: new Date().toISOString().split('T')[0], // Reset to today
            deskripsi: ''
          }
          errors.value = {}
        } else {
          // Navigate back to list
          router.push('/pengeluaran')
        }

      } catch (error) {
        console.error('Error saving pengeluaran:', error)
        toast.error('Gagal menyimpan pengeluaran: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadKategori()
    })

    return {
      form,
      errors,
      loading,
      daftarKategori,
      quickAmounts,
      isFormValid,
      formatRupiah,
      formatJumlah,
      setQuickAmount,
      submitForm
    }
  }
}
</script>
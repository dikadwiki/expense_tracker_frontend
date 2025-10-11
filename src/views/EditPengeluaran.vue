<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loadingData" class="space-y-6">
      <div class="flex items-center space-x-4 mb-8">
        <div class="loading-shimmer w-8 h-8 rounded-lg"></div>
        <div>
          <div class="loading-shimmer h-8 w-48 rounded mb-2"></div>
          <div class="loading-shimmer h-4 w-32 rounded"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-body space-y-6">
          <div class="loading-shimmer h-20 rounded-lg"></div>
          <div class="grid grid-cols-2 gap-6">
            <div class="loading-shimmer h-20 rounded-lg"></div>
            <div class="loading-shimmer h-20 rounded-lg"></div>
          </div>
          <div class="loading-shimmer h-20 rounded-lg"></div>
          <div class="loading-shimmer h-32 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="pengeluaran">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button
            @click="$router.go(-1)"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Pengeluaran</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Perbarui informasi pengeluaran</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="card">
        <form @submit.prevent="submitForm">
          <div class="card-body space-y-6">
            <!-- Judul Pengeluaran -->
            <div>
              <label class="form-label">
                Judul Pengeluaran <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.judul"
                type="text"
                placeholder="Contoh: Makan siang di restoran"
                class="form-input"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.judul }"
                required
              >
              <p v-if="errors.judul" class="mt-1 text-sm text-red-600">{{ errors.judul }}</p>
            </div>

            <!-- Jumlah dan Kategori -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Jumlah -->
              <div>
                <label class="form-label">
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
                    class="form-input pl-10"
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
                <label class="form-label">Kategori</label>
                <select
                  v-model="form.kategori_id"
                  class="form-input"
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
              <label class="form-label">
                Tanggal Transaksi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.tanggal_transaksi"
                type="date"
                class="form-input"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.tanggal_transaksi }"
                required
              >
              <p v-if="errors.tanggal_transaksi" class="mt-1 text-sm text-red-600">{{ errors.tanggal_transaksi }}</p>
            </div>

            <!-- Deskripsi -->
            <div>
              <label class="form-label">Deskripsi</label>
              <textarea
                v-model="form.deskripsi"
                rows="3"
                placeholder="Tambahkan catatan atau deskripsi (opsional)"
                class="form-input resize-none"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.deskripsi }"
              ></textarea>
              <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">{{ errors.deskripsi }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ form.deskripsi.length }}/500 karakter
              </p>
            </div>

            <!-- Quick Amount Buttons -->
            <div>
              <label class="form-label">Jumlah Cepat</label>
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button
                  v-for="amount in quickAmounts"
                  :key="amount"
                  type="button"
                  @click="setQuickAmount(amount)"
                  class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {{ formatRupiah(amount) }}
                </button>
              </div>
            </div>

            <!-- Metadata -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Informasi</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span class="font-medium">Dibuat:</span>
                  {{ formatTanggalWaktu(pengeluaran.dibuat_pada) }}
                </div>
                <div v-if="pengeluaran.diperbarui_pada !== pengeluaran.dibuat_pada">
                  <span class="font-medium">Terakhir diubah:</span>
                  {{ formatTanggalWaktu(pengeluaran.diperbarui_pada) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="card-body border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="$router.go(-1)"
                  class="btn-secondary"
                  :disabled="loading"
                >
                  Batal
                </button>
                
                <button
                  type="button"
                  @click="confirmDelete"
                  class="btn-danger"
                  :disabled="loading"
                >
                  Hapus
                </button>
              </div>
              
              <button
                type="submit"
                class="btn-primary"
                :disabled="loading || !isFormValid || !hasChanges"
              >
                <span v-if="loading" class="flex items-center">
                  <LoadingSpinner size="xs" color="white" class="mr-2" />
                  Menyimpan...
                </span>
                <span v-else>Simpan Perubahan</span>
              </button>
            </div>
            
            <div v-if="!hasChanges" class="mt-2 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada perubahan untuk disimpan</p>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Pengeluaran Tidak Ditemukan</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Pengeluaran yang Anda cari tidak dapat ditemukan</p>
      <router-link to="/pengeluaran" class="btn-primary">
        Kembali ke Daftar Pengeluaran
      </router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalDialog
      :show="showDeleteModal"
      type="danger"
      :icon="ExclamationTriangleIcon"
      title="Hapus Pengeluaran"
      :message="`Apakah Anda yakin ingin menghapus pengeluaran '${pengeluaran?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      :show-default-buttons="true"
      cancel-text="Batal"
      confirm-text="Hapus"
      @close="showDeleteModal = false"
      @cancel="showDeleteModal = false"
      @confirm="deleteItem"
    />
  </div>
</template>


<script>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { pengeluaranService, kategoriService } from '@/services/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Import icons
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'EditPengeluaran',
  components: {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const toast = inject('toast')
    
    const loadingData = ref(true)
    const loading = ref(false)
    const pengeluaran = ref(null)
    const daftarKategori = ref([])
    const showDeleteModal = ref(false)

    // Form data
    const form = ref({
      judul: '',
      jumlah: '',
      kategori_id: '',
      tanggal_transaksi: '',
      deskripsi: ''
    })

    // Original form data untuk mendeteksi perubahan
    const originalForm = ref({})

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

    const hasChanges = computed(() => {
      return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
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

    const formatTanggalWaktu = (datetime) => {
      return format(new Date(datetime), 'dd MMM yyyy, HH:mm', { locale: id })
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

    // Load data functions
    const loadPengeluaran = async () => {
      try {
        const response = await pengeluaranService.dapatkanBerdasarkanId(props.id)
        pengeluaran.value = response.data

        // Fill form with existing data
        form.value = {
          judul: pengeluaran.value.judul || '',
          jumlah: pengeluaran.value.jumlah?.toString() || '',
          kategori_id: pengeluaran.value.kategori_id || '',
          tanggal_transaksi: pengeluaran.value.tanggal_transaksi || '',
          deskripsi: pengeluaran.value.deskripsi || ''
        }

        // Store original form data
        originalForm.value = { ...form.value }

      } catch (error) {
        console.error('Error loading pengeluaran:', error)
        toast.error('Gagal memuat data pengeluaran: ' + error.message)
        pengeluaran.value = null
      }
    }

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
    const submitForm = async () => {
      if (!validateForm()) {
        toast.error('Mohon perbaiki kesalahan pada form')
        return
      }

      if (!hasChanges.value) {
        toast.warning('Tidak ada perubahan untuk disimpan')
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

        await pengeluaranService.perbarui(props.id, data)
        toast.success('Pengeluaran berhasil diperbarui')

        // Update original form data
        originalForm.value = { ...form.value }

        // Navigate back to list
        router.push('/pengeluaran')

      } catch (error) {
        console.error('Error updating pengeluaran:', error)
        toast.error('Gagal memperbarui pengeluaran: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // Delete functions
    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    const deleteItem = async () => {
      try {
        loading.value = true
        await pengeluaranService.hapus(props.id)
        toast.success('Pengeluaran berhasil dihapus')
        router.push('/pengeluaran')
      } catch (error) {
        console.error('Error deleting pengeluaran:', error)
        toast.error('Gagal menghapus pengeluaran: ' + error.message)
        showDeleteModal.value = false
      } finally {
        loading.value = false
      }
    }

    // Load data on mount
    onMounted(async () => {
      try {
        loadingData.value = true
        await Promise.all([loadPengeluaran(), loadKategori()])
      } finally {
        loadingData.value = false
      }
    })

    // Watch for route changes (jika user navigate langsung ke URL lain dengan ID berbeda)
    watch(() => route.params.id, async (newId) => {
      if (newId && newId !== props.id) {
        loadingData.value = true
        await loadPengeluaran()
        loadingData.value = false
      }
    })

    return {
      loadingData,
      loading,
      pengeluaran,
      daftarKategori,
      form,
      errors,
      quickAmounts,
      showDeleteModal,
      isFormValid,
      hasChanges,
      formatRupiah,
      formatTanggalWaktu,
      formatJumlah,
      setQuickAmount,
      submitForm,
      confirmDelete,
      deleteItem
    }
  }
}
</script>
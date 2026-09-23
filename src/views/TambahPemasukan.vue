<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <button @click="$router.go(-1)" class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tambah Pemasukan</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Catat pemasukan baru Anda</p>
        </div>
      </div>
    </div>

    <div class="card dark:bg-gray-800 dark:border-gray-700">
      <form @submit.prevent="submitForm">
        <div class="card-body space-y-6">
          <div>
            <label class="form-label dark:text-gray-200">Judul Pemasukan <span class="text-red-500">*</span></label>
            <input v-model="form.judul" type="text" placeholder="Contoh: Gaji bulanan" class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100" :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.judul }" required>
            <p v-if="errors.judul" class="mt-1 text-sm text-red-600">{{ errors.judul }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label dark:text-gray-200">Nominal <span class="text-red-500">*</span></label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Rp</span>
                </div>
                <input v-model="form.jumlah" type="number" step="0.01" min="0" placeholder="0" class="form-input pl-10 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100" :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.jumlah }" required @input="formatJumlah">
              </div>
              <p v-if="errors.jumlah" class="mt-1 text-sm text-red-600">{{ errors.jumlah }}</p>
              <p v-if="form.jumlah" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ formatRupiah(form.jumlah) }}</p>
            </div>

            <div>
              <label class="form-label dark:text-gray-200">Kategori <span class="text-red-500">*</span></label>
              <select v-model="form.kategori_id" class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100" :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.kategori_id }">
                <option value="">{{ loadingKategori ? 'Memuat kategori...' : daftarKategori.length === 0 ? 'Kategori tidak tersedia' : 'Pilih Kategori' }}</option>
                <option v-for="kategori in daftarKategori" :key="kategori.id" :value="kategori.id">{{ kategori.nama }}</option>
              </select>
              <p v-if="errors.kategori_id" class="mt-1 text-sm text-red-600">{{ errors.kategori_id }}</p>
            </div>
          </div>

          <div>
            <label class="form-label dark:text-gray-200">Tanggal Transaksi <span class="text-red-500">*</span></label>
            <input v-model="form.tanggal_transaksi" type="date" class="form-input dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100" :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.tanggal_transaksi }" required>
            <p v-if="errors.tanggal_transaksi" class="mt-1 text-sm text-red-600">{{ errors.tanggal_transaksi }}</p>
          </div>

          <div>
            <label class="form-label dark:text-gray-200">Catatan</label>
            <textarea v-model="form.deskripsi" rows="3" placeholder="Tambahkan catatan atau detail pemasukan (opsional)" class="form-input resize-none dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100" :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.deskripsi }"></textarea>
            <p v-if="errors.deskripsi" class="mt-1 text-sm text-red-600">{{ errors.deskripsi }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ form.deskripsi.length }}/500 karakter</p>
          </div>
        </div>

        <div class="card-body border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <button type="button" @click="$router.go(-1)" class="btn-secondary" :disabled="loading">Batal</button>
            <button type="submit" class="btn-primary" :disabled="loading || !isFormValid">
              <span v-if="loading" class="flex items-center">
                <LoadingSpinner size="xs" color="white" class="mr-2" />
                Menyimpan...
              </span>
              <span v-else>Simpan Pemasukan</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { kategoriService, pemasukanService } from '@/services/api'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'TambahPemasukan',
  components: { ArrowLeftIcon },
  setup() {
    const router = useRouter()
    const toast = inject('toast')
    const loading = ref(false)
    const loadingKategori = ref(true)
    const daftarKategori = ref([])

    const form = ref({
      judul: '',
      jumlah: '',
      kategori_id: '',
      tanggal_transaksi: new Date().toISOString().split('T')[0],
      deskripsi: ''
    })

    const errors = ref({})

    const isFormValid = computed(() => {
      return form.value.judul.trim() &&
             form.value.jumlah &&
             parseFloat(form.value.jumlah) > 0 &&
             form.value.kategori_id &&
             form.value.tanggal_transaksi
    })

    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatJumlah = (event) => {
      let value = event.target.value.replace(/[^\d.]/g, '')
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }
      form.value.jumlah = value
    }

    const loadKategori = async () => {
      loadingKategori.value = true
      try {
        const response = await kategoriService.dapatkanSemua({ type: 'income' })
        const kategoriData = response && response.data ? response.data : []
        daftarKategori.value = kategoriData
      } catch (error) {
        console.error('Error loading income categories:', error)
        toast.error('Gagal memuat data kategori pemasukan: ' + (error.message || 'Unknown error'))
        daftarKategori.value = []
      } finally {
        loadingKategori.value = false
      }
    }

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
        newErrors.jumlah = 'Nominal harus diisi'
      } else if (parseFloat(form.value.jumlah) <= 0) {
        newErrors.jumlah = 'Nominal harus lebih besar dari 0'
      }

      if (!form.value.kategori_id) {
        newErrors.kategori_id = 'Kategori pemasukan harus dipilih'
      }

      if (!form.value.tanggal_transaksi) {
        newErrors.tanggal_transaksi = 'Tanggal transaksi harus diisi'
      }

      if (form.value.deskripsi.length > 500) {
        newErrors.deskripsi = 'Catatan maksimal 500 karakter'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) {
        toast.error('Mohon perbaiki kesalahan pada form')
        return
      }

      try {
        loading.value = true
        const data = {
          judul: form.value.judul.trim(),
          jumlah: parseFloat(form.value.jumlah),
          kategori_id: form.value.kategori_id,
          tanggal_transaksi: form.value.tanggal_transaksi,
          deskripsi: form.value.deskripsi.trim(),
          jenis: 'income'
        }

        await pemasukanService.tambah(data)
        toast.success('Pemasukan berhasil ditambahkan')
        router.push('/pemasukan')
      } catch (error) {
        console.error('Error saving income:', error)
        toast.error('Gagal menyimpan pemasukan: ' + error.message)
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
      loadingKategori,
      daftarKategori,
      isFormValid,
      formatRupiah,
      formatJumlah,
      submitForm
    }
  }
}
</script>

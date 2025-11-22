<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Daftar Pengeluaran</h1>
        <p class="mt-2 text-gray-600">Kelola dan pantau semua pengeluaran Anda</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/pengeluaran/tambah"
          class="btn-primary inline-flex items-center"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Tambah Pengeluaran
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="form-label">Cari Pengeluaran</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="Cari berdasarkan judul..."
                class="form-input pl-10"
                @input="debouncedSearch"
              >
              <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <!-- Kategori Filter -->
          <div>
            <label class="form-label">Kategori</label>
            <select v-model="filters.kategori" @change="applyFilters" class="form-input">
              <option value="">Semua Kategori</option>
              <option
                v-for="kategori in daftarKategori"
                :key="kategori.id"
                :value="kategori.id"
              >
                {{ kategori.nama }}
              </option>
            </select>
          </div>

          <!-- Tanggal Mulai -->
          <div>
            <label class="form-label">Tanggal Mulai</label>
            <input
              v-model="filters.tanggal_mulai"
              type="date"
              class="form-input"
              @change="applyFilters"
            >
          </div>

          <!-- Tanggal Akhir -->
          <div>
            <label class="form-label">Tanggal Akhir</label>
            <input
              v-model="filters.tanggal_akhir"
              type="date"
              class="form-input"
              @change="applyFilters"
            >
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="resetFilters"
              class="text-sm text-gray-600 hover:text-gray-900"
            >
              Reset Filter
            </button>
            <div class="text-sm text-gray-500">
              {{ filteredCount }} dari {{ totalCount }} pengeluaran
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium text-gray-700">Total:</span>
            <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400 text-money">
              {{ formatRupiah(totalFiltered) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="card">
      <!-- Loading State -->
      <div v-if="loading" class="card-body">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="loading-shimmer h-16 rounded-lg"></div>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else-if="pengeluaran.length > 0">
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Pengeluaran
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Jumlah
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="item in pengeluaran"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ item.judul }}
                  </div>
                  <div
                    v-if="item.deskripsi"
                    class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs"
                  >
                    {{ item.deskripsi }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div v-if="item.kategori_nama" class="flex items-center">
                  <div
                    class="w-3 h-3 rounded-full mr-2"
                    :style="{ backgroundColor: item.kategori_warna }"
                  ></div>
                  <span class="text-sm text-gray-900 dark:text-gray-100">
                    {{ item.kategori_nama }}
                  </span>
                </div>
                <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                  Tanpa Kategori
                </span>
              </td>

              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ formatTanggal(item.tanggal_transaksi) }}
              </td>

              <td class="px-6 py-4 text-right">
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-money">
                  {{ formatRupiah(item.jumlah) }}
                </span>
              </td>

              <td class="px-6 py-4 text-right space-x-2">
                <router-link
                  :to="`/pengeluaran/edit/${item.id}`"
                  class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
                >
                  Edit
                </router-link>
                <button
                  @click="confirmDelete(item)"
                  class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>



        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-gray-200">
          <div
            v-for="item in pengeluaran"
            :key="item.id"
            class="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <div
                    v-if="item.kategori_warna"
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: item.kategori_warna }"
                  ></div>
                  <span class="text-xs text-gray-500 truncate">
                    {{ item.kategori_nama || 'Tanpa Kategori' }}
                  </span>
                </div>
                <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.judul }}</h3>
                <p v-if="item.deskripsi" class="text-sm text-gray-500 truncate mt-1">
                  {{ item.deskripsi }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatTanggal(item.tanggal_transaksi) }}
                </p>
              </div>
              <div class="text-right ml-4">
                <p class="text-sm font-semibold text-gray-900 text-money">
                  {{ formatRupiah(item.jumlah) }}
                </p>
                <div class="mt-2 space-x-2">
                  <router-link
                    :to="`/pengeluaran/edit/${item.id}`"
                    class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="confirmDelete(item)"
                    class="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Menampilkan {{ ((currentPage - 1) * itemsPerPage) + 1 }} sampai 
              {{ Math.min(currentPage * itemsPerPage, totalCount) }} dari {{ totalCount }} hasil
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Sebelumnya
              </button>
              <div class="flex items-center space-x-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  class="px-3 py-1 text-sm border rounded-md"
                  :class="page === currentPage 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'border-gray-300 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card-body text-center py-12">
        <CurrencyDollarIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Pengeluaran</h3>
        <p class="text-gray-500 mb-6">
          {{ hasActiveFilters ? 'Tidak ada pengeluaran yang sesuai dengan filter' : 'Mulai catat pengeluaran pertama Anda' }}
        </p>
        <div class="space-x-3">
          <router-link
            v-if="!hasActiveFilters"
            to="/pengeluaran/tambah"
            class="btn-primary inline-flex items-center"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Tambah Pengeluaran
          </router-link>
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="btn-secondary"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ModalDialog
      :show="showDeleteModal"
      type="danger"
      :icon="ExclamationTriangleIcon"
      title="Hapus Pengeluaran"
      :message="`Apakah Anda yakin ingin menghapus pengeluaran '${selectedItem?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
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
import { pengeluaranService, kategoriService } from '@/services/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { debounce } from 'lodash'

// Import icons
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'DaftarPengeluaran',
  components: {
    PlusIcon,
    MagnifyingGlassIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
  },
  setup() {
    const toast = inject('toast')
    const loading = ref(true)
    const pengeluaran = ref([])
    const daftarKategori = ref([])
    const showDeleteModal = ref(false)
    const selectedItem = ref(null)

    // Filter state
    const filters = ref({
      search: '',
      kategori: '',
      tanggal_mulai: '',
      tanggal_akhir: ''
    })

    // Pagination state
    const currentPage = ref(1)
    const itemsPerPage = 20
    const totalCount = ref(0)
    const allPengeluaran = ref([])

    // Computed properties
    const hasActiveFilters = computed(() => {
      return filters.value.search || 
             filters.value.kategori || 
             filters.value.tanggal_mulai || 
             filters.value.tanggal_akhir
    })

    const filteredPengeluaran = computed(() => {
      let result = [...allPengeluaran.value]

      // Filter by search
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase()
        result = result.filter(item => 
          item.judul.toLowerCase().includes(searchTerm) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(searchTerm))
        )
      }

      // Filter by category
      if (filters.value.kategori) {
        result = result.filter(item => item.kategori_id == filters.value.kategori)
      }

      // Filter by date range
      if (filters.value.tanggal_mulai) {
        result = result.filter(item => 
          new Date(item.tanggal_transaksi) >= new Date(filters.value.tanggal_mulai)
        )
      }

      if (filters.value.tanggal_akhir) {
        result = result.filter(item => 
          new Date(item.tanggal_transaksi) <= new Date(filters.value.tanggal_akhir)
        )
      }

      return result
    })

    const filteredCount = computed(() => filteredPengeluaran.value.length)
    
    const totalFiltered = computed(() => {
      return filteredPengeluaran.value.reduce((sum, item) => sum + parseFloat(item.jumlah), 0)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredCount.value / itemsPerPage)
    })

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    // Watch filtered data and update pagination
    watch(filteredPengeluaran, (newData) => {
      currentPage.value = 1
      updateDisplayedData()
    })

    watch(currentPage, () => {
      updateDisplayedData()
    })

    const updateDisplayedData = () => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      pengeluaran.value = filteredPengeluaran.value.slice(start, end)
    }

    // Format functions
    const formatRupiah = (amount) => {
      if (!amount) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatTanggal = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: id })
    }

    // Load data functions
    const loadPengeluaran = async () => {
      try {
        loading.value = true
        const response = await pengeluaranService.dapatkanSemua({ limit: 1000 })
        allPengeluaran.value = response.data || []
        totalCount.value = allPengeluaran.value.length
        updateDisplayedData()
      } catch (error) {
        console.error('Error loading pengeluaran:', error)
        toast.error('Gagal memuat data pengeluaran: ' + error.message)
      } finally {
        loading.value = false
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

    // Filter functions
    const applyFilters = () => {
      // Filters are applied automatically through computed property
      // This function exists for explicit filter actions
    }

    const debouncedSearch = debounce(() => {
      applyFilters()
    }, 500)

    const resetFilters = () => {
      filters.value = {
        search: '',
        kategori: '',
        tanggal_mulai: '',
        tanggal_akhir: ''
      }
    }

    // Pagination functions
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    // Delete functions
    const confirmDelete = (item) => {
      selectedItem.value = item
      showDeleteModal.value = true
    }

    const deleteItem = async () => {
      if (!selectedItem.value) return

      try {
        await pengeluaranService.hapus(selectedItem.value.id)
        toast.success('Pengeluaran berhasil dihapus')
        
        // Remove from local data
        const index = allPengeluaran.value.findIndex(item => item.id === selectedItem.value.id)
        if (index > -1) {
          allPengeluaran.value.splice(index, 1)
          totalCount.value--
        }
        
        updateDisplayedData()
        showDeleteModal.value = false
        selectedItem.value = null
      } catch (error) {
        console.error('Error deleting pengeluaran:', error)
        toast.error('Gagal menghapus pengeluaran: ' + error.message)
      }
    }

    onMounted(() => {
      Promise.all([loadPengeluaran(), loadKategori()])
    })

    return {
      loading,
      pengeluaran,
      daftarKategori,
      filters,
      hasActiveFilters,
      filteredCount,
      totalCount,
      totalFiltered,
      currentPage,
      totalPages,
      visiblePages,
      itemsPerPage,
      showDeleteModal,
      selectedItem,
      formatRupiah,
      formatTanggal,
      applyFilters,
      debouncedSearch,
      resetFilters,
      changePage,
      confirmDelete,
      deleteItem
    }
  }
}
</script>